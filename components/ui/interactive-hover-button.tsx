import * as React from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Animated button component featuring interactive hover expansion and directional icon transitions.
 */
const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group bg-background relative w-auto cursor-pointer overflow-hidden border p-2 px-6 text-center font-semibold",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div
            className="bg-green-400 h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]"
            aria-hidden="true"
          />
          <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
            {children}
          </span>
        </div>
        <div
          className="text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
          aria-hidden="true"
        >
          <span>{children}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </button>
    )
  }
)
InteractiveHoverButton.displayName = "InteractiveHoverButton"

export { InteractiveHoverButton }
