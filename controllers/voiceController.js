import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the service account key file - Using CLI auth instead
// const keyFilename = path.join(__dirname, '../google_cloud_credentials.json');

console.log("🔑 [VoiceController] Using Google Cloud CLI authentication");
// console.log("🔑 [VoiceController] Credentials file exists:", fs.existsSync(keyFilename));

// Initialize the client with CLI auth
const client = new textToSpeech.TextToSpeechClient();

export const synthesizeSpeech = async (req, res) => {
    console.log("📢 [VoiceController] Request Received!");
    console.log("📦 [VoiceController] Body:", JSON.stringify(req.body, null, 2));

    try {
        const { text, languageCode = 'en-US', gender = 'FEMALE', tone } = req.body;

        if (!text) {
            console.error("❌ [VoiceController] No text provided!");
            return res.status(400).json({ error: 'Text is required' });
        }


        // Preferred voices map structure: [Language][Gender]
        const voiceMap = {
            'hi-IN': {
                'FEMALE': 'hi-IN-Neural2-D',
                'MALE': 'hi-IN-Wavenet-B'
            },
            'en-US': {
                'FEMALE': 'en-US-Neural2-F',
                'MALE': 'en-US-Wavenet-D'
            },
            'en-IN': {
                'FEMALE': 'en-IN-Neural2-D',
                'MALE': 'en-IN-Wavenet-B'
            }
        };

        // Fallback logic
        let voiceName = 'hi-IN-Neural2-D';
        if (voiceMap[languageCode] && voiceMap[languageCode][gender]) {
            voiceName = voiceMap[languageCode][gender];
        } else {
            const suffix = gender === 'MALE' ? 'B' : 'A';
            voiceName = `${languageCode}-Neural2-${suffix === 'B' ? 'D' : 'A'}`;
        }

        console.log(`🔊 [VoiceController] Final selection - Name: ${voiceName}, Gender: ${gender}, Lang: ${languageCode}`);

        // Determine tone: explicit parameter takes precedence, otherwise auto-detect
        const isNarrative = tone === 'narrative' || (tone !== 'conversational' && text.length > 100);

        console.log("🔊 [VoiceController] Using voice:", voiceName);
        console.log(`📖 [VoiceController] Tone: ${isNarrative ? 'NARRATIVE' : 'CONVERSATIONAL'} (text length: ${text.length}, explicit: ${tone ? 'yes' : 'no'})`);

        // Narrative tone settings for storytelling/explanation
        const narrativeConfig = {
            speakingRate: 0.9,   // Comfortable reading pace
            pitch: 0.0,          // Neutral pitch
            volumeGainDb: 0.0    // Standard volume
        };

        // Conversational tone settings for quick responses
        const conversationalConfig = {
            speakingRate: 1.0,   // Normal speed
            pitch: 0.0,          // Neutral pitch  
            volumeGainDb: 0.0    // Standard volume
        };

        const audioConfig = isNarrative ? narrativeConfig : conversationalConfig;
        audioConfig.audioEncoding = 'MP3';

        const request = {
            input: { text: text },
            voice: {
                languageCode: languageCode,
                name: voiceName,
                ssmlGender: gender
            },
            audioConfig: audioConfig,
        };

        // Fallback logic for languages that might not have Neural2-A or exact match
        // For production, a more robust voice selection logic might be needed
        // But let's try to default to Neural2 if available.

        // Perform the text-to-speech request
        console.log("📤 [VoiceController] Calling Google TTS API...");
        const [response] = await client.synthesizeSpeech(request);

        let audioData = response.audioContent;
        if (!Buffer.isBuffer(audioData)) {
            console.log("⚠️ [VoiceController] Audio content is not a Buffer, converting from base64...");
            audioData = Buffer.from(audioData, 'base64');
        }

        console.log("✅ [VoiceController] TTS successful, audio size:", audioData.length);

        // Return the audio content
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioData.length,
        });

        res.send(audioData);

    } catch (error) {
        console.error('❌ [VoiceController] ERROR:', error);
        console.error('❌ [VoiceController] Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            stack: error.stack
        });
        res.status(500).json({ error: 'Failed to synthesize speech', details: error.message });
    }
};
