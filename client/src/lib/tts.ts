/**
 * Google Cloud Text-to-Speech Service
 * Handles conversion of text to speech audio
 */

interface TTSRequest {
  text: string;
  languageCode?: string;
  voiceName?: string;
}

interface TTSResponse {
  audioContent: string | null;
  mock: boolean;
  message?: string;
}

/**
 * Synthesizes speech from text using Google Cloud TTS API
 * @param text - The text to convert to speech
 * @param languageCode - Language code (default: ko-KR)
 * @param voiceName - Voice name (default: ko-KR-Standard-A)
 * @returns Audio data URL or null if mock mode
 */
export async function synthesizeSpeech(
  text: string,
  languageCode: string = "ko-KR",
  voiceName: string = "ko-KR-Standard-A"
): Promise<string | null> {
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        languageCode,
        voiceName,
      } as TTSRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("TTS API Error:", error);
      return null;
    }

    const data: TTSResponse = await response.json();

    if (data.mock) {
      console.warn("TTS Mock Mode:", data.message);
      return null;
    }

    if (!data.audioContent) {
      console.error("No audio content received");
      return null;
    }

    // Convert base64 to data URL for audio playback
    const audioDataUrl = `data:audio/mp3;base64,${data.audioContent}`;
    return audioDataUrl;
  } catch (error) {
    console.error("Failed to synthesize speech:", error);
    return null;
  }
}

/**
 * Pre-generates TTS audio for multiple texts
 * Useful for pre-loading voicemail messages
 */
export async function batchSynthesizeSpeech(
  texts: string[],
  languageCode?: string,
  voiceName?: string
): Promise<Map<string, string | null>> {
  const audioMap = new Map<string, string | null>();

  const promises = texts.map(async (text) => {
    const audio = await synthesizeSpeech(text, languageCode, voiceName);
    audioMap.set(text, audio);
  });

  await Promise.all(promises);

  return audioMap;
}
