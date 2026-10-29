import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { business, links } from '../config/business';
import { Logo } from './Nav';

export type LegalDoc = 'privacy' | 'terms' | null;

export function Footer({ onOpenLegal }: { onOpenLegal: (doc: LegalDoc) => void }) {
  const licenses = [business.licenses.hvac && `HVAC License: ${business.licenses.hvac}`, business.licenses.electrical && `Electrical License: ${business.licenses.electrical}`].filter(Boolean);
  return (
    <footer className="relative border-t border-white/10 bg-[#050e1b] pb-28 pt-16 md:pb-10">
      <div className="footer-line absolute inset-x-0 top-0 h-px overflow-hidden bg-electric/40" />
      <div className="wrap grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-silver/65">Heating, cooling and electrical services for homes in Houston and surrounding communities.</p>
          {licenses.length > 0 && <p className="mt-4 text-xs text-silver/50">{licenses.join(' · ')}</p>}
        </div>
        <FooterCol title="HVAC Services" items={['AC Repair & Troubleshooting', 'HVAC Maintenance', 'Outdoor Coil Cleaning', 'Heating & AC Installation']} href="#hvac" />
        <FooterCol title="Electrical Services" items={['Electrical Services', '240V Outlet Installation', 'EV Charger Installation']} href="#electrical" />
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-ice">Contact</h2>
          <ul className="space-y-3 text-sm text-silver/80">
            <li><a href={links.call} className="hover:text-ice">{business.phoneDisplay}</a></li>
            <li><a href={links.email} className="break-all hover:text-ice">{business.email}</a></li>
            <li>{business.location}</li>
            <li>Serving {business.serviceArea}</li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-silver/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
        <div className="flex gap-5">
          <button onClick={() => onOpenLegal('privacy')} className="hover:text-ice">Privacy Policy</button>
          <button onClick={() => onOpenLegal('terms')} className="hover:text-ice">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items, href }: { title: string; items: string[]; href: string }) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-ice">{title}</h2>
      <ul className="space-y-3 text-sm text-silver/80">
        {items.map((i) => <li key={i}><a href={href} className="hover:text-ice">{i}</a></li>)}
      </ul>
    </div>
  );
}

const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      `${business.name} collects the information you choose to share with us, such as your name, phone number, email address and details about your service request, when you call, text, email or use the request form on this website.`,
      'We use this information only to respond to your request, schedule service and communicate with you about your project. We do not sell your personal information.',
      'Requests submitted through the website form are delivered by a third-party form service (Formspree) to our business email. Basic, anonymous usage data may be collected by our hosting provider.',
      `To ask about or remove information you've shared with us, contact ${business.email} or ${business.phoneDisplay}.`,
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      `This website provides general information about the services offered by ${business.name}. Content is for informational purposes and is not a diagnosis of any specific equipment.`,
      'Submitting a request does not guarantee service availability, appointment times or pricing. Estimates and scheduling are confirmed directly with you.',
      'Photos marked as illustrative are stock images and do not depict completed company projects.',
      'We may update these terms from time to time. Contact us with any questions.',
    ],
  },
};

export function LegalDialog({ doc, onClose }: { doc: LegalDoc; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!doc) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus();
    };
  }, [doc, onClose]);
  if (!doc) return null;
  const d = LEGAL[doc];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div ref={ref} className="card relative max-h-[85vh] w-full max-w-2xl overflow-y-auto p-8">
        <button onClick={onClose} className="absolute right-4 top-4 p-1 text-white/60 hover:text-white" aria-label="Close"><X className="h-5 w-5" /></button>
        <h2 id="legal-title" className="text-2xl font-bold">{d.title}</h2>
        <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-silver/60">Template text: have it reviewed before relying on it.</p>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-silver/80">{d.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
      </div>
    </div>
  );
}
