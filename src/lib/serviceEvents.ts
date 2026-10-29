export const SERVICE_OPTIONS = [
  'AC repair & troubleshooting',
  'HVAC maintenance & coil cleaning',
  'Heating & AC installation',
  'Electrical services & EV chargers',
  'Not sure / other',
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

const EVENT = 'hch:select-service';

/** Lets service-card buttons preselect the matching option in the contact form. */
export function selectService(service: ServiceOption) {
  window.dispatchEvent(new CustomEvent<ServiceOption>(EVENT, { detail: service }));
}

export function onServiceSelected(fn: (s: ServiceOption) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<ServiceOption>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
