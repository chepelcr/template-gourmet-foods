import { useEffect, useState, type RefObject } from 'react';

/** The element's size in CSS pixels, kept current with a ResizeObserver. */
export function useBoxSize(ref: RefObject<Element>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}
