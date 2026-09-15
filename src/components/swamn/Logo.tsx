import mark from "@/assets/swamn-logo-clean.png";

interface LogoProps {
  size?: number;
  variant?: "default" | "light";
  withWordmark?: boolean;
  className?: string;
}

export const Logo = ({ size = 32, variant = "default", withWordmark = true, className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="shrink-0 overflow-visible"
        style={{ width: size, height: size }}
      >
        <img
          src={mark}
          alt="SWAMN logo — Intelligent Ocean Systems"
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectPosition: "center" }}
          className="block object-contain select-none"
          draggable={false}
        />
      </div>
      {withWordmark && (
        <span
          className={`h-display text-[1rem] tracking-[0.24em] ${
            variant === "light" ? "text-primary-foreground" : "text-navy"
          }`}
        >
          SWAMN
        </span>
      )}
    </div>
  );
};
