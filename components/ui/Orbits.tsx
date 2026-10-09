/** Anneaux fins et petits points en orbite : le « soleil » du SJB, discret et très lent, sur fond blanc. */
export function Orbits({ className = "", scale = 1 }: { className?: string; scale?: number }) {
  const rings = [
    { size: 22, dur: "46s", rev: false },
    { size: 34, dur: "70s", rev: true },
    { size: 48, dur: "104s", rev: false },
    { size: 64, dur: "150s", rev: true },
  ];
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      {rings.map((r, i) => {
        const size = `${r.size * scale}rem`;
        return (
          <div
            key={r.size}
            className="absolute left-1/2 top-1/2 rounded-full border border-green-800/10"
            style={{
              width: size,
              height: size,
              marginLeft: `calc(${size} / -2)`,
              marginTop: `calc(${size} / -2)`,
              animation: `orbit ${r.dur} linear infinite ${r.rev ? "reverse" : ""}`,
            }}
          >
            <span className={`absolute -top-[5px] left-1/2 -ml-[5px] block h-2.5 w-2.5 rounded-full ${i % 2 ? "bg-green-700" : "bg-gold-400"}`} />
          </div>
        );
      })}
    </div>
  );
}
