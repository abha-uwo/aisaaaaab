import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Brain, Rocket, Bell } from 'lucide-react';

export default function ComingSoon() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Brain, text: 'Advanced AI Capabilities' },
    { icon: Zap, text: 'Lightning Fast Processing' },
    { icon: Sparkles, text: 'Intelligent Automation' },
    { icon: Rocket, text: 'Next-Gen Solutions' }
  ];

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-pulse top-0 left-0"></div>
        <div className="absolute w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-pulse bottom-0 right-0" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '1400ms' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl w-full">
        <div className="bg-surface rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-border">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-primary p-6 rounded-full shadow-lg">
                <Sparkles className="w-12 h-12 text-secondary" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 text-maintext">
            New AI Agents
          </h1>

          <div className="text-center mb-8">
            <p className="text-3xl md:text-4xl font-semibold text-primary inline-block">
              Coming Soon{dots}
            </p>
          </div>

          {/* Description */}
          <p className="text-xl text-subtext text-center mb-12 max-w-2xl mx-auto leading-relaxed">
            We're crafting exceptional AI agents to revolutionize your A-Series experience.
            Get ready for something extraordinary!
          </p>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-secondary rounded-xl p-5 border border-border hover:border-primary transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 group-hover:bg-primary p-2.5 rounded-lg transition-all duration-300">
                      <Icon className="w-5 h-5 text-primary group-hover:text-secondary transition-all duration-300" strokeWidth={2.5} />
                    </div>
                    <span className="text-maintext font-medium">{feature.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-maintext text-sm font-semibold">Development Progress</span>
              <span className="text-primary text-sm font-bold">85%</span>
            </div>
            <div className="w-full bg-border rounded-full h-3 overflow-hidden border border-border">
              <div className="bg-primary h-full rounded-full relative overflow-hidden" style={{ width: '85%' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center">
            <p className="text-subtext mb-6 text-base">Stay tuned for the launch and be the first to know!</p>
            <button className="bg-primary hover:bg-primary/90 text-secondary font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
              <Bell className="w-5 h-5" strokeWidth={2.5} />
              <span>Notify Me</span>
            </button>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-subtext mt-8 text-sm">
          🚀 Exciting features are on the way
        </p>
      </div>
    </div>
  );
}