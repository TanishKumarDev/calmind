import React, { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;      // initial circle size
  mainCircleOpacity?: number;   // first circle opacity
  numCircles?: number;          // total ripple rings
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,white,transparent)]",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = Math.max(mainCircleOpacity - i * 0.03, 0);
        const animationDelay = `${i * 0.08}s`; // slower ripple spread
        const borderOpacity = 5 + i * 5;
        const isLast = i === numCircles - 1;

        const circleStyles: CSSProperties = {
          width: size,
          height: size,
          opacity,
          animationDelay,
          borderStyle: isLast ? "dashed" : "solid",
          borderWidth: "1px",
          borderColor: `hsl(var(--foreground) / ${borderOpacity}%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };

        return (
          <div
            key={i}
            className="absolute rounded-full animate-ripple shadow-xl bg-foreground/20"
            style={circleStyles}
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
