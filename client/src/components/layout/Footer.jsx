import { Link } from "react-router-dom";
import { Heart, Mail, Phone, Printer, MapPin, Send, ChevronRight } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

/* ═══════════════════════════════════════════════
   FOOTER DATA
   ═══════════════════════════════════════════════ */

const FOOTER_LINKS = {
  explore: [
    { label: "Cities", to: "/cities" },
    { label: "Near Me", to: "/explore-near-me" },
    { label: "Plan a Trip", to: "/trips/plan" },
  ],
  company: [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/about" },
    { label: "Careers", to: "/about" },
    { label: "Privacy Policy", to: "/about" },

  ],
  contact: [
    { icon: MapPin, text: "Varanasi, Uttar Pradesh, India" },
    { icon: Mail, text: "contact@gulyeats.com" },
    { icon: Phone, text: "+91 XXXXX XXXXX" },
  ],
};

/* ═══════════════════════════════════════════════
   STYLES / CONSTANTS
   ═══════════════════════════════════════════════ */

const bgImage = "https://unrealimages.com/files/image/1280x964/11693331320puebueow989fjaabtvfq0f0rxbsiq5iu5xjy8pwjz8pvfwmwjxmypdrr9p4j511sch1gvrpt9yo45lv5niqylk20v6hsczp3nda2.jpeg";
const COLORS = { bg: "#0a0401", accent: "#FF6B2B" };

/* ═══════════════════════════════════════════════
   MAIN FOOTER COMPONENT
   ═══════════════════════════════════════════════ */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full mt-32 bg-[#0a0401] font-sans">

      {/* ── Wave Transition ── */}
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full absolute top-0 left-0 -translate-y-[99%] h-[60px] md:h-[100px] z-10 pointer-events-none"
        preserveAspectRatio="none"
      >
        <path d="M0,100 C480,0 960,150 1440,20 L1440,100 L0,100 Z" fill={COLORS.bg} />
        <path d="M0,100 C480,0 960,150 1440,20" stroke={COLORS.accent} strokeWidth="3" fill="none" />
      </svg>

      {/* ── Footer Body ── */}

      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full opacity-50 z-0 pointer-events-none"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark gradient to blend the image into the background color */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0401] via-[#0a0401]/80 to-[#0a0401]/10 z-0 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1775px] mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-10 flex flex-col justify-between">

        {/* ── Top Auth Bar ── */}
        <div className="flex justify-end items-center gap-6 mb-24">
          <Link to="/login" className="text-white hover:text-[#FF6B2B] text-[15px] font-medium transition-colors">
            Log In
          </Link>
          <div className="w-[1px] h-2 bg-white/20" />
          <Link to="/signup" className="text-white px-2 py-2.5 rounded-full text-[14px] font-semibold ">
            Sign Up
          </Link>
        </div>

        {/* ── Main 5-Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-14 lg:gap-10 mb-12">

          {/* Column 1: Logo & Description */}
          <div className="lg:col-span-5 pr-0 lg:pr-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 relative shrink-0 text-white">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                  {/* Handle */}
                  <path d="M10 26 L16 26 L20 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Poles */}
                  <rect x="23" y="16" width="2.5" height="18" fill="currentColor" />
                  <rect x="43" y="16" width="2.5" height="18" fill="currentColor" />

                  {/* Items on counter */}
                  {/* Green Bowl */}
                  <path d="M26 27 C 26 33, 34 33, 34 27 Z" fill="#4B8B79" />
                  {/* Brown block */}
                  <rect x="36" y="27" width="4" height="5" fill="#8C5A3C" rx="1" />
                  {/* Grey block */}
                  <rect x="42" y="22" width="5.5" height="10" fill="#82828C" rx="1" />

                  {/* Awning */}
                  <path d="M14 16 L17 6 H49 L52 16" fill="var(--color-primary)" />
                  <path d="M14 16 A 4.75 4.75 0 0 0 23.5 16 A 4.75 4.75 0 0 0 33 16 A 4.75 4.75 0 0 0 42.5 16 A 4.75 4.75 0 0 0 52 16" fill="var(--color-primary)" />

                  {/* Cart Body Base */}
                  <path d="M20 32 H48 C50.2091 32 52 33.7909 52 36 V48 C52 50.2091 50.2091 52 48 52 H20 V32 Z" fill="currentColor" />

                  {/* Speed lines */}
                  <rect x="14" y="36" width="16" height="3.5" rx="1.75" fill="currentColor" />
                  <rect x="8" y="42" width="26" height="3.5" rx="1.75" fill="currentColor" />
                  <rect x="16" y="48" width="16" height="3.5" rx="1.75" fill="currentColor" />

                  {/* Leg */}
                  <path d="M48 52 L50 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

                  {/* Wheel */}
                  <circle cx="35" cy="54" r="10" fill="var(--color-primary)" stroke="rgba(10, 4, 1, 0.9)" strokeWidth="2.5" />
                  <circle cx="35" cy="54" r="3.5" fill="rgba(10, 4, 1, 0.9)" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[28px] font-black leading-none mb-2 tracking-wider drop-shadow-md" style={{ fontFamily: "var(--font-heading, sans-serif)", color: "#ffffff" }}>GULY EATS</h3>
                <p className="text-[11px] font-bold tracking-[0.3em] text-[#FF6B2B] leading-none">SINCE 2026</p>
              </div>
            </div>
            <p className="text-[16px] text-white leading-[1.8] font-medium max-w-[95%]  ">
              Discover authentic street food, legendary eateries, hidden cafés and unforgettable culinary experiences from every corner of India. Let us take you on a gastronomic journey through the bylanes and gullies where real flavors live.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-bold tracking-[0.15em] mb-8 uppercase drop-shadow-sm" style={{ color: "#ffffff" }}>Explore</h4>
            <ul className="flex flex-col gap-5">
              {FOOTER_LINKS.explore.map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="flex items-center gap-3 text-[16px] text-white hover:text-[#FF6B2B] transition-colors group">
                    <ChevronRight size={18} strokeWidth={3} className="text-[#FF6B2B] group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-bold tracking-[0.15em] mb-8 uppercase drop-shadow-sm" style={{ color: "#ffffff" }}>Company</h4>
            <ul className="flex flex-col gap-5">
              {FOOTER_LINKS.company.map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="flex items-center gap-3 text-[16px] text-white hover:text-[#FF6B2B] transition-colors group">
                    <ChevronRight size={18} strokeWidth={3} className="text-[#FF6B2B] group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-bold tracking-[0.15em] mb-8 uppercase drop-shadow-sm" style={{ color: "#ffffff" }}>Contact</h4>
            <ul className="flex flex-col gap-5">
              {FOOTER_LINKS.contact.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[14px] text-white">
                  <item.icon size={17} className="text-[#FF6B2B] shrink-0 mt-1.5" />
                  <span className="leading-[1.8] max-w-[180px]">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom Section (Copyright) ── */}
        <div className="flex justify-center mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-[13px] text-white/60 bg-black/50 backdrop-blur-md py-3 px-8 rounded-full border border-white/5 shadow-xl">
            <div>
              © {currentYear} <Link to="/" className="font-semibold hover:text-[#FF6B2B] transition-colors" style={{ color: "#ffffff" }}>GULY EATS</Link>.
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1.5">
              Made with <Heart size={13} className="text-[#EF4444] fill-current" /> by <span className="font-semibold" style={{ color: "#ffffff" }}>Riddhi</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;