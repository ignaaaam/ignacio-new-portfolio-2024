"use client";
import React, { type ReactNode } from "react";

interface AceternityAuroraProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
  className?: string;
  intensity?: "subtle" | "medium" | "high";
  colorScheme?: "indigo" | "purple" | "amber" | "custom";
  customColors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  animationSpeed?: "slow" | "normal" | "fast";
}

export default function AceternityAurora({
  className = "",
  children,
  showRadialGradient = true,
  intensity = "medium",
  colorScheme = "indigo",
  customColors,
  animationSpeed = "normal",
  ...props
}: AceternityAuroraProps) {
  // Determine opacity based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case "subtle": return "opacity-20";
      case "high": return "opacity-60";
      default: return "opacity-35";
    }
  };

  // Determine animation speed
  const getAnimationSpeed = () => {
    switch (animationSpeed) {
      case "slow": return "after:animate-aurora-slow";
      case "fast": return "after:animate-aurora-fast";
      default: return "after:animate-aurora";
    }
  };

  // Determine color scheme
  const getColorVariables = () => {
    if (colorScheme === "custom" && customColors) {
      return {
        "--primary": customColors.primary || "#3b82f6",
        "--secondary": customColors.secondary || "#a5b4fc",
        "--tertiary": customColors.tertiary || "#60a5fa",
      };
    }

    switch (colorScheme) {
      case "purple":
        return {
          "--primary": "#8b5cf6", // Purple-500
          "--secondary": "#c4b5fd", // Purple-300
          "--tertiary": "#a78bfa", // Purple-400
        };
      case "amber":
        return {
          "--primary": "#f59e0b", // Amber-500
          "--secondary": "#fcd34d", // Amber-300
          "--tertiary": "#fbbf24", // Amber-400
        };
      default: // indigo
        return {
          "--primary": "#3b82f6", // Blue-500
          "--secondary": "#a5b4fc", // Indigo-300
          "--tertiary": "#60a5fa", // Blue-400
        };
    }
  };

  const colorVars = getColorVariables();
  const opacityClass = getOpacity();
  const animationClass = getAnimationSpeed();

  return (
    <div
      className={`transition-bg fixed inset-0 h-full w-full overflow-hidden ${className}`}
      style={{
        zIndex: -1,
        pointerEvents: "none",
        "--aurora": `repeating-linear-gradient(100deg,var(--primary) 10%,var(--secondary) 15%,var(--tertiary) 20%,var(--secondary) 25%,var(--primary) 30%)`,
        "--dark-gradient": "repeating-linear-gradient(100deg,#000 0%,#000 7%,transparent 10%,transparent 12%,#000 16%)",
        "--white-gradient": "repeating-linear-gradient(100deg,#fff 0%,#fff 7%,transparent 10%,transparent 12%,#fff 16%)",
        ...colorVars,
      } as React.CSSProperties}
      {...props}
    >
      <div
        className={`${animationClass} pointer-events-none absolute -inset-[10px] ${opacityClass} [background-image:var(--dark-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] blur-[15px] invert filter will-change-transform after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)] ${
          showRadialGradient
            ? `[mask-image:radial-gradient(ellipse_at_80%_20%,black_10%,transparent_75%)]`
            : ""
        }`}
      ></div>
      {children}
    </div>
  );
} 