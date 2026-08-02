import { Link } from "react-router-dom";
import {
  Heart,
  Compass,
  Send,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";
import useThemeStore from '@/stores/themeStore';

const Footer = () => {
  const { theme } = useThemeStore();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "QUICK LINKS",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Cities", to: "/cities" },
        { label: "Near Me", to: "/explore-near-me" },
        { label: "Plan Trip", to: "/trips/plan" },
      ],
    },
    {
      title: "CATEGORIES",
      links: [
        { label: "Street Food", to: "/cities" },
        { label: "Biryani", to: "/cities" },
        { label: "South Indian", to: "/cities" },
        { label: "Mithai", to: "/cities" },
        { label: "Café", to: "/cities" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "Home", to: "/" },
        { label: "Contact Us", to: "/about" },
        { label: "Privacy Policy", to: "/about" },
        { label: "Terms of Service", to: "/about" },
      ],
    },
    {
      title: "TOP CITIES",
      links: [
        { label: "Varanasi", to: "/cities" },
        { label: "Delhi", to: "/cities" },
        { label: "Lucknow", to: "/cities" },
        { label: "Jaipur", to: "/cities" },
        { label: "Mumbai", to: "/cities" },
      ],
    },
  ];

  return (
    <footer data-theme="dark" className="relative bg-black/5 overflow-hidden pt-12">

      {/* Decorative blurred blobs for background texture */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-300/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-300/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Outer wrapper maintaining the width constraints requested */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 pb-12 relative z-10">

        {/* ── Main Unified Card (Everything inside this) ── */}
        <div className="w-full bg-[#121212] rounded-[10px] shadow-[0_20px_80px_rgba(245,130,22,0.06)] flex flex-col relative overflow-hidden transition-colors duration-300">

          {/* Top Section */}
          <div className="flex flex-col lg:flex-row relative">

            {/* Left Section */}
            <div className="w-full lg:w-1/2 p-10 lg:p-14 xl:p-16">
              <Link
                to="/"
                className="flex items-center gap-4 group shrink-0 w-fit"
                style={{ textDecoration: 'none' }}
              >
                <div className="text-[var(--color-text)] group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 26 L16 26 L20 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="23" y="16" width="3" height="18" fill="currentColor" />
                    <rect x="43" y="16" width="3" height="18" fill="currentColor" />
                    <path d="M26 27 C 26 33, 34 33, 34 27 Z" fill="#4B8B79" />
                    <rect x="36" y="27" width="4" height="5" fill="#8C5A3C" rx="1" />
                    <rect x="42" y="22" width="5.5" height="10" fill="#82828C" rx="1" />
                    <path d="M14 16 L17 6 H49 L52 16" fill="#F58216" />
                    <path d="M14 16 A 4.75 4.75 0 0 0 23.5 16 A 4.75 4.75 0 0 0 33 16 A 4.75 4.75 0 0 0 42.5 16 A 4.75 4.75 0 0 0 52 16" fill="#F58216" />
                    <path d="M20 32 H48 C50.2091 32 52 33.7909 52 36 V48 C52 50.2091 50.2091 52 48 52 H20 V32 Z" fill="currentColor" />
                    <rect x="14" y="36" width="16" height="3.5" rx="1.75" fill="currentColor" />
                    <rect x="8" y="42" width="26" height="3.5" rx="1.75" fill="currentColor" />
                    <rect x="16" y="48" width="16" height="3.5" rx="1.75" fill="currentColor" />
                    <path d="M48 52 L50 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="35" cy="54" r="10" fill="#F58216" stroke="var(--color-surface)" strokeWidth="2.5" />
                    <circle cx="35" cy="54" r="3.5" fill="var(--color-surface)" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center mt-1">
                  <span className="text-[28px] font-black text-[#F58216] leading-none tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                    GULY EATS
                  </span>
                  <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] mt-1 pl-0.5">
                    SINCE 2026
                  </span>
                </div>
              </Link>

              <p className="mt-8 text-[var(--color-text-secondary)] font-medium max-w-[560px] text-[15px] xl:text-[17px] leading-8">
                Discover authentic street food, legendary eateries, hidden cafés and unforgettable culinary experiences from every corner of India. Let us take you on a gastronomic journey through the bylanes and gullies where real flavors live.
              </p>

              <Link
                to="/cities"
                className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-[#F58216] text-white rounded-full font-bold text-[15px] hover:bg-orange-600 transition-all hover:scale-105 shadow-md shadow-orange-500/20"
              >

              </Link>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 p-10 lg:p-14 xl:p-16 flex flex-col justify-center">
              <h3 className="text-[32px] font-black text-[var(--color-text)] mb-4 tracking-tight flex items-center gap-3">
                Stay in the loop! <span className="text-[#F58216]">✨</span>
              </h3>

              <p className="text-[var(--color-text-muted)] text-[15px] xl:text-[16px] mb-8 font-medium leading-relaxed max-w-[500px]">
                Get hidden food gems, travel guides and exclusive recommendations delivered straight to your inbox.
              </p>

              {/* Input & Button */}
              <div className="flex w-full items-center bg-[var(--color-background)] rounded-full p-2 mb-10 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/50 transition-all group shadow-sm max-w-lg">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full flex-1 px-6 py-2 text-base bg-transparent outline-none font-medium text-[var(--color-text)] placeholder-[var(--color-text-muted)]"
                />
                <button className="bg-[#F58216] text-white px-8 py-3 rounded-full font-bold text-[15px] hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm">
                  <Send size={16} /> Subscribe
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4">
                {[
                  { icon: FaInstagram, label: "Instagram" },
                  { icon: FaFacebookF, label: "Facebook" },
                  { icon: FaYoutube, label: "YouTube" },
                  { icon: FaTwitter, label: "Twitter" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    aria-label={social.label}
                    className="w-14 h-14 bg-[var(--color-surface-elevated)] rounded-2xl shadow-sm flex items-center justify-center text-[#F58216] hover:bg-[#F58216] hover:text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <social.icon size={22} />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* ── Links Section ── */}
          <div className="bg-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {footerLinks.map((section, index) => (
                <div key={section.title} className="p-10 lg:p-12">
                  <h4 className="text-[14px] font-black text-[var(--color-text)] tracking-[0.1em] mb-6">
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map(link => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="group flex items-center gap-2 text-[#F58216] font-semibold text-[15px] hover:text-orange-600 transition-colors"
                        >
                          <ChevronRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="bg-transparent py-6 px-10 lg:px-12 flex flex-col xl:flex-row items-center justify-between gap-6 text-[13px] font-semibold text-[var(--color-text-secondary)]">
            <p className="text-center xl:text-left">
              © {currentYear} <span className="text-[#F58216] font-bold">Guly Eats</span>. All Rights Reserved.
            </p>

            <p className="flex items-center gap-1.5 xl:absolute xl:left-1/2 xl:-translate-x-1/2">
              Made with <Heart size={14} className="text-[#EF4444] fill-[#EF4444]" />Riddhi <span className="text-[10px] tracking-widest "></span>
            </p>

          </div>

        </div>
      </div>
    </footer >
  );
};

export default Footer;