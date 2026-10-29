import { Suspense, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hand, RotateCcw, X } from 'lucide-react';
import { HOTSPOTS, type HotspotId } from '../three/hotspots';
import { LazyHomeScene, SceneBoundary, hasWebGL, prefersLite } from '../three/support';
import { useInView, useIsMobile, usePrefersReducedMotion } from '../lib/useMedia';

const DEFAULT_VIEW = { camera: [12, 7, 14] as [number, number, number], target: [-1, 1.8, -0.5] as [number, number, number] };

export function Technology() {
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, '300px');
  const visible = useInView(box, '100px', true);
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [use3d] = useState(() => hasWebGL() && !prefersLite());
  const [active, setActive] = useState<HotspotId | null>(null);
  const [focus, setFocus] = useState<typeof DEFAULT_VIEW | null>(null);
  const hotspot = HOTSPOTS.find((h) => h.id === active);

  const select = (id: HotspotId) => {
    const h = HOTSPOTS.find((x) => x.id === id)!;
    setActive(id);
    setFocus({ camera: h.camera, target: h.position });
  };
  const reset = () => {
    setActive(null);
    setFocus({ ...DEFAULT_VIEW });
  };

  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="tech-title">
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Interactive 3D home</p>
          <h2 id="tech-title" className="h2 mt-4">See the Technology Behind Your Comfort</h2>
          <p className="mt-5 text-lg text-silver/75">Explore the systems that keep a Houston home cool, comfortable and powered. Select a numbered marker or a button below to learn more.</p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div ref={box} className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-midnight-2 sm:aspect-[16/10]">
            {use3d && near ? (
              <SceneBoundary fallback={<StaticFallback />}>
                <Suspense fallback={<Loading />}>
                  <div className="absolute inset-0 touch-none">
                    <LazyHomeScene mode="explore" activeHotspot={active} onHotspot={select} focus={focus} lowPower={isMobile} reducedMotion={reduced} paused={!visible} />
                  </div>
                </Suspense>
              </SceneBoundary>
            ) : use3d ? (
              <Loading />
            ) : (
              <StaticFallback />
            )}
            {use3d && (
              <>
                <p className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-midnight/70 px-3 py-1.5 text-xs text-silver backdrop-blur">
                  <Hand className="h-3.5 w-3.5 text-ice" aria-hidden /> {isMobile ? 'Drag to rotate · pinch to zoom' : 'Drag to rotate · scroll to zoom'}
                </p>
                <button onClick={reset} className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-midnight/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:text-ice" aria-label="Reset 3D view">
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset view
                </button>
              </>
            )}
            <AnimatePresence>
              {hotspot && (
                <motion.div
                  key={hotspot.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  className="absolute inset-x-3 bottom-3 rounded-2xl border border-ice/20 bg-midnight/85 p-5 backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-sm"
                  role="status"
                  aria-live="polite"
                >
                  <button onClick={() => setActive(null)} className="absolute right-3 top-3 p-1 text-white/60 hover:text-white" aria-label="Close description"><X className="h-4 w-4" /></button>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice">{hotspot.system}</p>
                  <h3 className="mt-1 pr-6 text-xl font-bold">{hotspot.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-silver/85">{hotspot.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accessible text alternative and controls that work with or without 3D */}
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Home systems">
            {HOTSPOTS.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => select(h.id)}
                  aria-pressed={active === h.id}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${active === h.id ? 'border-electric bg-electric/15' : 'border-white/10 bg-white/[0.03] hover:border-ice/40'}`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active === h.id ? 'bg-electric' : 'bg-white/10'}`}>{h.short}</span>
                  <span>
                    <span className="block font-semibold">{h.label}</span>
                    <span className="block text-sm text-silver/65">{h.system}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Loading() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-electric" />
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-silver/60">Loading 3D home</span>
    </div>
  );
}

function StaticFallback() {
  return (
    <div className="absolute inset-0">
      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=70&auto=format&fit=crop" alt="Modern home at dusk" className="h-full w-full object-cover opacity-50" />
      <p className="absolute inset-x-4 bottom-4 rounded-xl bg-midnight/80 p-3 text-center text-sm text-silver backdrop-blur">The interactive 3D view isn't available on this device. Use the list to explore each system.</p>
    </div>
  );
}
