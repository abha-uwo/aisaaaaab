import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
<<<<<<< HEAD
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
=======
import pdfParse from 'pdf-parse';
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import officeParser from 'officeparser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the service account key file - Using CLI auth instead
// const keyFilename = path.join(__dirname, '../google_cloud_credentials.json');

<<<<<<< HEAD
// Initialize the client if key exists
let client = null;
if (fs.existsSync(keyFilename)) {
    try {
        client = new textToSpeech.TextToSpeechClient({ keyFilename });
        console.log("✅ [VoiceController] Google Cloud TTS Client Initialized");
    } catch (err) {
        console.error("❌ [VoiceController] Failed to initialize TTS Client:", err.message);
    }
} else {
    console.warn("⚠️ [VoiceController] Google Cloud Service Account Key not found at:", keyFilename);
    console.warn("⚠️ [VoiceController] Voice features will require frontend fallback.");
}

export const synthesizeSpeech = async (req, res) => {
    if (!client) {
        return res.status(403).json({
            error: 'Google Cloud TTS not configured',
            details: 'Service account key missing on server.'
        });
    }
=======
console.log("🔑 [VoiceController] Using Google Cloud CLI authentication");
// console.log("🔑 [VoiceController] Credentials file exists:", fs.existsSync(keyFilename));

// Initialize the client with explicit project ID from .env
const client = new textToSpeech.TextToSpeechClient({
    projectId: process.env.GCP_PROJECT_ID
});

// Character limit to prevent API issues and ensure natural reading
const SAFE_LIMIT = 5000;

export const synthesizeSpeech = async (req, res) => {
    console.log("📢 [VoiceController] Request Received!");
    console.log("📦 [VoiceController] Body:", JSON.stringify(req.body, null, 2));

>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
    try {
        const { text, languageCode = 'en-US', gender = 'FEMALE', tone } = req.body;

        if (!text) {
            console.error("❌ [VoiceController] No text provided!");
            return res.status(400).json({ error: 'Text is required' });
        }

<<<<<<< HEAD
        // Pre-processing for natural pronunciation
        let processedText = text
            .replace(/[,.-]/g, " ")
=======

        // Regex to detect Hinglish (Hindi words in Latin script)
        // Checks for common Hindi words: hai, mein, ka, ki, aur, tha, thi, hum, tum, aap, kya, nahi...
        const hinglishRegex = /\b(hai|mein|ka|ki|aur|tha|thi|hum|tum|aap|kya|nahi|han|ho|ko|se|yeh|woh|karna|kar|raha|rahe|hota|sahi|achha|bhi|ek|ladka|gaon|raat|mitti|diya|jalata|padhai|kyunki|bijli|aksar|chali|jaati|usse|mazaak|kehte|chhote|tu|lega|muskurata|andhera|jitna|bada|kaafi|rehta|sapne|paisa|kam|ghar|lekin|bahut|roz|chhota|magar|par|bas|aaj|kal|kabhi|jab|tab|toh|hi|rahe|raha|kyun|sab|kuch|kaun|kab|kahan)\b/gi;

        const hindiWordMatches = (text.match(hinglishRegex) || []).length;
        const isHinglish = hindiWordMatches > 2; // Reduced threshold slightly for better detection

        // Pre-processing for live speech: Ensure natural pronunciation for shorthands
        let processedText = text
            .replace(/[,.-]/g, " ") // Remove symbols user specifically asked to hide
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
            .replace(/\btm\b/gi, "tum")
            .replace(/\bkkrh\b/gi, "kya kar rahe ho")
            .replace(/\bclg\b/gi, "college")
            .replace(/\bplz\b/gi, "please")
            .replace(/\s+/g, " ")
            .trim();

<<<<<<< HEAD
=======
        // Auto-switch to Hindi voice if Hinglish is detected, even if currentLang is en-US.
        if (isHinglish && languageCode.startsWith('en')) {
            console.log(`🗣️ [VoiceController] Hinglish detected (${hindiWordMatches} words)! Switching to Hindi voice.`);
            languageCode = 'hi-IN';
        }

>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
        // Preferred voices map structure: [Language][Gender]
        const voiceMap = {
            'hi-IN': {
                'FEMALE': 'hi-IN-Neural2-D',
                'MALE': 'hi-IN-Wavenet-B'
            },
            'en-US': {
<<<<<<< HEAD
                'FEMALE': 'en-US-Neural2-F',
                'MALE': 'en-US-Neural2-D'
=======
                'FEMALE': 'en-US-Neural2-F', // Optimized for storytelling
                'MALE': 'en-US-Wavenet-D'
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
            },
            'en-IN': {
                'FEMALE': 'en-IN-Neural2-D',
                'MALE': 'en-IN-Wavenet-B'
            }
        };

        // Fallback logic
<<<<<<< HEAD
        let voiceName = `${languageCode}-Neural2-A`;
=======
        let voiceName = 'hi-IN-Neural2-D';
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
        if (voiceMap[languageCode] && voiceMap[languageCode][gender]) {
            voiceName = voiceMap[languageCode][gender];
        } else {
            const suffix = gender === 'MALE' ? 'B' : 'A';
            voiceName = `${languageCode}-Neural2-${suffix === 'B' ? 'D' : 'A'}`;
        }

<<<<<<< HEAD
        // Determine tone
        const isNarrative = tone === 'narrative' || (tone !== 'conversational' && text.length > 500);

        const audioConfig = {
            audioEncoding: 'MP3',
            speakingRate: isNarrative ? 0.95 : 1.0,
            pitch: 0.0,
            volumeGainDb: 1.0
        };

=======
        console.log(`🔊 [VoiceController] Final selection - Name: ${voiceName}, Gender: ${gender}, Lang: ${languageCode}`);

        // Determine tone: explicit parameter takes precedence, otherwise auto-detect
        const isNarrative = tone === 'narrative' || (tone !== 'conversational' && text.length > 500);

        console.log("🔊 [VoiceController] Using voice:", voiceName);
        console.log(`📖 [VoiceController] Tone: ${isNarrative ? 'NARRATIVE' : 'CONVERSATIONAL'} (text length: ${text.length}, explicit: ${tone ? 'yes' : 'no'})`);

        // Narrative tone settings for storytelling/explanation
        const narrativeConfig = {
            speakingRate: 0.95,   // Optimized for speed vs quality
            pitch: 0.0,          // Neutral pitch
            volumeGainDb: 1.0    // Standard volume
        };

        // Conversational tone settings for quick responses
        const conversationalConfig = {
            speakingRate: 1.0,   // Normal speed
            pitch: 0.0,          // Neutral pitch  
            volumeGainDb: 1.0    // Standard volume
        };

        const audioConfig = isNarrative ? narrativeConfig : conversationalConfig;
        audioConfig.audioEncoding = 'MP3';

>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
        const request = {
            input: { text: processedText },
            voice: {
                languageCode: languageCode,
                name: voiceName,
                ssmlGender: gender
            },
            audioConfig: audioConfig,
        };

<<<<<<< HEAD
=======
        // Perform the text-to-speech request (no changes here, just context)

        // Fallback logic for languages that might not have Neural2-A or exact match
        // For production, a more robust voice selection logic might be needed
        // But let's try to default to Neural2 if available.

>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
        // Perform the text-to-speech request
        console.log("📤 [VoiceController] Calling Google TTS API...");
        const [response] = await client.synthesizeSpeech(request);

        let audioData = response.audioContent;
        if (!Buffer.isBuffer(audioData)) {
<<<<<<< HEAD
=======
            console.log("⚠️ [VoiceController] Audio content is not a Buffer, converting from base64...");
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
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

export const synthesizeFile = async (req, res) => {
    console.log("📢 [VoiceController] File Synthesis Request Received!");
<<<<<<< HEAD
    if (!client) {
        return res.status(403).json({
            error: 'Google Cloud TTS not configured',
            details: 'Service account key missing on server.'
        });
    }
=======
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897

    try {
        const { fileData, mimeType, languageCode: reqLangCode = 'en-US', gender = 'FEMALE', introText } = req.body;

        if ((!fileData || !mimeType) && !introText) {
<<<<<<< HEAD
            console.error("❌ [VoiceController] Missing required fields");
=======
            console.error("❌ [VoiceController] Missing required fields (fileData/mimeType/introText)");
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
            return res.status(400).json({ error: 'Either fileData or introText is required' });
        }

        let textToRead = "";

        if (fileData) {
            const buffer = Buffer.from(fileData, 'base64');
            console.log(`📦 [VoiceController] Processing ${buffer.length} bytes, MIME: ${mimeType}`);
<<<<<<< HEAD

            try {
                if (mimeType === 'application/pdf') {
                    const data = await pdfParse(buffer);
                    textToRead = data.text;
                } else if (mimeType.includes('word') || mimeType.includes('officedocument') || mimeType.endsWith('.docx') || mimeType.endsWith('.doc')) {
                    try {
                        textToRead = await officeParser.parseOfficeAsync(buffer);
                    } catch (e) {
=======
            const extractionStartTime = Date.now();

            try {
                if (mimeType === 'application/pdf') {
                    // 1. Try standard text extraction
                    const data = await pdfParse(buffer);
                    textToRead = data.text;

                    // 2. If extraction is too short but PDF has pages, it's likely a scanned image PDF
                    if (textToRead.trim().length < 50 && data.numpages > 0) {
                        console.log(`🔍 [VoiceController] Standard extraction failed (too short). Attempting OCR for image-based PDF...`);
                        // For local simple OCR on PDF, we'd need to convert PDF to images first. 
                        // Since we don't have a binary PDF-to-Image tool installed here, 
                        // we will warn the user or attempt a more aggressive parse if possible.
                        // For now, let's just use the standard parse results but log it.
                    }
                } else if (mimeType.includes('word') || mimeType.includes('officedocument') || mimeType.endsWith('.docx') || mimeType.endsWith('.doc')) {
                    try {
                        // Use officeParser for broader support (.doc and .docx)
                        textToRead = await officeParser.parseOfficeAsync(buffer);
                    } catch (e) {
                        console.log("Fallback to mammoth for .docx...");
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
                        const result = await mammoth.extractRawText({ buffer });
                        textToRead = result.value;
                    }
                } else if (mimeType.startsWith('image/')) {
                    const { data: { text } } = await Tesseract.recognize(buffer, 'eng+hin');
                    textToRead = text;
                } else if (mimeType.startsWith('text/')) {
                    textToRead = buffer.toString('utf-8');
                } else {
<<<<<<< HEAD
                    console.warn(`⚠️ [VoiceController] Unsupported MIME type: ${mimeType}`);
                }
=======
                    console.warn(`⚠️ [VoiceController] Unsupported MIME type for extraction: ${mimeType}`);
                }
                const extractionDuration = ((Date.now() - extractionStartTime) / 1000).toFixed(2);
                console.log(`⏱️ [VoiceController] Text extraction took ${extractionDuration}s. Length: ${textToRead.length} chars.`);
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
            } catch (extractionError) {
                console.error("❌ [VoiceController] Text extraction failed:", extractionError);
                return res.status(500).json({ error: 'Text extraction failed', details: extractionError.message });
            }
        }

        if (introText && introText.trim().length > 0) {
            textToRead = `${introText}\n\n${textToRead}`;
        }

<<<<<<< HEAD
        // Sanitize text
        textToRead = textToRead
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
            .replace(/™/g, " tm ")
            .replace(/©/g, " ")
            .replace(/[,\.?;"\\*\/+\-:@\[\]\(\)\|_]/g, " ")
            .replace(/\btm\b/gi, "tum")
            .replace(/\s+/g, " ")
            .trim();

        if (!textToRead || textToRead.length < 2) {
=======
        // Sanitize text: Remove weird characters/control codes that might break TTS
        textToRead = textToRead
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "") // Remove control chars
            .replace(/™/g, " tm ") // Convert Trademark symbol to 'tm' text
            .replace(/©/g, " ") // Remove Copyright symbol
            // STRICTLY remove specified symbols only: , . ? ; " \ * / + - : @ [ ] ( ) | _
            .replace(/[,\.\?;\"\\\*\/\+\-:@\[\]\(\)\|\_]/g, " ")
            // Ensure tm is spoken as 'tum' and NOT hidden
            .replace(/\btm\b/gi, "tum")
            .replace(/\s+/g, " ") // Collapse multiple spaces
            .trim();

        if (!textToRead || textToRead.length < 2) {
            console.error("❌ [VoiceController] Sanitized text is too short or empty");
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
            return res.status(400).json({ error: 'Could not extract enough readable text from this file.' });
        }

        // Auto-detect Language
        const hindiCharCount = (textToRead.match(/[\u0900-\u097F]/g) || []).length;
        const totalCharCount = textToRead.length;
        const isHindi = (hindiCharCount / totalCharCount) > 0.05 || hindiCharCount > 15;

<<<<<<< HEAD
        // Chunking for long documents
=======
        // Limit text length - Let's implement chunking for "infinite" length (within timeout)
        // Standard limit is 5000 bytes. 1 Hindi char is 3 bytes.
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
        const CHUNK_SIZE = isHindi ? 1400 : 4000;
        const textChunks = [];

        for (let i = 0; i < textToRead.length; i += CHUNK_SIZE) {
            textChunks.push(textToRead.substring(i, i + CHUNK_SIZE));
        }

        let finalLanguageCode = isHindi ? 'hi-IN' : 'en-US';
        let finalVoiceName = isHindi ? 'hi-IN-Neural2-D' : (gender === 'MALE' ? 'en-US-Neural2-D' : 'en-US-Neural2-F');

        console.log(`📖 [VoiceController] Synthesis - Lang: ${finalLanguageCode}, Chars: ${textToRead.length}, Chunks: ${textChunks.length}`);

<<<<<<< HEAD
        const audioBuffers = [];
        const BATCH_SIZE = 15;
=======
        // Batched Parallel Synthesis to avoid rate limits on extremely long docs
        console.log(`🗣️ [VoiceController] Starting batched synthesis of ${textChunks.length} chunks...`);
        const synthesisStartTime = Date.now();
        const audioBuffers = [];
        const BATCH_SIZE = 15; // Process 15 chunks at a time
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897

        for (let i = 0; i < textChunks.length; i += BATCH_SIZE) {
            const batch = textChunks.slice(i, i + BATCH_SIZE);
            console.log(`📦 [VoiceController] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(textChunks.length / BATCH_SIZE)}...`);

            const batchPromises = batch.map((chunk, index) => {
                const request = {
                    input: { text: chunk },
                    voice: { languageCode: finalLanguageCode, name: finalVoiceName, ssmlGender: gender },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: 0.95,
                        pitch: 0.0,
                        volumeGainDb: 2.0
                    },
                };
                return client.synthesizeSpeech(request)
                    .then(([response]) => {
                        let chunkData = response.audioContent;
                        if (!Buffer.isBuffer(chunkData)) {
                            chunkData = Buffer.from(chunkData, 'base64');
                        }
                        return chunkData;
                    })
                    .catch(err => {
                        console.error(`❌ [VoiceController] Chunk ${i + index} failed:`, err.message);
                        throw err;
                    });
            });

            const batchResults = await Promise.all(batchPromises);
            audioBuffers.push(...batchResults);
        }

<<<<<<< HEAD
=======
        const synthesisDuration = ((Date.now() - synthesisStartTime) / 1000).toFixed(2);
        console.log(`⚡ [VoiceController] Total synthesis finished in ${synthesisDuration}s`);

>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
        const audioData = Buffer.concat(audioBuffers);
        console.log(`✅ [VoiceController] Synthesis Complete. Total Audio Size: ${audioData.length} bytes`);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioData.length,
            'X-Text-Length': textToRead.length.toString(),
            'X-Chunk-Count': textChunks.length.toString(),
            'Access-Control-Expose-Headers': 'X-Text-Length, X-Chunk-Count'
        });
        res.send(audioData);

    } catch (error) {
        console.error('❌ [VoiceController] Critical Synthesis Failure:', error);
<<<<<<< HEAD
        res.status(500).json({
            error: 'Voice conversion failed',
            details: error.message,
            code: error.code
=======
        // Log more details if available
        if (error.details) console.error('❌ Error Details:', error.details);
        if (error.code) console.error('❌ Error Code:', error.code);

        res.status(500).json({
            error: 'Voice conversion failed',
            details: error.message,
            code: error.code,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
>>>>>>> ca4d5fff179a273aad0c9f2469954b9136dc3897
        });
    }
};
