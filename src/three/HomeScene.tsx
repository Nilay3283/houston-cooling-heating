import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { HOTSPOTS, type HotspotId, type Vec3 } from './hotspots';

export interface HomeSceneProps {
  mode: 'hero' | 'explore';
  activeHotspot?: HotspotId | null;
  onHotspot?: (id: HotspotId) => void;
  focus?: { camera: Vec3; target: Vec3 } | null;
  lowPower?: boolean;
  reducedMotion?: boolean;
  paused?: boolean;
}

/* ------------------------------- Materials ------------------------------- */
function useMaterials() {
  const m = useMemo(() => {
    const std = (color: string, o: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...o });
    return {
      plaster: std('#e8edf2', { roughness: 0.85 }),
      cladding: std('#1b2636', { roughness: 0.55 }),
      slab: std('#f2f5f8', { roughness: 0.5 }),
      stone: std('#8a929c', { roughness: 0.9 }),
      concrete: std('#3a4350', { roughness: 0.95 }),
      lawn: std('#0f2418', { roughness: 1 }),
      wood: std('#b88a5a', { roughness: 0.6 }),
      metal: std('#c9d4df', { roughness: 0.32, metalness: 0.75 }),
      darkMetal: std('#2a323d', { roughness: 0.4, metalness: 0.6 }),
      fin: std('#aab6c3', { roughness: 0.3, metalness: 0.85 }),
      grille: std('#11161d', { roughness: 0.5, metalness: 0.5 }),
      glass: new THREE.MeshPhysicalMaterial({ color: '#ffd29a', emissive: '#ff9f45', emissiveIntensity: 0.35, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.42 }),
      glassUpper: new THREE.MeshPhysicalMaterial({ color: '#ffd8a8', emissive: '#ffae5c', emissiveIntensity: 0.55, roughness: 0.08, transparent: true, opacity: 0.7 }),
      garage: std('#2b3440', { roughness: 0.5, metalness: 0.3 }),
      car: std('#d8dee6', { roughness: 0.25, metalness: 0.8 }),
      tire: std('#0b0d10', { roughness: 0.9 }),
      blueGlow: new THREE.MeshStandardMaterial({ color: '#8DDCFF', emissive: '#168BFF', emissiveIntensity: 2.2 }),
      warmGlow: new THREE.MeshStandardMaterial({ color: '#ffd9a8', emissive: '#ffb86b', emissiveIntensity: 2.5 }),
      white: std('#f4f7fa', { roughness: 0.4 }),
      sofa: std('#c7ccd3', { roughness: 0.95 }),
      foliage: std('#163423', { roughness: 1, flatShading: true }),
      trunk: std('#3d2f22', { roughness: 1 }),
    };
  }, []);
  useEffect(() => () => Object.values(m).forEach((x) => x.dispose()), [m]);
  return m;
}
type Mats = ReturnType<typeof useMaterials>;

function Box({ args, position, material, rotation }: { args: [number, number, number]; position: Vec3; material: THREE.Material; rotation?: Vec3 }) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow receiveShadow>
      <boxGeometry args={args} />
    </mesh>
  );
}

/** Soft radial dot texture shared by airflow particles and mist sprites. */
function useDotTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.45)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

/* ------------------------------- Condenser ------------------------------- */
const CONDENSER_POS: Vec3 = [5.1, 0, 2.4];

function Condenser({ m, animate }: { m: Mats; animate: boolean }) {
  const fan = useRef<THREE.Group>(null);
  const fins = useRef<THREE.InstancedMesh>(null);
  const W = 1.15;
  const H = 1.05;
  const finPerSide = 26;

  useLayoutEffect(() => {
    const mesh = fins.current;
    if (!mesh) return;
    const d = new THREE.Object3D();
    let i = 0;
    for (let side = 0; side < 4; side++) {
      for (let k = 0; k < finPerSide; k++) {
        const t = -W / 2 + 0.06 + (k / (finPerSide - 1)) * (W - 0.12);
        const off = W / 2 + 0.012;
        const pos: Vec3 = side === 0 ? [t, 0, off] : side === 1 ? [t, 0, -off] : side === 2 ? [off, 0, t] : [-off, 0, t];
        d.position.set(pos[0], H / 2 + 0.12, pos[2]);
        d.rotation.set(0, side < 2 ? 0 : Math.PI / 2, 0);
        d.updateMatrix();
        mesh.setMatrixAt(i++, d.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, dt) => {
    if (animate && fan.current) fan.current.rotation.y += dt * 9;
  });

  return (
    <group position={CONDENSER_POS} rotation={[0, -0.35, 0]}>
      <Box args={[1.6, 0.12, 1.6]} position={[0, 0.06, 0]} material={m.concrete} />
      {/* Cabinet frame */}
      <Box args={[W, H, W]} position={[0, H / 2 + 0.12, 0]} material={m.grille} />
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
        <Box key={`${sx}${sz}`} args={[0.07, H + 0.02, 0.07]} position={[(sx * W) / 2, H / 2 + 0.12, (sz * W) / 2]} material={m.metal} />
      )))}
      <instancedMesh ref={fins} args={[undefined, undefined, finPerSide * 4]} material={m.fin} castShadow>
        <boxGeometry args={[0.012, H - 0.12, 0.02]} />
      </instancedMesh>
      {/* Top cap and fan guard */}
      <Box args={[W + 0.06, 0.06, W + 0.06]} position={[0, H + 0.15, 0]} material={m.metal} />
      <mesh position={[0, H + 0.19, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.darkMetal}>
        <torusGeometry args={[0.44, 0.025, 8, 40]} />
      </mesh>
      {[0.32, 0.2].map((r) => (
        <mesh key={r} position={[0, H + 0.19, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.darkMetal}>
          <torusGeometry args={[r, 0.008, 6, 32]} />
        </mesh>
      ))}
      <group ref={fan} position={[0, H + 0.13, 0]}>
        {[0, 1, 2].map((k) => (
          <mesh key={k} rotation={[0.35, (k * Math.PI * 2) / 3, 0]} position={[Math.cos((k * Math.PI * 2) / 3) * 0.18, 0, -Math.sin((k * Math.PI * 2) / 3) * 0.18]} material={m.darkMetal}>
            <boxGeometry args={[0.34, 0.012, 0.13]} />
          </mesh>
        ))}
        <mesh material={m.metal}><cylinderGeometry args={[0.06, 0.06, 0.05, 16]} /></mesh>
      </group>
      {/* Service panel and line set */}
      <Box args={[0.3, 0.42, 0.02]} position={[0.32, 0.62, W / 2 + 0.03]} material={m.metal} />
      <mesh position={[-0.9, 0.4, -0.2]} rotation={[0, 0, Math.PI / 2]} material={m.darkMetal}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
      </mesh>
      <pointLight position={[0, 1.2, 0.6]} color="#168BFF" intensity={4} distance={4} />
    </group>
  );
}

/** Blue airflow particles rising and swirling from the condenser fan. */
function Airflow({ texture, animate, count = 420 }: { texture: THREE.Texture; animate: boolean; count?: number }) {
  const points = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3); // angle, radius, speed
    for (let i = 0; i < count; i++) {
      seed[i * 3] = Math.random() * Math.PI * 2;
      seed[i * 3 + 1] = 0.15 + Math.random() * 0.35;
      seed[i * 3 + 2] = 0.6 + Math.random() * 0.9;
      pos[i * 3 + 1] = Math.random() * 2.3; // start at random heights
    }
    return { pos, seed };
  }, [count]);

  useFrame((_, dt) => {
    const p = points.current;
    if (!p) return;
    const arr = p.geometry.attributes.position.array as Float32Array;
    const step = animate ? Math.min(dt, 0.05) : 0;
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] + data.seed[i * 3 + 2] * step;
      if (y > 2.3) y = 0;
      const a = (data.seed[i * 3] += step * 1.4);
      const r = data.seed[i * 3 + 1] * (1 + y * 0.55);
      arr[i * 3] = CONDENSER_POS[0] + Math.cos(a) * r;
      arr[i * 3 + 1] = y + 1.3;
      arr[i * 3 + 2] = CONDENSER_POS[2] + Math.sin(a) * r;
    }
    p.geometry.attributes.position.needsUpdate = true;
    (p.material as THREE.PointsMaterial).opacity = 0.75;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial map={texture} color="#8DDCFF" size={0.075} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/** Drifting icy mist around the base of the condenser. */
function Mist({ texture, animate }: { texture: THREE.Texture; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const puffs = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * Math.PI * 2, r: 0.7 + (i % 3) * 0.3, s: 1.4 + (i % 2) * 0.8 })), []);
  useFrame(({ clock }) => {
    if (!group.current || !animate) return;
    group.current.children.forEach((c, i) => {
      const p = puffs[i];
      const t = clock.elapsedTime * 0.25 + p.a;
      c.position.set(CONDENSER_POS[0] + Math.cos(t) * p.r, 0.35 + Math.sin(t * 1.7) * 0.12, CONDENSER_POS[2] + Math.sin(t) * p.r);
    });
  });
  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <sprite key={i} scale={[p.s, p.s * 0.6, 1]} position={[CONDENSER_POS[0] + Math.cos(p.a) * p.r, 0.35, CONDENSER_POS[2] + Math.sin(p.a) * p.r]}>
          <spriteMaterial map={texture} color="#8DDCFF" transparent opacity={0.13} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
}

/* --------------------------------- House --------------------------------- */
function Tree({ position, scale = 1, m }: { position: Vec3; scale?: number; m: Mats }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} material={m.trunk} castShadow><cylinderGeometry args={[0.1, 0.16, 2, 6]} /></mesh>
      <mesh position={[0, 2.6, 0]} material={m.foliage} castShadow><icosahedronGeometry args={[1.25, 0]} /></mesh>
      <mesh position={[0.5, 2.2, 0.3]} material={m.foliage} castShadow><icosahedronGeometry args={[0.8, 0]} /></mesh>
    </group>
  );
}

function House({ m }: { m: Mats }) {
  return (
    <group>
      {/* Grounds */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={m.lawn} receiveShadow>
        <circleGeometry args={[34, 64]} />
      </mesh>
      <Box args={[16, 0.2, 9]} position={[-1.5, 0.1, -1]} material={m.stone} />
      <Box args={[4.4, 0.06, 7]} position={[-8, 0.03, 5.5]} material={m.concrete} />
      <Box args={[1.6, 0.06, 6]} position={[0, 0.03, 6]} material={m.stone} />

      {/* Lower glass living volume */}
      <Box args={[9, 0.12, 6]} position={[-1, 0.26, -1]} material={m.wood} />
      <Box args={[8.6, 2.9, 0.05]} position={[-1, 1.75, 1.98]} material={m.glass} />
      <Box args={[0.05, 2.9, 5.6]} position={[3.48, 1.75, -1.2]} material={m.glass} />
      <Box args={[9, 3, 0.25]} position={[-1, 1.7, -3.9]} material={m.plaster} />
      <Box args={[0.3, 3, 6]} position={[-5.35, 1.7, -1]} material={m.plaster} />
      {[-4.2, -1, 2.2].map((x) => <Box key={x} args={[0.1, 2.9, 0.1]} position={[x, 1.75, 2]} material={m.darkMetal} />)}
      {/* Interior: sofa, ceiling vent, thermostat */}
      <Box args={[2.6, 0.45, 0.9]} position={[-1.5, 0.55, -2.6]} material={m.sofa} />
      <Box args={[2.6, 0.5, 0.25]} position={[-1.5, 0.95, -3]} material={m.sofa} />
      <Box args={[3.2, 0.04, 0.22]} position={[0, 3.12, 0.4]} material={m.grille} />
      <Box args={[0.22, 0.3, 0.05]} position={[-3.4, 1.7, -3.75]} material={m.white} />
      <Box args={[0.12, 0.08, 0.02]} position={[-3.4, 1.74, -3.72]} material={m.blueGlow} />
      <pointLight position={[-1, 2.6, -1]} color="#ffb86b" intensity={7} distance={9} />

      {/* Roof slab and upper volume */}
      <Box args={[10.4, 0.25, 7.2]} position={[-0.6, 3.3, -0.8]} material={m.slab} />
      <Box args={[7.5, 2.6, 5]} position={[0.8, 4.75, -1.5]} material={m.cladding} />
      <Box args={[6.6, 1.6, 0.05]} position={[1.1, 4.8, 1.03]} material={m.glassUpper} />
      <Box args={[8.6, 0.22, 6]} position={[0.8, 6.15, -1.4]} material={m.slab} />
      <Box args={[2.5, 0.04, 0.5]} position={[0.8, 6.28, -1.4]} material={m.warmGlow} />

      {/* Electrical panel on the side wall */}
      <Box args={[0.06, 0.8, 0.55]} position={[3.53, 1.3, -2.6]} material={m.darkMetal} />
      <Box args={[0.02, 0.06, 0.3]} position={[3.57, 1.55, -2.6]} material={m.blueGlow} />

      {/* Garage with EV charger */}
      <Box args={[4.2, 3, 6]} position={[-8, 1.7, -1]} material={m.plaster} />
      <Box args={[4.6, 0.2, 6.4]} position={[-8, 3.3, -1]} material={m.slab} />
      <Box args={[3.2, 2.3, 0.06]} position={[-8.2, 1.35, 2.02]} material={m.garage} />
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} args={[3.2, 0.02, 0.07]} position={[-8.2, 0.5 + i * 0.45, 2.05]} material={m.darkMetal} />
      ))}
      <Box args={[0.38, 0.6, 0.14]} position={[-6.35, 1.2, 2.08]} material={m.white} />
      <mesh position={[-6.35, 1.28, 2.16]} rotation={[Math.PI / 2, 0, 0]} material={m.blueGlow}>
        <torusGeometry args={[0.1, 0.018, 8, 24]} />
      </mesh>
      {/* Car on the driveway */}
      <group position={[-8, 0, 5.4]}>
        <Box args={[1.9, 0.6, 4.2]} position={[0, 0.55, 0]} material={m.car} />
        <Box args={[1.6, 0.55, 2.2]} position={[0, 1.1, -0.2]} material={m.glass} />
        {[-0.95, 0.95].flatMap((x) => [-1.35, 1.35].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]} material={m.tire}>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
          </mesh>
        )))}
      </group>

      {/* Landscape lighting and trees */}
      {[-3.5, -1, 1.5, 3.5].map((x) => (
        <group key={x} position={[x, 0, 3.1]}>
          <Box args={[0.08, 0.35, 0.08]} position={[0, 0.18, 0]} material={m.warmGlow} />
        </group>
      ))}
      <Tree position={[-12, 0, -4]} scale={1.3} m={m} />
      <Tree position={[8.5, 0, -4]} scale={1.15} m={m} />
      <Tree position={[9.5, 0, 4]} m={m} />
      <Tree position={[-13, 0, 4]} m={m} />
    </group>
  );
}

/* ------------------------------ Camera helpers ----------------------------- */
function HeroMotion({ children, animate }: { children: React.ReactNode; animate: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    const k = animate ? 1 : 0;
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, k * (Math.sin(t * 0.12) * 0.08 + pointer.x * 0.06), 0.05);
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, -scroll * 1.6 * k, 0.1);
  });
  return <group ref={g}>{children}</group>;
}

function CameraRig({ focus, controls }: { focus: HomeSceneProps['focus']; controls: React.RefObject<OrbitControlsImpl> }) {
  const { camera } = useThree();
  const goal = useRef<{ cam: THREE.Vector3; tgt: THREE.Vector3 } | null>(null);
  useEffect(() => {
    if (focus) goal.current = { cam: new THREE.Vector3(...focus.camera), tgt: new THREE.Vector3(...focus.target) };
  }, [focus]);
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const cancel = () => (goal.current = null);
    c.addEventListener('start', cancel);
    return () => c.removeEventListener('start', cancel);
  }, [controls]);
  useFrame((_, dt) => {
    const g = goal.current;
    const c = controls.current;
    if (!g || !c) return;
    const k = 1 - Math.pow(0.003, dt);
    camera.position.lerp(g.cam, k);
    c.target.lerp(g.tgt, k);
    c.update();
    if (camera.position.distanceTo(g.cam) < 0.04) goal.current = null;
  });
  return null;
}

function Hotspots({ active, onHotspot }: { active?: HotspotId | null; onHotspot?: (id: HotspotId) => void }) {
  return (
    <>
      {HOTSPOTS.map((h) => (
        <Html key={h.id} position={h.position} center zIndexRange={[30, 0]}>
          <button
            type="button"
            onClick={() => onHotspot?.(h.id)}
            aria-label={`Learn about the ${h.label.toLowerCase()}`}
            aria-pressed={active === h.id}
            className={`group relative flex h-9 w-9 items-center justify-center rounded-full border-2 backdrop-blur transition-all duration-300 ${active === h.id ? 'scale-110 border-white bg-electric' : 'border-ice/80 bg-midnight/60 hover:border-white'}`}
          >
            <span className="absolute inset-0 animate-ping rounded-full border border-ice/60 [animation-duration:2.2s]" />
            <span className="text-[0.7rem] font-bold text-white">{h.short}</span>
            <span className="pointer-events-none absolute left-11 whitespace-nowrap rounded-md bg-midnight/90 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{h.label}</span>
          </button>
        </Html>
      ))}
    </>
  );
}

/* --------------------------------- Scene --------------------------------- */
function Scene({ mode, activeHotspot, onHotspot, focus, lowPower, reducedMotion }: HomeSceneProps) {
  const m = useMaterials();
  const dot = useDotTexture();
  const controls = useRef<OrbitControlsImpl>(null);
  const animate = !reducedMotion;
  const hero = mode === 'hero';

  return (
    <>
      <color attach="background" args={['#071426']} />
      <fog attach="fog" args={['#071426', 22, 60]} />
      <hemisphereLight args={['#5c7fb8', '#0a0f18', 0.75]} />
      <directionalLight
        position={[-10, 16, 10]}
        intensity={1.1}
        color="#a9cbff"
        castShadow={!lowPower}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[12, 6, 8]} intensity={0.45} color="#ffcf9a" />
      <spotLight position={[0, 0.3, 4.5]} angle={0.7} penumbra={0.8} intensity={14} distance={10} color="#ffd2a1" target-position={[0, 3, 1]} />

      {hero ? (
        <HeroMotion animate={animate}>
          <House m={m} />
          <Condenser m={m} animate={animate} />
          <Airflow texture={dot} animate={animate} count={lowPower ? 220 : 420} />
          <Mist texture={dot} animate={animate} />
        </HeroMotion>
      ) : (
        <>
          <House m={m} />
          <Condenser m={m} animate={animate} />
          <Airflow texture={dot} animate={animate} count={lowPower ? 160 : 300} />
          <Mist texture={dot} animate={animate} />
          <Hotspots active={activeHotspot} onHotspot={onHotspot} />
        </>
      )}
      {!lowPower && <ContactShadows position={[0, 0.02, 0]} opacity={0.5} scale={40} blur={2.5} far={8} />}

      <OrbitControls
        ref={controls}
        makeDefault
        target={hero ? [-3.6, 2.4, 0] : [-1, 1.8, -0.5]}
        enableDamping
        dampingFactor={0.08}
        enableZoom={!hero}
        enablePan={false}
        enableRotate={hero ? !lowPower : true}
        minDistance={6}
        maxDistance={26}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={hero ? -0.2 : -Infinity}
        maxAzimuthAngle={hero ? 1.3 : Infinity}
      />
      {!hero && <CameraRig focus={focus} controls={controls} />}
    </>
  );
}

export default function HomeScene(props: HomeSceneProps) {
  const hero = props.mode === 'hero';
  return (
    <Canvas
      shadows={!props.lowPower}
      dpr={props.lowPower ? [1, 1.5] : [1, 2]}
      frameloop={props.paused ? 'never' : 'always'}
      camera={{ position: hero ? [12, 5, 15.5] : [12, 7, 14], fov: hero ? 34 : 40, near: 0.3, far: 120 }}
      gl={{ antialias: !props.lowPower, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      role="img"
      aria-label={hero ? '3D scene of a modern home at evening with an outdoor AC condenser and blue airflow' : 'Interactive 3D home showing its cooling, air distribution, thermostat, electrical panel and EV charger'}
    >
      <Scene {...props} />
    </Canvas>
  );
}
