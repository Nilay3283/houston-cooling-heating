import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Home, MessageCircle, MapPin, Phone, Wrench, Zap } from 'lucide-react';
import { business, links } from '../config/business';

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } as const;

function Heading({ eyebrow, title, intro, id, center = false }: { eyebrow: string; title: string; intro?: string; id: string; center?: boolean }) {
  return (
    <motion.div {...reveal} className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="h2 mt-4">{title}</h2>
      {intro && <p className="mt-5 text-lg text-silver/75">{intro}</p>}
    </motion.div>
  );
}

/* ------------------------------ Why choose us ----------------------------- */
const FEATURES = [
  { Icon: Phone, title: 'Responsive Service', text: 'Get in touch to discuss your HVAC or electrical needs.' },
  { Icon: Home, title: 'Residential Comfort', text: "Solutions focused on keeping your home comfortable throughout Houston's changing weather." },
  { Icon: Zap, title: 'HVAC & Electrical Expertise', text: 'One business for a range of heating, cooling, and electrical service needs.' },
  { Icon: MessageCircle, title: 'Clear Communication', text: 'Straightforward communication about your project, recommended work, and next steps.' },
];

export function WhyUs() {
  return (
    <section id="about" className="scroll-mt-20 border-y border-white/10 bg-gradient-to-b from-midnight-2 to-midnight py-24 sm:py-32" aria-labelledby="why-title">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <Heading id="why-title" eyebrow="Why choose Houston Cooling & Heating?" title="Comfort You Can Count On" />
          <motion.p {...reveal} className="mt-6 max-w-md leading-relaxed text-silver/75">
            {business.name} provides heating, cooling and electrical services for homes in Houston and surrounding communities, from AC repair and maintenance to 240V outlets and EV charger installations.
          </motion.p>
          <motion.a {...reveal} href={links.call} className="btn-primary mt-8"><Phone className="h-4 w-4" aria-hidden /> {business.phoneDisplay}</motion.a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map(({ Icon, title, text }, i) => (
            <motion.div key={title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="card group p-7 transition-colors hover:border-ice/30">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/15 text-ice transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver/70">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Gallery -------------------------------- */
const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;

/**
 * GALLERY: these are illustrative stock photos (labelled on the site).
 * Replace with real company job photos by putting files in /public/work
 * and setting { src: '/work/coil-cleaning.jpg', isStock: false }.
 */
const GALLERY = [
  { src: img('1718203862467-c33159fdc504'), alt: 'Outdoor AC condenser unit mounted outside a brick building', caption: 'Outdoor AC condenser', isStock: true, tall: true },
  { src: img('1758101755915-462eddc23f57'), alt: 'Technician testing an electrical panel with a multimeter', caption: 'Electrical panel testing', isStock: true },
  { src: img('1770625467384-304e461ef1be'), alt: 'Hand adjusting a modern digital thermostat on a wall', caption: 'Thermostat and system checks', isStock: true },
  { src: img('1694675879520-ff32d348fb7f'), alt: 'Residential cooling equipment on the side of a building', caption: 'Residential cooling equipment', isStock: true, tall: true },
  { src: img('1593941707882-a5bba14938c7'), alt: 'Electric vehicle plugged into a charging station', caption: 'EV charging', isStock: true },
  { src: img('1635335874521-7987db781153'), alt: 'Close-up of electrical panel wiring and breakers', caption: 'Electrical panels', isStock: true },
  { src: img('1621905251189-08b45d6a269e'), alt: 'Electrician installing wiring in a hard hat', caption: 'Electrical installation', isStock: true },
  { src: img('1698479603408-1a66a6d9e80f'), alt: 'Row of outdoor air conditioning units', caption: 'HVAC installation', isStock: true, tall: true },
];

export function Gallery() {
  const hasRealWork = GALLERY.some((g) => !g.isStock);
  return (
    <section className="py-24 sm:py-32" aria-labelledby="gallery-title">
      <div className="wrap">
        <Heading id="gallery-title" eyebrow="Recent work & project gallery" title="Heating, Cooling & Electrical in Focus" intro="A look at the kinds of equipment and projects we help Houston homeowners with." />
        {!hasRealWork && (
          <p className="mt-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-silver/80">Photos shown are illustrative stock images, not completed company projects. Project photos coming soon.</p>
        )}
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALLERY.map((g, i) => (
            <motion.figure key={g.src} {...reveal} transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }} className="group relative mb-4 overflow-hidden rounded-3xl border border-white/10">
              <img src={g.src} alt={g.alt} loading="lazy" decoding="async" className={`w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-105 ${g.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/85 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-5">
                <span className="font-semibold">{g.caption}</span>
                {g.isStock && <span className="rounded-full bg-white/15 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider backdrop-blur">Illustrative photo</span>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Service area ------------------------------ */
export function ServiceArea() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-midnight-2 py-24 sm:py-32" aria-labelledby="area-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Heading id="area-title" eyebrow="Service area" title="Local HVAC & Electrical Services Across Houston" />
          <motion.p {...reveal} className="mt-6 max-w-lg text-lg leading-relaxed text-silver/75">
            {business.name} serves Houston and surrounding communities. Contact us to confirm service availability for your address.
          </motion.p>
          <motion.div {...reveal} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="btn-primary">Check Service Availability</a>
            <a href={links.call} className="btn-glass"><Phone className="h-4 w-4" aria-hidden /> {business.phoneDisplay}</a>
          </motion.div>
        </div>
        {/* Map-inspired illustration; not a live map */}
        <motion.div {...reveal} className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-midnight" role="img" aria-label="Stylized map illustration with Houston marked at the center">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="rgba(141,220,255,0.07)" /></pattern>
              <radialGradient id="pulse"><stop offset="0" stopColor="#168BFF" stopOpacity="0.35" /><stop offset="1" stopColor="#168BFF" stopOpacity="0" /></radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#grid)" />
            <circle cx="200" cy="200" r="190" fill="url(#pulse)" />
            {/* Stylized loop freeways and radial roads */}
            <circle cx="200" cy="200" r="58" fill="none" stroke="rgba(220,229,239,0.25)" strokeWidth="3" />
            <circle cx="200" cy="200" r="118" fill="none" stroke="rgba(220,229,239,0.16)" strokeWidth="3" />
            <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(220,229,239,0.1)" strokeWidth="3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="200" y1="200" x2={200 + Math.cos((a * Math.PI) / 180) * 200} y2={200 + Math.sin((a * Math.PI) / 180) * 200} stroke="rgba(220,229,239,0.12)" strokeWidth="2" />
            ))}
            <path d="M-10 250 C 80 240, 140 300, 230 280 S 360 300, 410 260" stroke="rgba(22,139,255,0.35)" strokeWidth="6" fill="none" />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="relative mx-auto flex h-6 w-6 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-electric/50" />
              <MapPin className="relative h-6 w-6 text-ice" aria-hidden />
            </span>
            <p className="mt-3 text-2xl font-bold">Houston</p>
            <p className="text-xs uppercase tracking-[0.25em] text-silver/60">&amp; surrounding communities</p>
          </div>
          <p className="absolute bottom-3 left-0 right-0 text-center text-[0.65rem] text-silver/40">Illustration only. Call to confirm your address.</p>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------- Reviews -------------------------------- */
/** Add genuine, authorized reviews here: { name, text, rating } */
const REVIEWS: { name: string; text: string; rating?: number }[] = [];

export function Reviews() {
  return (
    <section className="py-24 sm:py-32" aria-labelledby="reviews-title">
      <div className="wrap">
        <Heading center id="reviews-title" eyebrow="Customer reviews" title="What Houston Homeowners Say" />
        {REVIEWS.length ? (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="card p-7">
                {r.rating && <p className="text-ice" aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}</p>}
                <blockquote className="mt-3 leading-relaxed text-silver">{r.text}</blockquote>
                <figcaption className="mt-4 font-semibold">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <motion.div {...reveal} className="card mx-auto mt-12 max-w-2xl p-10 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-ice" aria-hidden />
            <p className="mt-5 text-xl font-semibold">Worked with us recently?</p>
            <p className="mx-auto mt-3 max-w-md text-silver/75">We'd love to hear about your experience. Share your feedback with us directly and help other Houston homeowners.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={links.text} className="btn-primary">Text Your Feedback</a>
              <a href={`${links.email}?subject=${encodeURIComponent('My feedback for Houston Cooling & Heating')}`} className="btn-glass">Email Your Feedback</a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ ---------------------------------- */
const FAQ = [
  { q: 'Why is my AC running but not cooling?', a: 'Common causes include a dirty air filter, a dirty outdoor coil, thermostat settings, airflow restrictions, refrigerant issues, or an electrical problem with the outdoor unit. The exact cause can only be confirmed with an inspection, so contact us to have your system checked.' },
  { q: 'How often should I schedule HVAC maintenance?', a: "Many manufacturers recommend professional maintenance at least once a year. With Houston's long cooling season, many homeowners schedule a check before summer. Your equipment's manual is the best guide for your specific system." },
  { q: 'Can you clean an outdoor AC coil?', a: 'Yes. Outdoor coil cleaning is one of our maintenance services. A clean coil helps your system release heat and run as designed.' },
  { q: 'Do you provide heating and AC installation?', a: 'Yes. We help with heating system service, AC replacement and HVAC installations. Contact us to discuss your home and request an estimate.' },
  { q: 'Do you install 240V outlets and EV chargers?', a: "Yes. We help with 240V outlet installation and EV charger installations. Your electrical panel's capacity is part of planning, so reach out to discuss your project." },
  { q: 'Which Houston-area neighborhoods do you serve?', a: 'We serve Houston and surrounding communities. Please call, text or send a request with your address so we can confirm availability.' },
  { q: 'How can I request an estimate?', a: 'Use the service request form below, call or text (346) 535-2585, or send an email. Tell us a little about your system or project and the best way to reach you.' },
  { q: 'How do I contact Houston Cooling & Heating?', a: 'Call or text (346) 535-2585, email Alanmav0411@gmail.com, or use the form on this page.' },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <section className="border-t border-white/10 bg-midnight-2 py-24 sm:py-32" aria-labelledby="faq-title">
      <div className="wrap max-w-4xl">
        <Heading center id="faq-title" eyebrow="FAQ" title="Questions Homeowners Ask" />
        <div className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-midnight">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    id={`${uid}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold transition-colors hover:text-ice sm:text-lg"
                  >
                    {f.q}
                    <ChevronDown className={`h-5 w-5 shrink-0 text-ice transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} hidden={!isOpen} className="px-6 pb-6 leading-relaxed text-silver/80">
                  {f.a}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-silver/60"><Wrench className="h-4 w-4" aria-hidden /> Answers are general guidance. Every system is different, and an inspection is the best way to know.</p>
      </div>
    </section>
  );
}
