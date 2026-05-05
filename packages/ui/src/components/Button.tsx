import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm border text-sm font-medium shadow-[0_10px_30px_rgba(2,6,23,0.18)] backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B464]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-white/25 bg-white/12 text-white hover:border-white/35 hover:bg-white/18",
        primary:
          "border-[#14B464]/45 bg-[#14B464]/85 text-white shadow-[0_12px_36px_rgba(20,180,100,0.28)] hover:border-[#14B464]/65 hover:bg-[#14B464]/95",
        danger:
          "border-red-400/40 bg-red-500/75 text-white hover:border-red-300/60 hover:bg-red-500/90",
        ghost:
          "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/12",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
