"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useSpring, motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import Navbar from "@/components/Navbar";
import HuracanScrollCanvas from "@/components/HuracanScrollCanvas";
import HuracanExperience from "@/components/HuracanExperience";
import { CAR_SPECS, FAQ_ITEMS } from "@/data/carData";
import Image from "next/image";

// Initialize EmailJS
emailjs.init("ci9TMPsA2lD6BjsDa");

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [windowHeight, setWindowHeight] = useState(800); // Safe default for server compilation
  
  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Purchase Inquiry",
    message: "",
  });
  const [formSubmitState, setFormSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string>("");

  // Track the raw window scroll position
  const { scrollY } = useScroll();

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Map scrollY to a 0-1 progress value over the sticky sequence range (which is active for 5 * windowHeight pixels)
  const rawScrollYProgress = useTransform(scrollY, [0, 5 * windowHeight], [0, 1], {
    clamp: true,
  });

  // Apply smooth physics spring to make frame cycling and telemetry extremely smooth
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 45,  // lower stiffness for cinematic slide easing
    damping: 18,     // damp to eliminate micro-jittering
    restDelta: 0.0001
  });

  // Unique categories list for specifications
  const categories = ["All", "Engine", "Performance", "Design", "Transmission"];

  // Filtered specs logic
  const filteredSpecs = activeCategory === "All"
    ? CAR_SPECS
    : CAR_SPECS.filter((spec) => spec.category === activeCategory);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitState("submitting");
    setFormError("");

    try {
      // Send email via EmailJS
      await emailjs.send(
        "service_zcc9c34", // Service ID
        "template_um0mjzt", // Template ID
        {
          to_email: "chiravurip493@gmail.com",
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          inquiry_type: formData.inquiryType,
          message: formData.message,
          // Also send confirmation to user
          to_email_user: formData.email,
        }
      );

      // Success
      setFormSubmitState("success");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiryType: "Purchase Inquiry",
          message: "",
        });
        setFormSubmitState("idle");
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError(error instanceof Error ? error.message : "Failed to send inquiry. Please try again.");
      setFormSubmitState("error");
    }
  };

  return (
    <main className="relative bg-[#0d0d0d] min-h-screen text-white selection:bg-brand-blue selection:text-white">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Scroll Controlled Image Sequence & HUD (Sticky 600vh Container) */}
      <div ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Background Canvas Sequencer */}
          <HuracanScrollCanvas
            scrollYProgress={scrollYProgress}
            totalFrames={104}
            imageFolderPath="/frames"
          />
          
          {/* Scroll Synchronized HUD Overlay */}
          <HuracanExperience scrollYProgress={scrollYProgress} />
        </div>
      </div>

      {/* 3. Supplemental Content Sections (Scroll naturally after sequence) */}
      <div className="relative bg-[#0d0d0d] z-30 pt-16">
        
        {/* Decorative Grid Separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
        
        {/* A. Specifications Grid Section */}
        <section id="specs" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <span className="text-[10px] text-brand-blue font-heading tracking-[0.3em] uppercase block mb-2">
              TECHNICAL DOSSIER
            </span>
            <h2 className="text-4xl font-extrabold font-heading tracking-wide uppercase">
              SPECIFICATIONS
            </h2>
            <div className="w-16 h-0.5 bg-brand-blue mx-auto mt-4" />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-heading uppercase tracking-widest border transition-all duration-300 rounded cursor-pointer ${
                  activeCategory === cat
                    ? "bg-brand-blue border-brand-blue text-white shadow-[0_0_15px_rgba(0,136,255,0.3)]"
                    : "bg-transparent border-white/10 text-white/60 hover:border-brand-blue/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Specifications List */}
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredSpecs.map((spec, index) => (
                <motion.div
                  key={`${spec.label}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="hud-bg border border-white/5 p-5 rounded flex justify-between items-center hover:border-brand-blue/20 transition-all duration-300 group"
                >
                  <div>
                    <span className="text-[10px] text-brand-blue/70 font-heading tracking-wider block mb-1">
                      {spec.category}
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-white/90 group-hover:text-white transition-colors">
                      {spec.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold font-heading font-mono text-brand-blue text-right">
                    {spec.value}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent my-10" />

        {/* B. Media Gallery Section */}
        <section id="gallery" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <span className="text-[10px] text-brand-blue font-heading tracking-[0.3em] uppercase block mb-2">
              CURATED MEDIA
            </span>
            <h2 className="text-4xl font-extrabold font-heading tracking-wide uppercase">
              GALLERY SHOWCASE
            </h2>
            <div className="w-16 h-0.5 bg-brand-blue mx-auto mt-4" />
          </div>

          {/* Grid Layout of generated premium photographs */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {/* Front View */}
            <div className="relative group overflow-hidden rounded-lg border border-white/5 bg-matte-black/50 aspect-square flex flex-col justify-end">
              <Image
                src="/gallery/huracan_front.png"
                alt="Blue Huracan Front View"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative z-10 p-6 text-left">
                <span className="text-[9px] text-brand-blue font-heading font-semibold tracking-[0.2em] uppercase">
                  PERSPECTIVE // 01
                </span>
                <h3 className="text-lg font-bold font-heading uppercase text-white mt-1">
                  Aerodynamic Stance
                </h3>
                <p className="text-xs text-white/60 font-light mt-2">
                  Front fascia design optimized for downforce, cooling, and aggressive aesthetics.
                </p>
              </div>
            </div>

            {/* Rear View */}
            <div className="relative group overflow-hidden rounded-lg border border-white/5 bg-matte-black/50 aspect-square flex flex-col justify-end">
              <Image
                src="/gallery/huracan_rear.png"
                alt="Blue Huracan Rear View"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative z-10 p-6 text-left">
                <span className="text-[9px] text-brand-blue font-heading font-semibold tracking-[0.2em] uppercase">
                  PERSPECTIVE // 02
                </span>
                <h3 className="text-lg font-bold font-heading uppercase text-white mt-1">
                  Engine Exhaust Exhaust
                </h3>
                <p className="text-xs text-white/60 font-light mt-2">
                  Screaming performance with titanium exhaust and rear carbon diffuser details.
                </p>
              </div>
            </div>

            {/* Interior View */}
            <div className="relative group overflow-hidden rounded-lg border border-white/5 bg-matte-black/50 aspect-square flex flex-col justify-end md:col-span-2 lg:col-span-1">
              <Image
                src="/gallery/huracan_interior.png"
                alt="Blue Huracan Interior View"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative z-10 p-6 text-left">
                <span className="text-[9px] text-brand-blue font-heading font-semibold tracking-[0.2em] uppercase">
                  PERSPECTIVE // 03
                </span>
                <h3 className="text-lg font-bold font-heading uppercase text-white mt-1">
                  Digital Cockpit
                </h3>
                <p className="text-xs text-white/60 font-light mt-2">
                  Driver-centric controls upholstered in premium Alcantara with carbon fiber switches.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent my-10" />

        {/* C. Frequently Asked Questions Section */}
        <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <span className="text-[10px] text-brand-blue font-heading tracking-[0.3em] uppercase block mb-2">
              ACQUISITION GUIDE
            </span>
            <h2 className="text-4xl font-extrabold font-heading tracking-wide uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="w-16 h-0.5 bg-brand-blue mx-auto mt-4" />
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="hud-bg border border-white/5 rounded overflow-hidden hover:border-brand-blue/20 transition-colors duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-6 text-left transition-colors duration-300 cursor-pointer"
                  >
                    <span className="text-sm font-heading font-semibold uppercase tracking-wider text-white">
                      {item.question}
                    </span>
                    <span className={`text-brand-blue transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-white/70 font-light border-t border-white/5 leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent my-10" />

        {/* D. Inquiry Contact Form Section */}
        <section id="inquire" className="max-w-4xl mx-auto px-6 py-20 mb-20">
          <div className="text-center mb-16">
            <span className="text-[10px] text-brand-blue font-heading tracking-[0.3em] uppercase block mb-2">
              COMMISSION AN OUTLAW
            </span>
            <h2 className="text-4xl font-extrabold font-heading tracking-wide uppercase">
              INQUIRE ACQUISITION
            </h2>
            <div className="w-16 h-0.5 bg-brand-blue mx-auto mt-4" />
          </div>

          <div className="hud-bg hud-border border-brand-blue/30 rounded-lg p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,136,255,0.05)]">
            
            {/* Ambient Background Grid lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-[0.03]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border border-brand-blue" />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {formSubmitState === "idle" && (
                <motion.form
                  key="inquiry-form"
                  onSubmit={handleFormSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-heading text-white/50 tracking-widest uppercase mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="MARCO BEZZECCHI"
                        className="w-full bg-[#141414] border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-white/20 focus:border-brand-blue focus:outline-none transition-colors duration-300 uppercase font-mono"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-heading text-white/50 tracking-widest uppercase mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="BEZZECCHI@ADPERSONAM.IT"
                        className="w-full bg-[#141414] border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-white/20 focus:border-brand-blue focus:outline-none transition-colors duration-300 uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] font-heading text-white/50 tracking-widest uppercase mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+39 333 456789"
                        className="w-full bg-[#141414] border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-white/20 focus:border-brand-blue focus:outline-none transition-colors duration-300 font-mono"
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-[10px] font-heading text-white/50 tracking-widest uppercase mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full bg-[#141414] border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-brand-blue focus:outline-none transition-colors duration-300 font-heading uppercase tracking-wider"
                      >
                        <option value="Purchase Inquiry">Acquisition / Purchase</option>
                        <option value="Private Demo">Private Race Track Demonstration</option>
                        <option value="Ad Personam Commission">Ad Personam Bespoke Commission</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-heading text-white/50 tracking-widest uppercase mb-2">
                      Custom Requirements / Request Specification
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="ENTER DETAILED AD PERSONAM REQUIREMENTS..."
                      className="w-full bg-[#141414] border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-white/20 focus:border-brand-blue focus:outline-none transition-colors duration-300 uppercase font-mono"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-3 bg-brand-blue hover:bg-brand-blue/80 text-white text-xs tracking-[0.25em] font-heading font-semibold uppercase rounded transition-colors shadow-[0_0_20px_rgba(0,136,255,0.3)] hover:shadow-[0_0_25px_rgba(0,136,255,0.5)] cursor-pointer"
                    >
                      TRANSMIT INQUIRY DOSSIER
                    </button>
                  </div>
                </motion.form>
              )}

              {formSubmitState === "submitting" && (
                <motion.div
                  key="submitting-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center space-y-4"
                >
                  <div className="w-12 h-12 border-2 border-brand-blue border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,136,255,0.4)]" />
                  <div className="text-xs font-heading text-brand-blue tracking-[0.3em] uppercase animate-pulse">
                    TRANSMITTING ENCRYPTED TELEMETRY...
                  </div>
                  <div className="text-[10px] text-white/30 font-mono">
                    SECURE SHELL // PORT 443 // sant'agata bolognese hq
                  </div>
                </motion.div>
              )}

              {formSubmitState === "success" && (
                <motion.div
                  key="success-overlay"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-16 h-16 border-2 border-brand-blue rounded-full flex items-center justify-center mx-auto bg-brand-blue-dark/20 shadow-[0_0_20px_rgba(0,136,255,0.3)]">
                    <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-heading text-white tracking-widest uppercase">
                      TRANSMISSION SUCCESSFUL
                    </h3>
                    <div className="text-[11px] text-brand-blue tracking-[0.2em] font-heading font-semibold uppercase">
                      SECURED CONNECTION ESTABLISHED
                    </div>
                  </div>
                  <div className="max-w-md mx-auto p-4 bg-[#141414] border border-brand-blue/20 rounded font-mono text-[11px] text-white/70 leading-relaxed uppercase">
                    COMMUNICATION ENCRYPTED // REQUEST ROUTED TO BOLOGNA H.Q. // AN AGENT WILL CONTACT YOU WITHIN 24 HOURS.
                  </div>
                  <button
                    onClick={() => {
                      setFormSubmitState("idle");
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        inquiryType: "Purchase Inquiry",
                        message: "",
                      });
                    }}
                    className="px-6 py-2 bg-transparent border border-white/20 hover:border-white hover:text-white text-white/60 text-[10px] font-heading tracking-widest uppercase rounded transition-colors cursor-pointer"
                  >
                    RESET COMMS MODULE
                  </button>
                </motion.div>
              )}

              {formSubmitState === "error" && (
                <motion.div
                  key="error-overlay"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-16 h-16 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto bg-red-500/10 shadow-[0_0_20px_rgba(255,59,48,0.3)]">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-heading text-white tracking-widest uppercase">
                      TRANSMISSION FAILED
                    </h3>
                    <div className="text-[11px] text-red-500 tracking-[0.2em] font-heading font-semibold uppercase">
                      ERROR OCCURRED
                    </div>
                  </div>
                  <div className="max-w-md mx-auto p-4 bg-[#141414] border border-red-500/30 rounded font-mono text-[11px] text-red-400/80 leading-relaxed">
                    {formError || "An error occurred while sending your inquiry. Please try again."}
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setFormSubmitState("idle");
                        setFormError("");
                      }}
                      className="px-6 py-2 bg-brand-blue hover:bg-brand-blue/80 border border-brand-blue text-white text-[10px] font-heading tracking-widest uppercase rounded transition-colors cursor-pointer"
                    >
                      RETRY
                    </button>
                    <button
                      onClick={() => {
                        setFormSubmitState("idle");
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          inquiryType: "Purchase Inquiry",
                          message: "",
                        });
                        setFormError("");
                      }}
                      className="px-6 py-2 bg-transparent border border-white/20 hover:border-white hover:text-white text-white/60 text-[10px] font-heading tracking-widest uppercase rounded transition-colors cursor-pointer"
                    >
                      RESET
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* E. Footer */}
        <footer className="bg-[#090909] border-t border-white/5 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left">
              <span className="font-heading text-sm font-bold tracking-[0.3em] text-white block mb-1">
                HURACÁN
              </span>
              <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase block">
                © {new Date().getFullYear()} LAMBORGHINI S.P.A. ALL RIGHTS RESERVED.
              </span>
            </div>
            <div className="flex gap-6 text-xs uppercase tracking-widest text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Legal Terms</a>
              <a href="#" className="hover:text-white transition-colors">Ad Personam</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
