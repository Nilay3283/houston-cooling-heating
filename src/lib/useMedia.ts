import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');

/** Becomes true once the element is near the viewport (and stays true unless `keepInSync`). */
export function useInView<T extends Element>(ref: React.RefObject<T>, rootMargin = '200px', keepInSync = false) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    // Elements already on screen at mount load immediately rather than waiting for the observer.
    const margin = parseInt(rootMargin, 10) || 0;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight + margin && r.bottom > -margin) {
      setInView(true);
      if (!keepInSync) return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!keepInSync) io.disconnect();
        } else if (keepInSync) setInView(false);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, keepInSync]);
  return inView;
}
