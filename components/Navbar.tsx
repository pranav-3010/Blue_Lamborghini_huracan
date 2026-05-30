"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-black/75 backdrop-blur-md border-brand-blue/20 py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="font-heading text-lg font-bold tracking-[0.3em] text-white hover:text-brand-blue transition-colors">
            HURACÁN
          </span>
          <span className="text-[10px] tracking-widest text-brand-blue font-bold px-2 py-0.5 border border-brand-blue/30 rounded bg-brand-blue-dark/20 font-heading">
            AD PERSONAM
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("specs")}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Specifications
          </button>
          <button
            onClick={() => scrollToSection("gallery")}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => scrollToSection("inquire")}
            className="px-6 py-2 bg-transparent border border-brand-blue text-brand-blue text-xs uppercase tracking-widest font-heading font-semibold rounded hover:bg-brand-blue hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,136,255,0.1)] hover:shadow-[0_0_20px_rgba(0,136,255,0.4)] cursor-pointer"
          >
            INQUIRE NOW
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
