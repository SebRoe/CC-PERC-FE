import { useEffect, useState } from "react";

/**
 * Detects whether the user is currently scrolling up or down.
 * Returns either "up" or "down" and updates only when the
 * difference between the current and previous scroll position
 * exceeds the supplied threshold (in pixels).
 */
export function useScrollDirection(threshold: number = 10): "up" | "down" {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [lastY, setLastY] = useState<number>(typeof window === "undefined" ? 0 : window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = Math.abs(currentY - lastY);

      if (diff < threshold) return; // ignore small jitters

      setDirection(currentY > lastY ? "down" : "up");
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY, threshold]);

  return direction;
} 