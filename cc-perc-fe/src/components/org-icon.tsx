import { FastForwardIcon } from "./icons";
import { cn } from "@/utils/cn";

export type OrgIconProps = {
  size?: number;
  iconSize?: number;
  startColor?: string;
  endColor?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  iconClassName?: string;
};

export default function OrgIcon({
  size = 64,
  iconSize,
  startColor = "from-orange-500",
  endColor = "to-orange-600",
  rounded = "2xl",
  className,
  iconClassName,
}: OrgIconProps) {
  // Calculate container and icon dimensions
  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  // Default icon size is 70% of container size
  const calculatedIconSize = iconSize || Math.round(size * 0.7);

  return (
    <div
      className={cn(
        `bg-gradient-to-r ${startColor} ${endColor} rounded-${rounded} flex items-center justify-center`,
        className
      )}
      style={containerStyle}
    >
      <FastForwardIcon 
        className={cn("text-white", iconClassName)} 
        size={calculatedIconSize} 
      />
    </div>
  );
}