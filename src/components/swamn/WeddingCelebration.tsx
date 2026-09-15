import { useEffect, useMemo } from "react";

interface Props {
  onClose: () => void;
}

export const WeddingCelebration = ({ onClose }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const hearts = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        size: 14 + Math.random() * 30,
        emoji: ["❤️", "💖", "💘", "💗", "💕", "🌹", "✨"][
          Math.floor(Math.random() * 7)
        ],
      })),
    []
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 5,
        color: ["#f43f5e", "#fbbf24", "#f472b6", "#a855f7", "#22d3ee", "#f97316"][
          Math.floor(Math.random() * 6)
        ],
      })),
    []
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #fff1f5 0%, #fde7ef 40%, #f9c2d4 100%)",
      }}
    >
      {/* Falling hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="absolute -top-10 select-none"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animation: `wed-fall ${h.duration}s linear ${h.delay}s infinite`,
            }}
          >
            {h.emoji}
          </span>
        ))}
        {confetti.map((c) => (
          <span
            key={`c-${c.id}`}
            className="absolute -top-4 h-2 w-2 rounded-sm"
            style={{
              left: `${c.left}%`,
              background: c.color,
              animation: `wed-fall ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-md backdrop-blur hover:bg-white"
      >
        ✕ Close
      </button>

      {/* Center card */}
      <div className="relative z-10 mx-6 max-w-2xl rounded-[2rem] border border-rose-200 bg-white/70 px-8 py-14 text-center shadow-2xl backdrop-blur-xl md:px-16 md:py-20">
        <div className="mb-4 text-sm uppercase tracking-[0.4em] text-rose-500">
          Together Forever
        </div>
        <div className="mb-6 flex items-center justify-center gap-4 text-5xl">
          <span style={{ animation: "wed-pulse 1.6s ease-in-out infinite" }}>💖</span>
          <span style={{ animation: "wed-pulse 1.6s ease-in-out infinite 0.3s" }}>💍</span>
          <span style={{ animation: "wed-pulse 1.6s ease-in-out infinite 0.6s" }}>💖</span>
        </div>
        <h1
          className="mb-6 font-serif text-5xl leading-tight text-rose-700 md:text-7xl"
          style={{
            fontFamily: "'Great Vibes', 'Dancing Script', cursive, serif",
            textShadow: "0 2px 20px rgba(244,63,94,0.25)",
          }}
        >
          Aayush <span className="text-rose-500">Weds</span> Saanvi !
        </h1>
        <p className="mx-auto max-w-lg text-lg text-rose-800/80 md:text-xl">
          🎉 Heartfelt <span className="font-semibold">Congratulations</span> to the
          beautiful couple! ❤️ Wishing you a lifetime of love, laughter, and
          togetherness. 💫
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-2xl">
          <span style={{ animation: "wed-pulse 1.2s ease-in-out infinite" }}>❤️</span>
          <span style={{ animation: "wed-pulse 1.2s ease-in-out infinite 0.2s" }}>❤️</span>
          <span style={{ animation: "wed-pulse 1.2s ease-in-out infinite 0.4s" }}>❤️</span>
        </div>
      </div>

      <style>{`
        @keyframes wed-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0.9; }
        }
        @keyframes wed-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
};
