import { Suspense, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import { business, links } from '../config/business';
import { LazyHomeScene, SceneBoundary, hasWebGL, prefersLite } from '../three/support';
import { useInView, useIsMobile, usePrefersReducedMotion } from '../lib/useMedia';

const ease = [0.22, 1, 0.36, 1] as const;
const POSTER = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=70&auto=format&fit=crop';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, '0px', true);
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [use3d] = useState(() => hasWebGL() && !prefersLite());

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden" aria-label="Introduction">
      {/* Poster shows instantly and remains as the fallback when 3D is unavailable */}
      <img src={POSTER} alt="" className={`absolute inset-0 h-full w-full object-cover ${use3d ? 'opacity-20' : 'opacity-50'}`} />
      {use3d && (
        <div className="absolute inset-0">
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <motion.div className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.3 }}>
                <LazyHomeScene mode="hero" lowPower={isMobile} reducedMotion={reduced} paused={!visible} />
              </motion.div>
            </Suspense>
          </SceneBoundary>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-midnight via-midnight/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-midnight to-transparent" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-electric/20 blur-[120px]" />

      <div className="wrap pointer-events-none relative flex h-full flex-col justify-center pb-20 pt-28">
        <div className="pointer-events-auto max-w-2xl">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="eyebrow">
            Houston's HVAC &amp; Electrical Service Experts
          </motion.p>
          <h1 className="mt-5 text-[2.9rem] font-extrabold leading-[0.98] tracking-tight sm:text-7xl lg:text-[5.4rem]">
            <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease }}>Comfort Engineered.</motion.span>
            <motion.span className="block bg-gradient-to-r from-electric to-ice bg-clip-text text-transparent" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.25, ease }}>Power Delivered.</motion.span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease }} className="mt-6 max-w-xl text-lg leading-relaxed text-silver/85">
            Premium heating, cooling, and electrical solutions designed to keep your Houston home comfortable, safe, and running efficiently.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={links.call} className="btn-primary !py-4 text-base"><Phone className="h-5 w-5" aria-hidden /> Call Now: {business.phoneDisplay}</a>
            <a href="#hvac" className="btn-glass !py-4 text-base">Explore Our Services</a>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-silver backdrop-blur">
            <MapPin className="h-4 w-4 text-ice" aria-hidden /> Proudly Serving Houston &amp; Surrounding Areas
          </motion.p>
        </div>
      </div>

      <a href="#hvac" className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/50 hover:text-ice md:bottom-8 md:flex" aria-label="Scroll to services">
        Scroll
        <span className="relative h-10 w-[2px] overflow-hidden rounded bg-white/15"><span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-ice" /></span>
      </a>
    </section>
  );
}
