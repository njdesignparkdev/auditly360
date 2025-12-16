"use client";

import { useEffect, useState } from "react";

/**
 * Simple scroll threshold hook.
 * Returns true when window.scrollY exceeds the given offset.
 */
export function useScroll(offset: number = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > offset);
    };

    onScroll(); // set initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}

