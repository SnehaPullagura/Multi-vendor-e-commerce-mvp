import React from "react";

interface LogoProps {
  variant?: "full" | "horizontal" | "mark";
  theme?: "navy" | "dark" | "light" | "inherit";
  size?: "sm" | "md" | "lg" | "xl" | "custom";
  className?: string;
  iconClassName?: string;
  showSubtitle?: boolean;
}

export function LogoIcon({
  className = "w-9 h-9",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="220 130 360 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MarketSphere Mark"
    >
      <g fill={color}>
        {/* Left Vertical Leg */}
        <path d="M 285 180 L 307 180 L 307 380 L 285 380 Z" />

        {/* Right Vertical Leg */}
        <path d="M 493 180 L 515 180 L 515 380 L 493 380 Z" />

        {/* Inner V Diagonal (Right Descent to Center Peak) */}
        <path d="M 500 180 L 400 355 L 375 355 L 478 180 Z" />

        {/* Inner V Diagonal (Left Descent - Cut to pass behind S) */}
        <path d="M 300 180 L 335 240 L 315 252 L 285 180 Z" />
        <path d="M 370 305 L 400 355 L 418 355 L 390 305 Z" />

        {/* Dynamic S Ribbons Intertwining M */}
        <path d="M 432 170 C 370 145 355 180 355 210 C 355 245 385 265 425 285 C 470 307 482 335 482 370 C 482 425 432 445 380 435 C 342 427 325 408 322 390 L 344 384 C 347 400 365 416 385 420 C 420 426 458 410 458 370 C 458 340 432 322 395 302 C 350 278 332 255 332 212 C 332 165 372 135 430 152 Z" />

        {/* Global Horizon Arc (Sphere Motif) */}
        <path d="M 235 375 C 290 280 510 280 565 375 C 505 300 295 300 235 375 Z" />
      </g>
    </svg>
  );
}

export function Logo({
  variant = "horizontal",
  theme = "navy",
  size = "md",
  className = "",
  iconClassName = "",
  showSubtitle = true,
}: LogoProps) {
  // Theme color definitions
  const isDark = theme === "dark";
  const markColor = isDark ? "#60a5fa" : theme === "light" ? "#1e293b" : theme === "inherit" ? "currentColor" : "#0d1e3d";
  const textColor = isDark ? "text-white" : theme === "light" ? "text-slate-900" : theme === "inherit" ? "text-current" : "text-[#0d1e3d]";
  const subtextColor = isDark ? "text-slate-400" : theme === "light" ? "text-slate-500" : theme === "inherit" ? "text-current opacity-75" : "text-slate-600";

  // Size configurations
  const sizeMap = {
    sm: {
      icon: "w-7 h-7",
      title: "text-base tracking-tight",
      subtitle: "text-[8px] tracking-[0.2em]",
      gap: "gap-2",
    },
    md: {
      icon: "w-9 h-9",
      title: "text-lg tracking-tight",
      subtitle: "text-[9px] tracking-[0.22em]",
      gap: "gap-2.5",
    },
    lg: {
      icon: "w-12 h-12",
      title: "text-2xl tracking-tight",
      subtitle: "text-[11px] tracking-[0.28em]",
      gap: "gap-3",
    },
    xl: {
      icon: "w-16 h-16",
      title: "text-3xl tracking-tight",
      subtitle: "text-xs tracking-[0.32em]",
      gap: "gap-4",
    },
    custom: {
      icon: iconClassName || "w-10 h-10",
      title: "text-xl tracking-tight",
      subtitle: "text-[10px] tracking-[0.22em]",
      gap: "gap-2.5",
    },
  };

  const currentSize = sizeMap[size];

  if (variant === "mark") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LogoIcon className={iconClassName || currentSize.icon} color={markColor} />
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="p-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 shadow-sm">
          <LogoIcon className={iconClassName || currentSize.icon} color={markColor} />
        </div>
        <div className="mt-2.5 flex flex-col items-center">
          <span
            className={`font-serif font-bold ${textColor} ${currentSize.title} leading-none font-["Playfair_Display",Georgia,serif]`}
          >
            MarketSphere
          </span>
          {showSubtitle && (
            <span
              className={`font-mono font-bold uppercase ${subtextColor} ${currentSize.subtitle} mt-1.5 leading-none`}
            >
              E-COMMERCE ECOSYSTEM
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: horizontal lockup
  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      <div className="flex-shrink-0 flex items-center justify-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 shadow-sm">
        <LogoIcon className={iconClassName || currentSize.icon} color={markColor} />
      </div>
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif font-bold ${textColor} ${currentSize.title} leading-none font-["Playfair_Display",Georgia,serif]`}
        >
          MarketSphere
        </span>
        {showSubtitle && (
          <span
            className={`font-mono font-bold uppercase ${subtextColor} ${currentSize.subtitle} mt-0.5 leading-none`}
          >
            E-COMMERCE ECOSYSTEM
          </span>
        )}
      </div>
    </div>
  );
}

