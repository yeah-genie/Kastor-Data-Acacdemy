# Google Cloud Text-to-Speech Integration Guide

## Overview

The Kastor Data Academy now supports voicemail messages with Text-to-Speech (TTS) audio generation using Google Cloud TTS API.

## Features

- 🎙️ **Automatic Audio Generation**: Text is converted to speech using Google Cloud TTS
- 🎧 **Interactive Player**: Full-featured voicemail player with play/pause/seek controls
- 📝 **Synchronized Transcripts**: Text transcript displayed alongside audio
- 🌐 **Multi-language Support**: Configurable language and voice options (default: Korean)
- ⚡ **Graceful Degradation**: Falls back to text-only mode if TTS is not configured

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Cloud Text-to-Speech API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Cloud Text-to-Speech API"
   - Click "Enable"

4. Create a service account:
   - Navigate to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name it (e.g., "kastor-tts-service")
   - Grant role: "Cloud Text-to-Speech API User"
   - Click "Done"

5. Generate credentials:
   - Click on the service account you created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Download the key file (keep it secure!)

### 2. Local Environment Configuration

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and configure:

   **Option A: Using Service Account Key File (Recommended for Development)**
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   TTS_LANGUAGE_CODE=ko-KR
   TTS_VOICE_NAME=ko-KR-Standard-A
   TTS_AUDIO_ENCODING=MP3
   ```

   **Option B: Using Inline JSON (Production/Deployment)**
   ```env
   GOOGLE_CLOUD_TTS_CREDENTIALS={"type":"service_account","project_id":"..."}
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   TTS_LANGUAGE_CODE=ko-KR
   TTS_VOICE_NAME=ko-KR-Standard-A
   TTS_AUDIO_ENCODING=MP3
   ```

3. Restart the server:
   ```bash
   npm run dev
   ```

### 3. Available Voice Options

#### Korean Voices
- `ko-KR-Standard-A` - Female voice (Default)
- `ko-KR-Standard-B` - Female voice
- `ko-KR-Standard-C` - Male voice
- `ko-KR-Standard-D` - Male voice
- `ko-KR-Wavenet-A` - Premium female voice
- `ko-KR-Wavenet-B` - Premium female voice
- `ko-KR-Wavenet-C` - Premium male voice
- `ko-KR-Wavenet-D` - Premium male voice

#### English Voices
- `en-US-Standard-A` through `en-US-Standard-J`
- `en-US-Wavenet-A` through `en-US-Wavenet-J`

[Full voice list](https://cloud.google.com/text-to-speech/docs/voices)

## Usage in Story Data

Add voicemail messages to your story nodes:

```typescript
import { Message } from "@/data/episode-types";

const voicemailMessage: Message = {
  id: "vm1",
  speaker: "system",
  text: "", // Can be empty or used for fallback
  voicemail: {
    from: "Maya Chen <maya.chen@zenithgames.com>",
    timestamp: "2025-03-15 14:32",
    text: "안녕하세요, 탐정님. 중요한 단서를 찾았어요. 로그 파일에서 이상한 패턴이 발견됐습니다.",
    autoPlay: false, // Set to true for auto-play
  },
};
```

## Component Architecture

### Files Created/Modified

1. **Backend**
   - `server/routes.ts` - TTS API endpoint (`/api/tts`)
   - `.env` - Environment configuration

2. **Frontend**
   - `client/src/lib/tts.ts` - TTS service functions
   - `client/src/components/VoicemailPlayer.tsx` - Voicemail UI component
   - `client/src/components/ChatMessage.tsx` - Integrated voicemail rendering
   - `client/src/data/episode-types.ts` - Extended Message interface definitions

### API Endpoint

**POST** `/api/tts`

Request:
```json
{
  "text": "안녕하세요",
  "languageCode": "ko-KR",
  "voiceName": "ko-KR-Standard-A"
}
```

Response (Success):
```json
{
  "audioContent": "base64-encoded-mp3-data",
  "mock": false
}
```

Response (Not Configured):
```json
{
  "audioContent": null,
  "mock": true,
  "message": "TTS not configured. Set GOOGLE_APPLICATION_CREDENTIALS in .env"
}
```

## Testing

### Without Google Cloud Credentials

The system gracefully falls back to text-only mode:
- Voicemail player shows transcript
- Warning displayed: "TTS not configured. Using text-only mode."
- No audio controls shown
- Story progression unaffected

### With Google Cloud Credentials

1. Add a voicemail message to Episode 2 or create a test case
2. Navigate to the voicemail in-game
3. Verify:
   - Audio generates automatically
   - Play/pause controls work
   - Progress bar updates during playback
   - Transcript is visible
   - Volume/mute controls function

## Troubleshooting

### "TTS not configured" Warning

**Problem**: VoicemailPlayer shows warning about missing configuration

**Solution**:
1. Verify `.env` file exists and contains `GOOGLE_APPLICATION_CREDENTIALS`
2. Check that the path to service account key is correct and absolute
3. Ensure the JSON key file has proper permissions (readable)
4. Restart the development server

### API Error: "Failed to synthesize speech"

**Problem**: TTS API returns 500 error

**Solutions**:
1. **Invalid Credentials**: Regenerate service account key
2. **API Not Enabled**: Enable Cloud Text-to-Speech API in console
3. **Quota Exceeded**: Check quota limits in Cloud Console
4. **Invalid Voice Name**: Use supported voice names from documentation

### Audio Doesn't Play

**Problem**: Audio element fails to play

**Solutions**:
1. Check browser console for errors
2. Verify base64 audio data is present in network response
3. Try different browser (some browsers block auto-play)
4. Check that `autoPlay` is explicitly set to `true` if auto-play is desired

## Cost Considerations

Google Cloud TTS pricing (as of 2025):
- **Standard Voices**: $4.00 per 1 million characters
- **WaveNet Voices**: $16.00 per 1 million characters
- **Free Tier**: 1 million characters per month (Standard voices)

For a typical voicemail message (200 characters):
- Cost per message: ~$0.0008 (less than 0.1 cents)
- Free tier covers ~5,000 messages per month

## Future Enhancements

Potential improvements:
- 🔄 Audio caching to avoid re-generating same text
- 🎚️ Playback speed control (0.5x, 1x, 1.5x, 2x)
- 📥 Download audio option
- 🎭 Multiple voice options per character
- 🔊 Background noise/ambiance effects
- ⏱️ Real-time subtitle highlighting during playback

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never commit** `.env` or service account keys to version control
2. `.gitignore` should include:
   ```
   .env
   .env.local
   *.json  # Service account keys
   ```
3. Use environment variables for production deployments
4. Rotate service account keys periodically
5. Use least-privilege IAM roles (only TTS API access)

## Support

For issues or questions:
- Check [Google Cloud TTS Documentation](https://cloud.google.com/text-to-speech/docs)
- Review error logs in browser console and server terminal
- Verify API quota and billing status in Google Cloud Console
