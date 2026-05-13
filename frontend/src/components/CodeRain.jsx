import { useEffect, useRef } from "react";

/**
 * Lightweight canvas-based "code rain" / Matrix effect.
 * - Uses requestAnimationFrame, throttled.
 * - Respects prefers-reduced-motion.
 * - Renders behind content with low opacity so it never hurts readability.
 */
export default function CodeRain({ className = "", color = "rgba(34,211,238,", density = 22 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let columns = [];
    let width = 0;
    let height = 0;
    const fontSize = 14;
    const chars =
      "01<>{}[]()=+-*/;:_$#&|01ABCDEFアイウエオカキクケコサシスセソタチツテト";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      const colCount = Math.floor(width / density);
      columns = Array.from({ length: colCount }, () => ({
        y: Math.random() * -height,
        speed: 0.6 + Math.random() * 1.4,
        glyphs: Array.from({ length: 12 + Math.floor(Math.random() * 18) }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ),
      }));
    };

    let last = 0;
    const draw = (t) => {
      if (t - last < 60) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      last = t;
      // fade previous frame
      ctx.fillStyle = "rgba(7,17,31,0.18)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px "JetBrains Mono", "Source Code Pro", monospace`;
      ctx.textBaseline = "top";

      columns.forEach((col, i) => {
        const x = i * density;
        col.glyphs.forEach((ch, j) => {
          const cy = col.y + j * fontSize;
          if (cy < -fontSize || cy > height + fontSize) return;
          if (j === col.glyphs.length - 1) {
            // head - bright
            ctx.fillStyle = "rgba(186,230,253,0.85)";
          } else {
            const fade = 0.05 + (j / col.glyphs.length) * 0.45;
            ctx.fillStyle = `${color}${fade.toFixed(3)})`;
          }
          ctx.fillText(ch, x, cy);
        });
        col.y += col.speed * 6;
        if (col.y - col.glyphs.length * fontSize > height) {
          col.y = Math.random() * -height * 0.5;
          col.speed = 0.6 + Math.random() * 1.4;
          // shuffle a few glyphs for variety
          col.glyphs[Math.floor(Math.random() * col.glyphs.length)] =
            chars[Math.floor(Math.random() * chars.length)];
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    if (!reduced) rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
