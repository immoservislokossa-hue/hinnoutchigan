/** Rayons de soleil : écho à la devise « Toujours là, tel le soleil ». Géométrie déterministe. */
export function Sunburst({ className = "", rays = 48, spin = true }: { className?: string; rays?: number; spin?: boolean }) {
  const cx = 500;
  const cy = 500;
  const items = Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2;
    const long = i % 2 === 0;
    const r1 = 150;
    const r2 = long ? 490 : 360;
    const w = (Math.PI * 2) / rays / (long ? 3.2 : 4.5);
    const p = (r: number, ang: number) => `${(cx + Math.cos(ang) * r).toFixed(2)},${(cy + Math.sin(ang) * r).toFixed(2)}`;
    return `${p(r1, a - w)} ${p(r2, a)} ${p(r1, a + w)}`;
  });
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={spin ? { animation: "sun-spin 160s linear infinite" } : undefined}
    >
      <svg viewBox="0 0 1000 1000" className="h-full w-full">
        <defs>
          <radialGradient id="sun-ray" cx="50%" cy="50%" r="50%">
            <stop offset="28%" stopColor="#e8c766" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#e8c766" stopOpacity="0" />
          </radialGradient>
        </defs>
        {items.map((pts, i) => (
          <polygon key={i} points={pts} fill="url(#sun-ray)" />
        ))}
        <circle cx={cx} cy={cy} r="150" fill="none" stroke="#e8c766" strokeOpacity="0.35" />
        <circle cx={cx} cy={cy} r="196" fill="none" stroke="#e8c766" strokeOpacity="0.16" strokeDasharray="2 8" />
      </svg>
    </div>
  );
}
