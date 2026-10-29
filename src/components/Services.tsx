import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { usePrefersReducedMotion } from '../lib/useMedia';
import { selectService, type ServiceOption } from '../lib/serviceEvents';

/* ------------------------------ Illustrations ----------------------------- */
const defs = (
  <defs>
    <linearGradient id="metal" x1="0" x2="1">
      <stop offset="0" stopColor="#8fa0b3" />
      <stop offset="0.5" stopColor="#e8eef5" />
      <stop offset="1" stopColor="#7d8ea2" />
    </linearGradient>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#dfe7f0" />
      <stop offset="1" stopColor="#a8b6c6" />
    </linearGradient>
    <radialGradient id="glow">
      <stop offset="0" stopColor="#168BFF" stopOpacity="0.55" />
      <stop offset="1" stopColor="#168BFF" stopOpacity="0" />
    </radialGradient>
  </defs>
);

function CondenserArt({ cleaning = false }: { cleaning?: boolean }) {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      {defs}
      <ellipse cx="160" cy="120" rx="130" ry="80" fill="url(#glow)" />
      {/* airflow */}
      {[0, 1, 2].map((i) => (
        <path key={i} className="airflow" d={`M${130 + i * 30} 62 C ${120 + i * 30} 40, ${150 + i * 30} 30, ${140 + i * 30} 8`} stroke="#8DDCFF" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      {/* pad */}
      <path d="M70 172 L160 192 L250 172 L160 152 Z" fill="#26313f" />
      {/* body: front + side faces */}
      <path d="M95 92 L160 108 L160 180 L95 164 Z" fill="url(#metal)" />
      <path d="M160 108 L225 92 L225 164 L160 180 Z" fill="#6f8094" />
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`f${i}`} x1={100 + i * 4.6} y1={96 + i * 1.15} x2={100 + i * 4.6} y2={166 + i * 1.15} stroke="#5d6d80" strokeWidth="1.2" opacity="0.7" />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`s${i}`} x1={165 + i * 4.6} y1={106 - i * 1.15} x2={165 + i * 4.6} y2={176 - i * 1.15} stroke="#4f5e70" strokeWidth="1.2" opacity="0.8" />
      ))}
      {/* top */}
      <path d="M95 92 L160 76 L225 92 L160 108 Z" fill="url(#top)" />
      <ellipse cx="160" cy="92" rx="44" ry="12" fill="#121a24" />
      <g className="fan-spin">
        {[0, 120, 240].map((r) => (
          <ellipse key={r} cx="160" cy="92" rx="34" ry="5" fill="#3a4757" transform={`rotate(${r} 160 92) scale(1 1)`} />
        ))}
      </g>
      <ellipse cx="160" cy="92" rx="44" ry="12" fill="none" stroke="#2b3644" strokeWidth="2" />
      <circle cx="160" cy="92" r="4" fill="#c9d4df" />
      {cleaning && (
        <g>
          {/* spray wand and water */}
          <path d="M18 140 L62 128" stroke="#c9d4df" strokeWidth="5" strokeLinecap="round" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} className="airflow" d={`M64 128 Q 80 ${120 + i * 6}, 98 ${118 + i * 12}`} stroke="#8DDCFF" strokeWidth="1.6" fill="none" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
          {[[118, 112], [124, 140], [112, 150]].map(([x, y], i) => (
            <path key={`sp${i}`} className="pulse-glow" d={`M${x} ${y - 6} L${x + 2} ${y} L${x} ${y + 6} L${x - 2} ${y} Z M${x - 6} ${y} L${x} ${y + 2} L${x + 6} ${y} L${x} ${y - 2} Z`} fill="#ffffff" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}

function HouseCutawayArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      {defs}
      <ellipse cx="160" cy="120" rx="140" ry="80" fill="url(#glow)" />
      <path d="M50 92 L160 30 L270 92" fill="none" stroke="#DCE5EF" strokeWidth="3" strokeLinejoin="round" />
      <rect x="64" y="92" width="192" height="92" rx="4" fill="#0C1D35" stroke="#DCE5EF" strokeWidth="2.5" />
      <line x1="160" y1="92" x2="160" y2="184" stroke="#DCE5EF" strokeOpacity="0.3" strokeWidth="2" />
      <line x1="64" y1="140" x2="256" y2="140" stroke="#DCE5EF" strokeOpacity="0.3" strokeWidth="2" />
      {/* attic air handler and duct */}
      <rect x="138" y="62" width="44" height="22" rx="3" fill="url(#metal)" />
      <path d="M182 73 H 236 V 100 M138 73 H 84 V 100" stroke="#8fa0b3" strokeWidth="6" fill="none" strokeLinejoin="round" />
      {/* vents + airflow into rooms */}
      {[84, 236].map((x, i) => (
        <g key={x}>
          <rect x={x - 12} y="98" width="24" height="5" rx="1.5" fill="#DCE5EF" />
          {[0, 1, 2].map((k) => (
            <path key={k} className="airflow" d={`M${x - 8 + k * 8} 106 q -4 10 0 20 t 0 20`} stroke="#8DDCFF" strokeWidth="2" fill="none" style={{ animationDelay: `${(i + k) * 0.25}s` }} />
          ))}
        </g>
      ))}
      {/* thermostat and warm window */}
      <rect x="190" y="152" width="14" height="18" rx="3" fill="#DCE5EF" />
      <circle cx="197" cy="161" r="4" fill="#168BFF" className="pulse-glow" />
      <rect x="96" y="150" width="34" height="24" rx="2" fill="#FFB86B" opacity="0.55" />
    </svg>
  );
}

function ElectricalArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      {defs}
      <ellipse cx="160" cy="120" rx="140" ry="80" fill="url(#glow)" />
      {/* panel */}
      <rect x="54" y="28" width="96" height="150" rx="8" fill="url(#metal)" />
      <rect x="64" y="40" width="76" height="126" rx="4" fill="#121a24" />
      {Array.from({ length: 8 }).map((_, r) => [0, 1].map((c) => (
        <g key={`${r}${c}`}>
          <rect x={70 + c * 36} y={48 + r * 14} width="28" height="9" rx="2" fill="#2b3644" />
          <rect x={c ? 70 + c * 36 + 16 : 70 + c * 36 + 3} y={50 + r * 14} width="9" height="5" rx="1" fill={r === 2 && c === 1 ? '#168BFF' : '#c9d4df'} className={r === 2 && c === 1 ? 'pulse-glow' : ''} />
        </g>
      )))}
      {/* cable to charger */}
      <path d="M150 150 C 190 150, 190 120, 222 120" className="airflow" stroke="#168BFF" strokeWidth="3" fill="none" />
      {/* EV charger */}
      <rect x="222" y="60" width="54" height="112" rx="14" fill="#DCE5EF" />
      <rect x="232" y="74" width="34" height="22" rx="5" fill="#0C1D35" />
      <path d="M252 78 L244 88 H250 L246 94 L256 84 H250 Z" fill="#8DDCFF" className="pulse-glow" />
      <circle cx="249" cy="124" r="13" fill="none" stroke="#168BFF" strokeWidth="4" className="pulse-glow" />
      <path d="M262 136 C 290 150, 286 178, 260 182" stroke="#2b3644" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------------- Cards --------------------------------- */
interface ServiceCardData {
  id?: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
  service: ServiceOption;
  art: ReactNode;
}

const SERVICES: ServiceCardData[] = [
  {
    title: 'AC Repair & Troubleshooting',
    description: 'AC not cooling, warm air, unusual noises, or system problems? Get help diagnosing and resolving your cooling issues.',
    features: ['AC diagnostics', 'Cooling performance issues', 'Refrigerant service when appropriate', 'System troubleshooting'],
    cta: 'Request AC Repair', service: 'AC repair & troubleshooting', art: <CondenserArt />,
  },
  {
    title: 'HVAC Maintenance & Coil Cleaning',
    description: 'Keep your cooling system running efficiently with maintenance and cleaning services tailored to your equipment.',
    features: ['Outdoor coil cleaning', 'System performance checks', 'Preventive maintenance', 'Cooling system care'],
    cta: 'Book Maintenance', service: 'HVAC maintenance & coil cleaning', art: <CondenserArt cleaning />,
  },
  {
    title: 'Heating & AC Installation',
    description: "Explore heating and cooling solutions for your home's comfort needs, from equipment replacement to new installations.",
    features: ['Heating system service', 'AC replacement', 'HVAC installations', 'Home comfort solutions'],
    cta: 'Request an Estimate', service: 'Heating & AC installation', art: <HouseCutawayArt />,
  },
  {
    id: 'electrical',
    title: 'Electrical Services & EV Chargers',
    description: 'Get help with residential electrical projects, 240V outlets, and EV charger installations.',
    features: ['Electrical services', '240V outlet installation', 'EV charging solutions', 'Electrical project inquiries'],
    cta: 'Request Electrical Service', service: 'Electrical services & EV chargers', art: <ElectricalArt />,
  },
];

function TiltCard({ children, id, index }: { children: ReactNode; id?: string; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-6px)`;
  };
  const reset = () => ref.current && (ref.current.style.transform = '');
  return (
    <motion.article
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-28"
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="card group flex h-full flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-500 ease-soft hover:border-ice/30 hover:shadow-glow"
      >
        {children}
      </div>
    </motion.article>
  );
}

export function Services() {
  return (
    <section id="hvac" className="relative scroll-mt-20 py-24 sm:py-32" aria-labelledby="services-title">
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-electric/10 blur-[140px]" />
      <div className="wrap relative">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-3xl">
          <p className="eyebrow">Our services</p>
          <h2 id="services-title" className="h2 mt-4">Complete Home Comfort &amp; Electrical Solutions</h2>
          <p className="mt-5 text-lg text-silver/75">From emergency cooling problems to new electrical installations, get professional service for your home.</p>
        </motion.div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <TiltCard key={s.title} id={s.id} index={i}>
              <div className="relative h-52 bg-gradient-to-b from-midnight-3/80 to-transparent px-6 pt-4 sm:h-60">{s.art}</div>
              <div className="flex flex-1 flex-col p-7 pt-2">
                <h3 className="text-2xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-silver/75">{s.description}</p>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-silver"><Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden />{f}</li>
                  ))}
                </ul>
                <a href="#contact" onClick={() => selectService(s.service)} className="btn-glass mt-7 self-start group-hover:border-electric group-hover:bg-electric">
                  {s.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
