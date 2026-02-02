import { ReactNode } from "react";
import { GRADIENTS } from "../../utils/constants";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: keyof typeof GRADIENTS;
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export function GradientButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  fullWidth = false,
}: GradientButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-gradient-to-r ${
        GRADIENTS[variant]
      } border-2 border-[#ad46ff] px-8 py-4 hover:scale-105 transition-transform ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
