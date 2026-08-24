import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Class Variance Authority (CVA) configuration for Button variants.
 * Aligned with epidemic-prediction design language: rounded-none, active:translate-y-px.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-px rounded-none",
  {
    variants: {
      variant: {
        // Maps to epidemic-prediction's variant names
        default:   "bg-blue-600 text-white hover:bg-blue-700 border-transparent shadow-sm",
        primary:   "bg-blue-600 text-white hover:bg-blue-700 border-transparent shadow-sm",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border-transparent",
        ghost:     "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
        destructive: "bg-red-600 text-white hover:bg-red-700 border-transparent",
        outline:   "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        link:      "text-blue-600 underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        sm:   "h-8 px-3 text-xs",
        md:   "h-10 px-4 py-2 text-sm",
        default: "h-10 px-4 py-2 text-sm",
        lg:   "h-12 px-6 text-lg",
        icon: "h-10 w-10 p-0 flex items-center justify-center",
        "icon-sm": "h-8 w-8 p-0 flex items-center justify-center",
        "icon-lg": "h-12 w-12 p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Reusable Button component aligned with epidemic-prediction design language.
 * Supports isLoading, asChild (Radix Slot), and all CVA variants.
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
