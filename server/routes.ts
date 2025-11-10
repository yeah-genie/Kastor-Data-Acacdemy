import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Google Cloud TTS API endpoint
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, languageCode, voiceName } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      // Check if credentials are configured
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_CLOUD_TTS_CREDENTIALS) {
        console.warn("Google Cloud TTS credentials not configured. Returning mock response.");
        return res.json({
          audioContent: null,
          mock: true,
          message: "TTS not configured. Set GOOGLE_APPLICATION_CREDENTIALS in .env"
        });
      }

      // Initialize TTS client
      const client = new TextToSpeechClient();

      // Configure request
      const request = {
        input: { text },
        voice: {
          languageCode: languageCode || process.env.TTS_LANGUAGE_CODE || "ko-KR",
          name: voiceName || process.env.TTS_VOICE_NAME || "ko-KR-Standard-A",
        },
        audioConfig: {
          audioEncoding: process.env.TTS_AUDIO_ENCODING || "MP3",
        },
      };

      // Perform TTS request
      const [response] = await client.synthesizeSpeech(request as any);

      // Convert audio content to base64
      const audioBase64 = response.audioContent?.toString("base64");

      res.json({
        audioContent: audioBase64,
        mock: false,
      });
    } catch (error: any) {
      console.error("TTS Error:", error);
      res.status(500).json({
        error: "Failed to synthesize speech",
        details: error.message,
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
