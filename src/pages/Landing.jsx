import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight, Bot, Zap, Shield, CircleUser,
  Github,
  Linkedin, Mail, MapPin, Phone, Facebook, Instagram, Youtube, MessageSquare, MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { logo, name } from '../constants';
import { getUserData } from '../userStore/userData';
import { AppRoute } from '../types';
import LandingLiveDemoModal from '../Components/LiveDemo/LandingLiveDemoModal';
import { useRecoilState } from 'recoil';
import { demoModalState } from '../userStore/demoStore';
import SecurityModal from '../Components/LiveDemo/SecurityModal';
import { FaXTwitter } from "react-icons/fa6";
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router';
// Added Link import which was missing

const Landing = () => {
  const navigate = useNavigate();
  const user = getUserData();
  const [demoState, setDemoState] = useRecoilState(demoModalState);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const btnClass = "px-8 py-4 bg-surface border border-border rounded-2xl font-bold text-lg text-maintext hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-2";

  // ... (rest of code)

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-secondary">

      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-4 py-4 md:px-6 md:py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 md:gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
          <span className="text-xl md:text-3xl font-black tracking-tighter text-maintext">AISA <sup className="text-xs">TM</sup></span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 md:p-2 rounded-full bg-surface border border-border text-subtext hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5 text-orange-400" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

          {user ? <Link to={AppRoute.PROFILE}><CircleUser className='h-6 w-6 md:h-7 md:w-7 text-maintext' /></Link> : <div className="flex gap-2 md:gap-4 items-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm md:text-base text-subtext hover:text-primary font-medium transition-colors whitespace-nowrap"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-white px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full font-semibold hover:opacity-90 transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              Get Started
            </button>
          </div>}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 py-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-sm text-subtext mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          Powered by UWO
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-maintext"
        >
          The Future of <br />
          <span className="text-primary">Conversational AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-subtext max-w-2xl mb-10 leading-relaxed"
        >
          Experience the next generation of intelligent assistance.
          AISA learns, adapts, and creates with you in real-time through a stunning interface.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-2xl"
        >

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard/chat/new")}
            className="px-8 py-4 bg-primary rounded-2xl font-bold text-lg text-white shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Now <ArrowRight className="w-5 h-5" />
          </motion.button>



          {!user && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className={btnClass}
            >
              Existing User
            </motion.button>
          )}
        </motion.div>






        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left"
        >
          <div className="p-6 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-maintext">Smart Agents</h3>
            <p className="text-subtext">
              Access a marketplace of specialized AI agents for coding, writing, and analysis.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-maintext">Real-time Speed</h3>
            <p className="text-subtext">
              Powered by the fastest AI models for instant, fluid conversation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-maintext">Secure & Private</h3>
            <p className="text-subtext">
              Enterprise-grade security ensures your data and conversations stay private.
            </p>
          </div>
        </motion.div>


      </main>

      {/* Footer Section */}
      <footer className="w-full bg-background border-t border-border mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                <span className="text-2xl font-black tracking-tighter text-maintext">AISA <sup className="text-xs">TM</sup></span>
              </div>
              <p className="text-sm text-subtext leading-relaxed max-w-sm">
                AISA <sup className="text-xs">TM</sup> — India’s First AI App Marketplace 🚀<br />
                100 AI Apps | AISA <sup className="text-xs">TM</sup> | Partner Integrations<br />
                Powered by UWO™
              </p>
              <div className="flex items-center gap-4">
                {[
                  {
                    icon: <Linkedin className="w-5 h-5" />,
                    href: "https://www.linkedin.com/authwall?trk=bf&trkInfo=AQF3pSWm3RFcZQAAAZtzxKHoH3Gk0Is5rVSKn-E57xtOi8yVUop7C1hlM2loZWRfEP9RIwqwNjjt4PjJQMmAxxwNqIw5YDwxftwn5e_z7XccQBdXFipFYgZgnb9UscYZ4BTGo3o=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Faimall-global%2F",
                    color: "text-[#0077B5]",
                    bg: "bg-[#0077B5]/10",
                    hover: "hover:bg-[#0077B5]"
                  },
                  {
                    icon: <FaXTwitter className="w-5 h-5" />,
                    href: "https://x.com/aimallglobal",
                    color: "text-black dark:text-white",
                    bg: "bg-black/10 dark:bg-white/10",
                    hover: "hover:bg-black dark:hover:bg-white dark:hover:text-black"
                  },
                  {
                    icon: <Facebook className="w-5 h-5" />,
                    href: "https://www.facebook.com/aimallglobal/",
                    color: "text-[#1877F2]",
                    bg: "bg-[#1877F2]/10",
                    hover: "hover:bg-[#1877F2]"
                  },
                  {
                    icon: <Instagram className="w-5 h-5" />,
                    href: "https://www.instagram.com/aimall.global/",
                    color: "text-[#E4405F]",
                    bg: "bg-[#E4405F]/10",
                    hover: "hover:bg-[#E4405F]"
                  },
                  {
                    icon: <Youtube className="w-5 h-5" />,
                    href: "https://www.youtube.com/@aimallglobal",
                    color: "text-[#FF0000]",
                    bg: "bg-[#FF0000]/10",
                    hover: "hover:bg-[#FF0000]"
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    ),
                    href: "https://api.whatsapp.com/send?phone=918359890909",
                    color: "text-[#25D366]",
                    bg: "bg-[#25D366]/10",
                    hover: "hover:bg-[#25D366]"
                  }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl ${social.bg} transition-all duration-300 flex items-center justify-center ${social.color} ${social.hover} hover:text-white shrink-0 shadow-sm`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Explore Column */}
            <div>
              <h4 className="text-sm font-bold text-maintext uppercase tracking-widest mb-6">Explore</h4>
              <ul className="space-y-4">
                {[
                  { label: "Chat", onClick: () => navigate("/dashboard/chat") },
                  { label: "Login", onClick: () => navigate("/login") },
                  { label: "Sign Up", onClick: () => navigate("/signup") },
                  // { label: "Live Demos", onClick: () => setDemoState({ ...demoState, isOpen: true }) }
                ].map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={link.onClick}
                      className="text-sm text-subtext hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-sm font-bold text-maintext uppercase tracking-widest mb-6">Support</h4>
              <ul className="space-y-4">
                {[
                  { label: "Help Center", path: "#" },
                  { label: "Security & Guidelines", onClick: () => setIsSecurityModalOpen(true) },
                  { label: "Contact Us", path: "mailto:contact@ai-mall.in" },
                  { label: "Status Page", path: "#" }
                ].map((link, i) => (
                  <li key={i}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-sm text-subtext hover:text-primary transition-colors font-medium"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.path}
                        className="text-sm text-subtext hover:text-primary transition-colors font-medium"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-maintext uppercase tracking-widest mb-6">Contact</h4>
              <div className="space-y-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Jabalpur+Madhya+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-subtext leading-relaxed group-hover:text-primary transition-colors">
                    Jabalpur, Madhya Pradesh
                  </p>
                </a>
                <a
                  href="mailto:support@ai-mall.in"
                  className="flex items-center gap-3 group"
                >
                  <Mail className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-subtext group-hover:text-primary transition-colors font-medium">
                    support@ai-mall.in
                  </span>
                </a>
                <a
                  href="tel:+918358990909"
                  className="flex items-center gap-3 group"
                >
                  <Phone className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-subtext group-hover:text-primary transition-colors font-medium">
                    +91 83589 90909
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-subtext font-medium">
              © {new Date().getFullYear()} AISA. All rights reserved. Partnered with UWO-LINK™.
            </p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-xs text-subtext hover:text-maintext transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="text-xs text-subtext hover:text-maintext transition-colors font-medium">Terms of Service</a>
              <a href="#" className="text-xs text-subtext hover:text-maintext transition-colors font-medium">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <LandingLiveDemoModal
        isOpen={demoState.isOpen}
        onClose={() => setDemoState({ ...demoState, isOpen: false })}
      />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div >
  );
};

export default Landing;