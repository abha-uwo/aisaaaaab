import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const VideoPlayer = ({ src, poster, scenes = [] }) => {
    const [currentScene, setCurrentScene] = useState(0);

    useEffect(() => {
        if (scenes.length > 0) {
            const timer = setInterval(() => {
                setCurrentScene((prev) => (prev + 1) % scenes.length);
            }, 5000); // 5 seconds per scene
            return () => clearInterval(timer);
        }
    }, [scenes]);

    if (scenes.length > 0) {
        return (
            <div className="aspect-video bg-black relative rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentScene}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={scenes[currentScene].image}
                            alt={`Scene ${currentScene + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {/* Caption Overlay */}
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                key={`caption-${currentScene}`}
                                className="text-white text-center text-lg md:text-xl font-medium leading-relaxed drop-shadow-lg"
                            >
                                {scenes[currentScene].caption}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Dots */}
                <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                    {scenes.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentScene ? 'w-6 bg-primary' : 'w-1.5 bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                {/* Demo Badge */}
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    AIBIZ™ Product Demo
                </div>
            </div>
        );
    }

    return (
        <div className="aspect-video bg-black relative rounded-xl overflow-hidden shadow-inner border border-white/10">
            <video
                src={src || "https://www.w3schools.com/html/mov_bbb.mp4"}
                poster={poster}
                controls
                autoPlay
                className="w-full h-full object-contain"
                playsInline
            />
        </div>
    );
};

export default VideoPlayer;
