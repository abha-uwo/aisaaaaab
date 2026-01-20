import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Mic, MicOff, Camera, Video, VideoOff, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import toast from 'react-hot-toast';
import axios from 'axios';
import { apis } from '../types';

const LiveAI = ({ onClose, language }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [history, setHistory] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState(null);
    const [isVideoActive, setIsVideoActive] = useState(true);
    const [duration, setDuration] = useState(0);

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const shouldListenRef = useRef(false);

    const [facingMode, setFacingMode] = useState('user');
    const [voiceGender, setVoiceGender] = useState('FEMALE'); // Default to Female

    // Initialize Camera
    useEffect(() => {
        let stream = null;
        const startCamera = async () => {
            try {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: facingMode },
                    audio: false
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                // Re-apply video mute state
                stream.getVideoTracks().forEach(t => t.enabled = isVideoActive);
            } catch (err) {
                console.error("Camera Error:", err);
                setError("Could not access camera. Please allow permissions.");
            }
        };

        if (isVideoActive) {
            startCamera();
        } else {
            // If video is toggled off (paused), we might want to stop the stream or just mute tracks.
            // But for switching camera, we need to restart stream. 
            // Logic: If active, start.
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]); // Re-run when facingMode changes


    // Call Timer
    useEffect(() => {
        const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Capture Frame
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth / 2;
        canvas.height = video.videoHeight / 2;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/jpeg', 0.7);
    }, []);

    // Text to Speech
    const speakResponse = async (text) => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }

        // Simple language mapper
        const langMap = {
            'Hindi': 'hi-IN',
            'English': 'en-US',
            'Spanish': 'es-ES',
            'French': 'fr-FR',
            'German': 'de-DE',
            'Japanese': 'ja-JP'
        };
        const targetLang = langMap[language] || 'en-US';

        try {
            setIsSpeaking(true);
            const response = await axios.post(apis.synthesizeVoice, {
                text,
                languageCode: targetLang,
                gender: voiceGender
            }, {
                responseType: 'arraybuffer'
            });

            const blob = new Blob([response.data], { type: 'audio/mpeg' });
            const url = window.URL.createObjectURL(blob);
            const audio = new Audio(url);

            audio.onended = () => {
                setIsSpeaking(false);
                window.URL.revokeObjectURL(url);
                // Resume mic logic
                if (recognitionRef.current) {
                    setTimeout(() => {
                        if (recognitionRef.current) {
                            recognitionRef.current.start();
                            setIsListening(true);
                        }
                    }, 100);
                }
            };

            // Handle audio loading errors
            audio.onerror = (e) => {
                console.error("Audio playback error:", e);
                setIsSpeaking(false);
                // Try fallback
                fallbackSpeak(text, targetLang);
            };

            await audio.play();

        } catch (err) {
            console.error("Google TTS failed, using fallback:", err);
            fallbackSpeak(text, targetLang);
        }
    };

    const fallbackSpeak = (text, lang) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (recognitionRef.current) {
                setTimeout(() => {
                    if (recognitionRef.current) {
                        recognitionRef.current.start();
                        setIsListening(true);
                    }
                }, 100);
            }
        };
        synthRef.current.speak(utterance);
    };

    // Process Query
    const processQuery = async (text) => {
        if (!text.trim()) return;

        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);

        let attachment = null;
        if (isVideoActive) {
            const imageBase64 = captureFrame();
            attachment = imageBase64 ? { type: 'image', url: imageBase64 } : null;
        }

        try {
            setAiResponse("Thinking...");
            // Pass current history
            const response = await generateChatResponse(
                history,
                text,
                `You are AISA, powered by A-Series. You are in a video call. 
                 CRITICAL LANGUAGE INSTRUCTION:
                 - If the user speaks Hindi, respond in pure, natural, and polite Hindi (Devanagari script). 
                 - Avoid heavy English words unless unavoidable (like "AI" or "Agent").
                 - Maintain a warm, professional, and helpful tone.
                 - Your text will be converted to speech, so write in a way that sounds natural when spoken.
                 Current Language Setting: ${language}.
                 
                 If asked, explain A-Series as a platform to discover and create AI agents.`,
                attachment,
                language
            );

            setAiResponse(response);
            speakResponse(response);

            // Update history with User and Model turns
            setHistory(prev => [
                ...prev,
                { role: 'user', content: text, attachment: attachment }, // Include attachment context if needed
                { role: 'model', content: response }
            ]);

        } catch (err) {
            console.error(err);
            setAiResponse("Connection error.");
        }
    };

    // Speech Recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setError("Voice not supported.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = 'hi-IN'; // Force Hindi
        recognition.continuous = false; // Loop mode is better
        recognition.interimResults = true;

        recognition.onstart = () => {
            console.log("Live Mic Started");
            toast.success("Mic ON (Hindi)");
        };

        recognition.onerror = (e) => {
            console.error("Mic Error", e);
            if (e.error === 'not-allowed') toast.error("Mic Blocked");
        };

        recognition.onend = () => {
            // Loop if enabled
            if (shouldListenRef.current && !synthRef.current.speaking) {
                try { recognition.start(); } catch (e) { }
            } else {
                if (!shouldListenRef.current) setIsListening(false);
            }
        };

        recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            const text = lastResult[0].transcript;
            setTranscript(text);

            if (lastResult.isFinal) {
                // Stop to process
                shouldListenRef.current = false;
                setIsListening(false);
                recognition.stop();
                processQuery(text);
            }
        };

        return () => recognition.abort();
    }, [captureFrame]);

    const toggleListening = () => {
        if (shouldListenRef.current) {
            shouldListenRef.current = false;
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            if (synthRef.current.speaking) synthRef.current.cancel();

            setTranscript("");
            shouldListenRef.current = true;
            try { recognitionRef.current.start(); } catch (e) { }
            setIsListening(true);
        }
    };

    // Sync Video State
    useEffect(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getVideoTracks().forEach(t => t.enabled = isVideoActive);
        }
    }, [isVideoActive]);

    const toggleVideo = () => setIsVideoActive(prev => !prev);

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col text-white font-sans">
            {/* Fullscreen Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`flex-1 w-full h-full object-cover transition-all duration-500 ${isVideoActive ? 'opacity-100' : 'opacity-0'} ${facingMode === 'user' ? '-scale-x-100' : ''}`}
            />

            {/* Placeholder when video is off */}
            {!isVideoActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 animate-pulse flex items-center justify-center">
                        <Mic className="w-8 h-8 text-primary/50" />
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* AI Response / Subtitles - Positioned above controls, centered, subtle */}
            <div className="absolute bottom-32 left-0 right-0 px-6 flex flex-col items-center pointer-events-none">
                <div className="w-full max-w-xl text-center space-y-4">
                    {/* User Transcript */}
                    {transcript && (
                        <p className="text-xl md:text-2xl font-medium text-white/90 drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                            "{transcript}"
                        </p>
                    )}

                    {/* AI Response */}
                    {aiResponse && !isListening && (
                        <p className="text-lg md:text-xl text-blue-200/90 font-medium drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {aiResponse}
                        </p>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm bg-black/50 px-3 py-1 rounded-full">{error}</p>
                    )}
                </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex items-center gap-6 bg-zinc-900/50 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl">

                    {/* Switch Camera */}
                    <button
                        onClick={switchCamera}
                        className="p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
                        title="Switch Camera"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    {/* Voice Gender Toggle */}
                    <button
                        onClick={() => {
                            const newGender = voiceGender === 'FEMALE' ? 'MALE' : 'FEMALE';
                            setVoiceGender(newGender);
                            toast.success(`Voice set to ${newGender}`);
                        }}
                        className="p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all font-bold text-xl"
                        title="Toggle Voice Gender"
                    >
                        {voiceGender === 'FEMALE' ? '👩' : '👨'}
                    </button>

                    {/* Video Toggle */}
                    <button
                        onClick={toggleVideo}
                        className={`p-3 rounded-full transition-all ${isVideoActive ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-red-400 bg-red-500/10'}`}
                        title={isVideoActive ? "Turn Off Video" : "Turn On Video"}
                    >
                        {isVideoActive ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                    </button>

                    {/* Mic / Listening State - The Centerpiece */}
                    <button
                        onClick={toggleListening}
                        className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${isListening
                            ? 'bg-white text-black scale-110 shadow-blue-500/50'
                            : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
                            }`}
                        title={isListening ? "Stop Listening" : "Start Listening"}
                    >
                        {isListening ? (
                            <div className="space-x-1 flex items-center h-4">
                                <div className="w-1 h-3 bg-black animate-[bounce_1s_infinite_0ms]" />
                                <div className="w-1 h-4 bg-black animate-[bounce_1s_infinite_200ms]" />
                                <div className="w-1 h-3 bg-black animate-[bounce_1s_infinite_400ms]" />
                            </div>
                        ) : (
                            <Mic className="w-7 h-7" />
                        )}
                    </button>

                    {/* End Call */}
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full bg-zinc-800 text-red-500 hover:bg-zinc-700 transition-all ml-2"
                        title="End Call"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveAI;
