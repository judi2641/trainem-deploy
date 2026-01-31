import React from "react";

type PixelBackgroundProps = {
  count?: number; // Gesamtanzahl Pixel
  seed?: number;  // gleicher Look bei Reload
};

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pixel background with:
 * - clustering (top-left + bottom-right stronger)
 * - calmer center area (avoid covering the card)
 * - limited palette with meaning (green/gold/blue + rare violet)
 * - a few animated pixels
 */
export default function PixelBackground({ count = 240, seed = 24 }: PixelBackgroundProps) {
  const rand = React.useMemo(() => mulberry32(seed), [seed]);

  const palette = [
    { hex: "#10B981", w: 0.45 }, // emerald (progress)
    { hex: "#34D399", w: 0.18 }, // emerald light
    { hex: "#FBBF24", w: 0.16 }, // amber (milestone)
    { hex: "#38BDF8", w: 0.16 }, // sky (streak)
    { hex: "#A78BFA", w: 0.05 }, // violet (rare accent)
  ];

  function weightedColor() {
    const r = rand();
    let acc = 0;
    for (const c of palette) {
      acc += c.w;
      if (r <= acc) return c.hex;
    }
    return palette[0].hex;
  }

  // avoid area around the card (center-ish)
  function isInCalmZone(x: number, y: number) {
    // calm box roughly around center where the big card sits
    return x > 25 && x < 75 && y > 30 && y < 78;
  }

  const pixels = React.useMemo(() => {
    const result: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      opacity: number;
      border: string;
      animated: boolean;
      animDelay: number;
      animDuration: number;
    }> = [];

    const sizeOptions = [6, 8, 10, 12];

    // Helper to create clustered points
    function sampleCluster(cx: number, cy: number, spreadX: number, spreadY: number) {
      // gaussian-ish (Box-Muller light)
      const u = Math.max(1e-9, rand());
      const v = Math.max(1e-9, rand());
      const g = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); // ~N(0,1)
      const u2 = Math.max(1e-9, rand());
      const v2 = Math.max(1e-9, rand());
      const g2 = Math.sqrt(-2.0 * Math.log(u2)) * Math.cos(2.0 * Math.PI * v2);

      const x = cx + g * spreadX;
      const y = cy + g2 * spreadY;
      return { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) };
    }

    // We generate 70% clustered, 30% scattered (but avoid calm zone)
    const clustered = Math.round(count * 0.7);
    const scattered = count - clustered;

    // Cluster centers: top-left and bottom-right (strong), plus light top-right
    const clusters = [
      { cx: 12, cy: 18, sx: 10, sy: 10, share: 0.45 },
      { cx: 88, cy: 86, sx: 11, sy: 11, share: 0.40 },
      { cx: 88, cy: 18, sx: 8, sy: 8, share: 0.15 },
    ];

    // Build clustered pixels
    clusters.forEach((cl) => {
      const n = Math.round(clustered * cl.share);
      let tries = 0;
      for (let i = 0; i < n; i++) {
        // find a point not in calm zone
        let p = sampleCluster(cl.cx, cl.cy, cl.sx, cl.sy);
        while (isInCalmZone(p.x, p.y) && tries < 2000) {
          p = sampleCluster(cl.cx, cl.cy, cl.sx, cl.sy);
          tries++;
        }

        const size = sizeOptions[Math.floor(rand() * sizeOptions.length)];
        const color = weightedColor();
        const opacity = 0.25 + rand() * 0.6;
        const border = rand() < 0.25 ? "1px solid rgba(0,0,0,0.20)" : "none";

        const animated = rand() < 0.10; // 10% animated pixels
        const animDelay = rand() * 3;
        const animDuration = 4 + rand() * 5;

        result.push({ x: p.x, y: p.y, size, color, opacity, border, animated, animDelay, animDuration });
      }
    });

    // Build scattered pixels
    let tries = 0;
    for (let i = 0; i < scattered; i++) {
      let x = rand() * 100;
      let y = rand() * 100;

      while (isInCalmZone(x, y) && tries < 2000) {
        x = rand() * 100;
        y = rand() * 100;
        tries++;
      }

      const size = sizeOptions[Math.floor(rand() * sizeOptions.length)];
      const color = weightedColor();
      const opacity = 0.18 + rand() * 0.55;
      const border = rand() < 0.18 ? "1px solid rgba(0,0,0,0.18)" : "none";

      const animated = rand() < 0.06; // fewer animations outside clusters
      const animDelay = rand() * 3;
      const animDuration = 5 + rand() * 6;

      result.push({ x, y, size, color, opacity, border, animated, animDelay, animDuration });
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seed]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pixels.map((p, idx) => (
        <div
          key={idx}
          className={p.animated ? "pixel-float" : undefined}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            border: p.border,
            animationDelay: `${p.animDelay}s`,
            animationDuration: `${p.animDuration}s`,
          }}
        />
      ))}
    </div>
  );
}
