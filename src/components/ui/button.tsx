import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg",
        outline:
          "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[44px] px-5 py-2.5 text-base md:h-10 md:px-4 md:text-sm [&_svg]:size-5 md:[&_svg]:size-4",
        sm: "min-h-[40px] px-4 py-2 text-sm md:h-9 md:px-3 md:text-xs [&_svg]:size-4",
        lg: "min-h-[52px] px-8 py-3.5 text-lg md:h-12 md:px-8 md:text-base [&_svg]:size-6 md:[&_svg]:size-5",
        icon: "min-h-[44px] min-w-[44px] md:h-10 md:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
