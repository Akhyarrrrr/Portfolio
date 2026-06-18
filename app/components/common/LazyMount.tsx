"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type LazyMountProps = {
  children: ReactNode;
  id?: string;
  minHeight?: number;
};

export default function LazyMount({
  children,
  id,
  minHeight = 720,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setMounted(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div
      ref={ref}
      id={!mounted ? id : undefined}
      style={!mounted ? { minHeight } : undefined}
    >
      {mounted ? children : null}
    </div>
  );
}
