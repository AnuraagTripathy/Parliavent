"use client";

import { useMemo } from "react";

interface Seat {
  x: number;
  y: number;
  lit: boolean;
  delay: number;
}

/** Hemicycle seat chart — concentric arcs of seats, some lit and flickering. */
export function Hemicycle({ className }: { className?: string }) {
  const seats = useMemo<Seat[]>(() => {
    const rows = 7;
    const result: Seat[] = [];
    // Deterministic pseudo-random so SSR and client render match.
    let state = 41;
    const rand = () => {
      state = (state * 16807) % 2147483647;
      return state / 2147483647;
    };
    for (let r = 0; r < rows; r++) {
      const radius = 160 + r * 46;
      const count = 18 + r * 5;
      for (let i = 0; i <= count; i++) {
        const angle = Math.PI * (i / count);
        result.push({
          x: 500 - Math.cos(angle) * radius,
          y: 480 - Math.sin(angle) * radius,
          lit: rand() > 0.72,
          delay: rand() * 4.5,
        });
      }
    }
    return result;
  }, []);

  return (
    <svg
      viewBox="0 0 1000 500"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {seats.map((seat, i) => (
        <circle
          key={i}
          cx={seat.x}
          cy={seat.y}
          r={seat.lit ? 5 : 4}
          fill={seat.lit ? "#EC4E02" : "#57534e"}
          opacity={seat.lit ? 1 : 0.35}
          className={seat.lit ? "seat-lit" : undefined}
          style={seat.lit ? { animationDelay: `${seat.delay}s` } : undefined}
        />
      ))}
      {/* Speaker's chair */}
      <rect x="488" y="466" width="24" height="30" rx="4" fill="#EC4E02" />
      <rect x="493" y="450" width="14" height="18" rx="3" fill="#EC4E02" opacity="0.7" />
    </svg>
  );
}
