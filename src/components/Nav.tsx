import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MessageSquare, Phone, X } from 'lucide-react';
import { business, links } from '../config/business';

export const NAV = [
  { href: '#top', label: 'Home' },
  { href: '#hvac', label: 'HVAC Services' },
  { href: '#electrical', label: 'Electrical Services' },
  { href: '#about', label: 'About Us' },
  { href: '#contact', label: 'Contact' },
];

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label={`${business.name}, back to top`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#168BFF" strokeWidth="2" />
        <path d="M20 9v22M10.5 14.5l19 11M10.5 25.5l19-11" stroke="#8DDCFF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill="#168BFF" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[0.95rem] font-bold tracking-tight">Houston Cooling</span>
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-ice">&amp; Heating</span>
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? 'border-b border-white/10 bg-midnight/85 py-2.5 backdrop-blur-xl' : 'py-5'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-electric focus:px-4 focus:py-2">Skip to content</a>
      <nav className="wrap flex items-center justify-between gap-4" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-7 xl:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="whitespace-nowrap text-sm font-medium text-white/75 transition-colors hover:text-ice">{n.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={links.call} className="hidden items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-ice md:flex">
            <Phone className="h-4 w-4 text-electric" aria-hidden /> {business.phoneDisplay}
          </a>
          <a href="#contact" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">Schedule Service</a>
          <button onClick={() => setOpen((o) => !o)} className="rounded-full p-2 xl:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden xl:hidden">
            <ul className="wrap pb-6 pt-3">
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-3.5 text-lg font-semibold">{n.label}</a></li>
              ))}
              <li className="pt-5"><a href="#contact" onClick={() => setOpen(false)} className="btn-primary w-full">Schedule Service</a></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Always-visible call and text bar on phones. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-white/10 bg-midnight/90 p-3 backdrop-blur-xl md:hidden">
      <a href={links.call} className="btn-primary !py-3"><Phone className="h-4 w-4" aria-hidden /> Call Now</a>
      <a href={links.text} className="btn-glass !py-3"><MessageSquare className="h-4 w-4" aria-hidden /> Text Us</a>
    </div>
  );
}
