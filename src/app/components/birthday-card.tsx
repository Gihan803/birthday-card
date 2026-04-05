"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { PartyPopper, Settings, X, Palette, Type, Music } from "lucide-react";

const themes = {
  party: {
    id: "party",
    name: "Neon Party",
    primary: "#ff6b6b",
    secondary: "#4ecdc4",
    accent: "#ffe66d",
    bgStart: "#1a0b2e",
    bgEnd: "#000000",
  },
  ocean: {
    id: "ocean",
    name: "Deep Blue",
    primary: "#00b4db",
    secondary: "#0083b0",
    accent: "#00ffd5",
    bgStart: "#0f2027",
    bgEnd: "#203a43",
  },
  sunset: {
    id: "sunset",
    name: "Sunset Magic",
    primary: "#ff5e62",
    secondary: "#ff9966",
    accent: "#ffd700",
    bgStart: "#2a0845",
    bgEnd: "#6441A5",
  },
  forest: {
    id: "forest",
    name: "Enchanted Forest",
    primary: "#11998e",
    secondary: "#38ef7d",
    accent: "#a8ff78",
    bgStart: "#0f2027",
    bgEnd: "#000000",
  },
} as const;

type ThemeKeys = keyof typeof themes;

export default function BirthdayCard() {
  const [name, setName] = useState("Awesome Person");
  const [theme, setTheme] = useState<ThemeKeys>("party");
  const [showSettings, setShowSettings] = useState(false);
  const [balloons, setBalloons] = useState<{ id: number; x: number; delay: number; color: string }[]>([]);

  // Load saved settings on mount
  useEffect(() => {
    const savedName = localStorage.getItem("birthday-name");
    const savedTheme = localStorage.getItem("birthday-theme") as ThemeKeys;
    if (savedName) setName(savedName);
    if (savedTheme && themes[savedTheme]) setTheme(savedTheme);
    createBalloons();
  }, []);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem("birthday-name", name);
    localStorage.setItem("birthday-theme", theme);
  }, [name, theme]);

  const currentTheme = themes[theme];

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = [currentTheme.primary, currentTheme.secondary, currentTheme.accent];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const createBalloons = useCallback(() => {
    const colors = [currentTheme.primary, currentTheme.secondary, currentTheme.accent];
    const newBalloons = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10, // 10% to 90%
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setBalloons(newBalloons);
  }, [currentTheme]);

  const handlePageClick = (e: React.MouseEvent) => {
    // Only shoot balloons if not clicking on the main card or settings
    const target = e.target as HTMLElement;
    if (target.closest(".glass-card") || target.closest(".settings-panel")) {
      return;
    }
    
    // Add one balloon at click position (roughly)
    const newBalloon = {
      id: Date.now(),
      x: (e.clientX / window.innerWidth) * 100,
      delay: 0,
      color: [currentTheme.primary, currentTheme.secondary, currentTheme.accent][Math.floor(Math.random() * 3)],
    };
    setBalloons((prev) => [...prev, newBalloon]);
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-1000"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.bgStart}, ${currentTheme.bgEnd})`
      }}
      onClick={handlePageClick}
    >
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Floating Balloons */}
      <AnimatePresence>
        {balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            initial={{ y: "110vh", opacity: 1, x: `${balloon.x}vw` }}
            animate={{ y: "-20vh", opacity: 0 }}
            transition={{ duration: 6 + Math.random() * 4, delay: balloon.delay, ease: "easeOut" }}
            onAnimationComplete={() => setBalloons((prev) => prev.filter((b) => b.id !== balloon.id))}
            className="absolute bottom-0 z-0 drop-shadow-lg"
          >
            <div 
              className="w-12 h-16 rounded-full relative"
              style={{ backgroundColor: balloon.color }}
            >
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: balloon.color }}></div>
              <div className="absolute -bottom-16 left-1/2 w-0.5 h-16 bg-white/20"></div>
              <div className="absolute top-2 right-2 w-3 h-5 bg-white/30 rounded-full rotate-45 blur-[1px]"></div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="glass-card relative z-10 w-full max-w-lg p-8 md:p-12 rounded-3xl mx-4 text-center cursor-default"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-24 h-24 mb-6 rounded-2xl flex items-center justify-center rotate-3 relative shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse-slow"></div>
          <PartyPopper size={40} className="text-white relative z-10 -rotate-3 drop-shadow-md" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text mb-4 drop-shadow-sm font-sans"
            style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.accent})` }}>
          Happy Birthday!
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 capitalize tracking-wide">
          {name}
        </h2>

        <p className="text-white/80 text-lg md:text-xl mb-6 leading-relaxed font-light">
          Happy Birthday to the most precious person in my world, my{' '}
          <span 
            className="font-extrabold text-transparent bg-clip-text text-xl md:text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wide"
            style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.accent})` }}
          >
            මැණිකේ
          </span>
          . You truly are the gem that makes my life shine brighter every day. I love you beyond words! 🤍
        </p>

        <p className="text-white/60 text-base md:text-lg mb-10 italic font-light">
          Sorry for the late{' '}
          <span 
            className="font-bold text-transparent bg-clip-text"
            style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.accent})` }}
          >
            මැණිකේ
          </span>
          {' '}🥺
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerConfetti}
          className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white shadow-xl flex items-center justify-center gap-3 transition-transform"
          style={{ background: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.secondary})` }}
        >
          <PartyPopper size={24} />
          <span>Celebrate!</span>
        </motion.button>
      </motion.div>

      {/* Settings Button */}
      <motion.button
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowSettings(true)}
        className="absolute top-6 right-6 p-3 rounded-full glass-card text-white hover:bg-white/10 transition-colors z-20"
      >
        <Settings size={24} />
      </motion.button>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card settings-panel w-full max-w-md p-6 rounded-2xl relative"
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings size={20} />
                Customize
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <Type size={16} />
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Enter name..."
                  />
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                    <Palette size={16} />
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.entries(themes) as [ThemeKeys, typeof themes[ThemeKeys]][]).map(([key, t]) => (
                      <button
                        key={key}
                        onClick={() => setTheme(key)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          theme === key ? 'border-white bg-white/10 scale-105' : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div 
                          className="w-full h-8 rounded-lg shadow-inner"
                          style={{ background: `linear-gradient(to right, ${t.primary}, ${t.secondary})` }}
                        />
                        <span className="text-xs font-medium text-white">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Instructions Overlay (Fades out) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-light pointer-events-none tracking-widest uppercase"
      >
        Click anywhere for more balloons
      </motion.div>
    </div>
  );
}
