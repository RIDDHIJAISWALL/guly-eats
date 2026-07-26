import { Link } from 'react-router-dom';
import { Heart, Utensils, Mail, ArrowRight } from 'lucide-react';
import useThemeStore from '@/stores/themeStore';

const Footer = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { label: 'All Cities', to: '/cities' },
        { label: 'Near Me', to: '/explore-near-me' },
        { label: 'Day Trips', to: '/trips/plan' },
        { label: 'Famous Places', to: '/cities' },
      ]
    },
    {
      title: 'Account',
      links: [
        { label: 'Log In', to: '/login' },
        { label: 'Sign Up', to: '/signup' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Wishlist', to: '/dashboard/wishlist' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '#' },
        { label: 'Contact', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
      ]
    }
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: isDark ? '#0A0A14' : '#1A1A2E',
        color: '#fff',
      }}
    >
      {/* Decorative Top Gradient Line */}
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, var(--color-primary), #FF8F50, var(--color-primary))' }} />

      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[200px] opacity-10"
        style={{ background: 'var(--color-primary)' }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        
        {/* Top Section - Logo + Newsletter */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-14 pb-10"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), #FF8F50)' }}>
                <Utensils size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)' }}>
                Guly Eats
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Discover the real taste of every Indian city. From iconic street food to hidden gems, we help you explore food, culture, and unforgettable flavors.
            </p>
          </div>

          {/* Newsletter CTA */}
          <div className="w-full lg:w-auto">
            <p className="text-sm font-bold mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Get weekly food discoveries 🍛
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1 lg:w-[280px]">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
              <button
                className="px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), #FF8F50)',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(255,107,43,0.3)',
                }}
              >
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16 mb-14">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--color-primary)' }}>
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm font-medium transition-all duration-200 hover:text-white hover:translate-x-1 inline-block"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © {currentYear} Guly Eats. Made with
            <Heart size={12} className="text-red-500 fill-red-500" />
            by Riddhi
          </p>

          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Support'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs font-medium transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
