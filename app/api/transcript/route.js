import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { URL } from 'url';

export async function GET(request) {
  // 1. Log that the function has started
  console.log('--- Transcript API endpoint hit ---');
  
  try {
    const requestUrl = new URL(request.url);
    const videoUrl = requestUrl.searchParams.get('video_url');

    // 2. Log the URL we received
    console.log(`Received request for video_url: ${videoUrl}`);

    if (!videoUrl) {
      console.log('Validation failed: video_url is missing.');
      return NextResponse.json(
        { detail: "The 'video_url' query parameter is required." },
        { status: 400 }
      );
    }

    // 3. Log right before we make the external call
    console.log('Attempting to call YoutubeTranscript.fetchTranscript...');
    
    // This is the line that might be failing
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

    // 4. Log if the external call was successful
    console.log('Successfully fetched transcript from youtube-transcript library.');

    if (!transcript || transcript.length === 0) {
      console.log('fetchTranscript succeeded but returned no data.');
      return NextResponse.json({ detail: 'No transcript found for this video.' }, { status: 404 });
    }

    // 5. Log before sending the final response
    console.log('Data is valid, sending success response.');
    return NextResponse.json({ transcript: transcript }, { status: 200 });

  } catch (error) {
    // 6. Log if any part of the process throws an error
    console.error('--- ERROR CAUGHT IN TRANSCRIPT ENDPOINT ---');
    console.error(error);
    
    let detail = `An internal server error occurred: ${error.message}`;
    let status = 500;

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
