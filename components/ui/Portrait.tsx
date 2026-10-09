import { Todo } from "./Todo";

/** Cadre portrait : silhouette élégante tant que la photo officielle n'est pas fournie. */
export function Portrait({ photo, alt, className = "" }: { photo?: string | null; alt: string; className?: string }) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden border border-gold-500/70 bg-gradient-to-b from-green-100 to-cream-200 ${className}`}>
      <span aria-hidden="true" className="absolute inset-[6px] z-10 border border-gold-400/50" />
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <>
          <svg viewBox="0 0 100 125" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[88%] w-full text-green-800/25">
            <circle cx="50" cy="42" r="19" fill="currentColor" />
            <path d="M8 125c0-27 18-44 42-44s42 17 42 44z" fill="currentColor" />
          </svg>
          <div className="absolute inset-x-0 bottom-4 z-10 text-center">
            <Todo what="photo officielle" />
          </div>
        </>
      )}
    </div>
  );
}
