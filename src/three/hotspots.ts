export type Vec3 = [number, number, number];
export type HotspotId = 'condenser' | 'vents' | 'thermostat' | 'panel' | 'ev';

export interface Hotspot {
  id: HotspotId;
  /** One or two characters shown inside the 3D marker. */
  short: string;
  label: string;
  system: string;
  description: string;
  position: Vec3;
  camera: Vec3;
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'condenser', short: '1', label: 'Outdoor condenser', system: 'Cooling system',
    description: 'The outdoor unit releases heat pulled from inside your home. Its coil and fan need clear airflow, which is why keeping the coil clean matters for cooling performance.',
    position: [5.1, 1.55, 2.4], camera: [10.5, 3.6, 8],
  },
  {
    id: 'vents', short: '2', label: 'Indoor vents', system: 'Air distribution',
    description: 'Supply vents and ductwork carry conditioned air to each room. Blocked or leaky ducts can leave some rooms warmer than others.',
    position: [0, 2.95, 0.4], camera: [1.5, 2.8, 8.5],
  },
  {
    id: 'thermostat', short: '3', label: 'Thermostat', system: 'Temperature control',
    description: 'The thermostat tells your heating and cooling equipment when to run. Settings, batteries and placement can all affect comfort.',
    position: [-3.4, 1.75, -3.6], camera: [-2.2, 2.4, 6.5],
  },
  {
    id: 'panel', short: '4', label: 'Electrical panel', system: 'Residential electrical system',
    description: 'The panel distributes power to your home\'s circuits, including dedicated circuits for HVAC equipment, 240V outlets and EV chargers.',
    position: [3.6, 1.35, -2.6], camera: [9.5, 2.6, -3.5],
  },
  {
    id: 'ev', short: '5', label: 'EV charger', system: 'Electric vehicle charging',
    description: 'A Level 2 home charger runs on a 240V circuit for faster charging than a standard outlet. Your panel capacity helps determine what is possible.',
    position: [-6.35, 1.3, 2.2], camera: [-5, 2.6, 8.5],
  },
];
