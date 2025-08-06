import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { URL } from 'url';

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url);
    const videoUrl = requestUrl.searchParams.get('video_url');

    if (!videoUrl) {
      return NextResponse.json(
        { detail: "The 'video_url' query parameter is required." },
        { status: 400 }
      );
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

    if (!transcript || transcript.length === 0) {
      return NextResponse.json({ detail: 'No transcript found for this video.' }, { status: 404 });
    }

    // Return the successful transcript
    return NextResponse.json({ transcript: transcript }, { status: 200 });

  } catch (error) {
    console.error(error); // This will show in Railway's logs
    let detail = `An internal server error occurred: ${error.message}`;
    let status = 500;

    // Check for common, user-friendly errors from the new library
    if (error.message.includes('subtitles are disabled')) {
      detail = 'Transcripts are disabled for this video.';
      status = 403;
    } else if (error.message.includes('No transcripts found')) {
      detail = 'No transcript found for this video.';
      status = 404;
    }

    return NextResponse.json({ detail: detail }, { status: status });
  }
}
