import React from "react";
import Image from "next/image";

interface LogoProps {
  variant?: "full" | "horizontal" | "mark" | "image";
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
    <img
      src="/logo-mark.png"
      alt="MarketSphere Mark"
      className={`${className} object-contain`}
      onError={(e) => {
        // Fallback to SVG if png fails
        (e.target as HTMLElement).style.display = "none";
      }}
    />
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
  const isDark = theme === "dark";

  // Height configurations
  const heightMap = {
    sm: { imgHeight: 32, markHeight: 26, fullWidth: 130 },
    md: { imgHeight: 40, markHeight: 34, fullWidth: 155 },
    lg: { imgHeight: 52, markHeight: 44, fullWidth: 190 },
    xl: { imgHeight: 68, markHeight: 58, fullWidth: 230 },
    custom: { imgHeight: 44, markHeight: 38, fullWidth: 165 },
  };

  const currentSize = heightMap[size] || heightMap.md;

  if (variant === "mark") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src="/logo-mark.png"
          alt="MarketSphere"
          style={{ height: currentSize.markHeight, width: "auto" }}
          className={`object-contain ${iconClassName} ${isDark ? "brightness-200" : ""}`}
        />
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src="/logo-clean.png"
          alt="MarketSphere E-Commerce Ecosystem"
          style={{ width: currentSize.fullWidth, height: "auto" }}
          className={`object-contain ${iconClassName} ${isDark ? "brightness-200 invert" : ""}`}
        />
      </div>
    );
  }

  // Default: horizontal lockup using the exact clean logo
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/logo-clean.png"
        alt="MarketSphere E-Commerce Ecosystem"
        style={{ height: currentSize.imgHeight, width: "auto" }}
        className={`object-contain ${iconClassName} ${isDark ? "brightness-200 invert" : ""}`}
      />
    </div>
  );
}
