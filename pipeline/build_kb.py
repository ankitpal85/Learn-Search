"""
=================================================================
  DSA Revision Platform -- Knowledge Base Builder Pipeline
  YouTube Playlist -> Transcripts -> Embedding -> Qdrant Cloud
=================================================================
"""

import os
import sys
import io
import json
import time
import uuid

# Fix Windows console UTF-8
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from config.settings import (
    QDRANT_URL,
    QDRANT_API_KEY,
    COLLECTION_NAME,
    EMBED_MODEL_NAME,
    EMBEDDING_DIM,
    CHUNK_SECONDS,
    OVERLAP_SECONDS,
    TRANSCRIPT_LANGUAGES,
    BASE_DIR,
)
from embeddings.embedder import get_embed_model
from vectordb.client import get_qdrant_client
from vectordb.operations import ensure_collection_exists

DATA_DIR = os.path.join(BASE_DIR, "data")
TRANSCRIPT_DIR = os.path.join(DATA_DIR, "transcripts")
PROGRESS_FILE = os.path.join(DATA_DIR, "progress.json")
MAX_RETRIES = 5
RETRY_DELAY = 3
BATCH_SIZE = 32


def load_progress() -> dict:
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def save_progress(data: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    tmp = PROGRESS_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, PROGRESS_FILE)


def step1_fetch_playlist(playlist_url: str, progress: dict) -> dict:
    print("\n" + "-" * 60)
    print("  STEP 1/3 -- Playlist Metadata Fetch")
    print("-" * 60)

    if (
        progress.get("playlist_fetched")
        and progress.get("playlist_url") == playlist_url
        and progress.get("videos")
    ):
        count = len(progress["videos"])
        print(f"  [SKIP] Already fetched -- {count} videos in progress.json")
        return progress

    print(f"  URL: {playlist_url}")
    import yt_dlp

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            ydl_opts = {"quiet": True, "extract_flat": True, "skip_download": True}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(playlist_url, download=False)

            entries = info.get("entries") or [info]
            entries = [e for e in entries if e]

            videos = {}
            for i, entry in enumerate(entries):
                vid_id = entry.get("id") or f"vid_{i}"
                title = entry.get("title") or f"Video {i+1}"
                videos[vid_id] = {
                    "index": i + 1,
                    "title": title,
                    "url": f"https://www.youtube.com/watch?v={vid_id}",
                    "duration": entry.get("duration") or 0,
                    "thumbnail": entry.get("thumbnail") or "",
                    "transcribed": False,
                    "embedded": False,
                    "failed": False,
                }
                print(f"    [{i+1:>3}] {title[:72]}")

            progress.update({
                "playlist_url": playlist_url,
                "playlist_fetched": True,
                "total_videos": len(videos),
                "videos": videos,
            })
            save_progress(progress)
            print(f"\n  [OK] {len(videos)} videos listed -> progress.json saved")
            return progress

        except KeyboardInterrupt:
            raise
        except Exception as e:
            wait = RETRY_DELAY * (2 ** (attempt - 1))
            print(f"  ERROR: Attempt {attempt}/{MAX_RETRIES}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(wait)
            else:
                sys.exit(1)


def _fetch_one_transcript(video_id: str):
    from youtube_transcript_api import YouTubeTranscriptApi

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            api = YouTubeTranscriptApi()
            tlist = api.list(video_id)
            transcript = None

            try:
                transcript = tlist.find_manually_created_transcript(TRANSCRIPT_LANGUAGES)
            except Exception:
                pass

            if transcript is None:
                try:
                    transcript = tlist.find_generated_transcript(TRANSCRIPT_LANGUAGES)
                except Exception:
                    pass

            if transcript is None:
                try:
                    transcript = tlist.find_transcript(TRANSCRIPT_LANGUAGES)
                except Exception:
                    pass

            if transcript is None:
                return None

            raw = transcript.fetch()
            result = []
            for entry in raw:
                text = entry.text if hasattr(entry, "text") else entry.get("text", "")
                start = float(entry.start if hasattr(entry, "start") else entry.get("start", 0))
                dur = float(entry.duration if hasattr(entry, "duration") else entry.get("duration", 0))
                text = text.strip()
                if not text or text in ("[Music]", "[Applause]", "[Laughter]"):
                    continue
                result.append({
                    "start": round(start, 2),
                    "end": round(start + dur, 2),
                    "duration": round(dur, 2),
                    "text": text,
                })
            return result if result else None

        except KeyboardInterrupt:
            raise
        except Exception as e:
            err = str(e).lower()
            if any(x in err for x in ["disabled", "no transcript", "unavailable", "private", "could not retrieve"]):
                return None
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * (2 ** (attempt - 1)))
            else:
                return None
    return None


def _fmt(sec: float) -> str:
    sec = int(sec)
    h, rem = divmod(sec, 3600)
    m, s = divmod(rem, 60)
    return f"{h:02d}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def step2_fetch_transcripts(progress: dict) -> dict:
    print("\n" + "-" * 60)
    print("  STEP 2/3 -- YouTube Transcripts (No Download!)")
    print("-" * 60)

    videos = progress.get("videos", {})
    pending = [(vid, info) for vid, info in videos.items()
               if not info.get("transcribed") and not info.get("failed")]

    if not pending:
        print("\n  [OK] All transcripts fetched!")
        return progress

    os.makedirs(TRANSCRIPT_DIR, exist_ok=True)
    for i, (video_id, info) in enumerate(pending):
        title = info.get("title", video_id)
        segs = _fetch_one_transcript(video_id)
        if segs is None:
            progress["videos"][video_id]["failed"] = True
            save_progress(progress)
            continue

        data = {
            "video_id": video_id,
            "title": title,
            "url": info.get("url", f"https://www.youtube.com/watch?v={video_id}"),
            "duration": info.get("duration", 0),
            "segments": segs,
            "total": len(segs)
        }
        with open(os.path.join(TRANSCRIPT_DIR, f"{video_id}.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)

        progress["videos"][video_id]["transcribed"] = True
        save_progress(progress)
        print(f"  [{i+1}/{len(pending)}] {title[:60]} -> {len(segs)} segments")

    return progress


def _make_chunks(segments: list, video_id: str, title: str) -> list:
    if not segments:
        return []

    chunks = []
    current_segs = []
    chunk_start = segments[0]["start"]

    def flush(segs):
        text = " ".join(s["text"] for s in segs).strip()
        if not text:
            return
        s0, s1 = segs[0]["start"], segs[-1]["end"]
        ts = int(s0)
        raw_id = f"{video_id}__{ts}"
        chunks.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_URL, raw_id)),
            "text": text,
            "video_id": video_id,
            "title": title,
            "start": s0,
            "end": s1,
            "start_fmt": _fmt(s0),
            "end_fmt": _fmt(s1),
            "youtube_url": f"https://www.youtube.com/watch?v={video_id}&t={ts}s",
        })

    for seg in segments:
        current_segs.append(seg)
        if seg["end"] - chunk_start >= CHUNK_SECONDS:
            flush(current_segs)
            overlap_segs, overlap_time = [], 0.0
            for s in reversed(current_segs):
                overlap_time += s["duration"]
                overlap_segs.insert(0, s)
                if overlap_time >= OVERLAP_SECONDS:
                    break
            current_segs = overlap_segs
            chunk_start = current_segs[0]["start"] if current_segs else seg["end"]

    if current_segs:
        flush(current_segs)

    return chunks


def step3_embed_to_qdrant(progress: dict):
    print("\n" + "-" * 60)
    print("  STEP 3/3 -- Embed -> Qdrant Cloud")
    print("-" * 60)

    videos = progress.get("videos", {})
    to_embed = [(vid, info) for vid, info in videos.items()
                if info.get("transcribed") and not info.get("embedded")]

    if not to_embed:
        print("\n  [OK] Knowledge base up-to-date!")
        return

    embed_model = get_embed_model()
    client = get_qdrant_client()
    ensure_collection_exists()

    from qdrant_client.models import PointStruct

    for i, (video_id, info) in enumerate(to_embed):
        title = info.get("title", video_id)
        tpath = os.path.join(TRANSCRIPT_DIR, f"{video_id}.json")
        if not os.path.exists(tpath):
            continue

        try:
            with open(tpath, "r", encoding="utf-8") as f:
                data = json.load(f)

            chunks = _make_chunks(data.get("segments", []), video_id, title)
            if not chunks:
                progress["videos"][video_id]["embedded"] = True
                save_progress(progress)
                continue

            for b in range(0, len(chunks), BATCH_SIZE):
                batch = chunks[b: b + BATCH_SIZE]
                texts = [c["text"] for c in batch]
                embeds = embed_model.encode(texts, show_progress_bar=False).tolist()

                points = [
                    PointStruct(
                        id=c["id"],
                        vector=emb,
                        payload={
                            "video_id": c["video_id"],
                            "title": c["title"],
                            "start": c["start"],
                            "end": c["end"],
                            "start_fmt": c["start_fmt"],
                            "end_fmt": c["end_fmt"],
                            "youtube_url": c["youtube_url"],
                            "text": c["text"],
                        }
                    )
                    for c, emb in zip(batch, embeds)
                ]
                client.upsert(collection_name=COLLECTION_NAME, points=points)

            progress["videos"][video_id]["embedded"] = True
            save_progress(progress)
            print(f"  [{i+1}/{len(to_embed)}] {title[:60]} -> {len(chunks)} chunks uploaded")

        except Exception as e:
            print(f"  [ERROR] {e}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python -m pipeline.build_kb \"PLAYLIST_URL\"")
        sys.exit(1)

    playlist_url = sys.argv[1].strip()
    progress = load_progress()
    progress = step1_fetch_playlist(playlist_url, progress)
    progress = step2_fetch_transcripts(progress)
    step3_embed_to_qdrant(progress)
    print("\nKnowledge base construction complete!")


if __name__ == "__main__":
    main()
