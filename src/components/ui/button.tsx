import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white shadow-xs hover:bg-black active:bg-zinc-950",
        destructive:
          "bg-red-600 text-white shadow-xs hover:bg-red-700",
        outline:
          "border border-zinc-200 bg-white text-zinc-900 shadow-xs hover:bg-zinc-50 hover:border-zinc-300",
        secondary:
          "bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-200/80",
        ghost:
          "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        brand: "bg-ocean text-white shadow-xs hover:bg-ocean-dark",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4 text-sm font-medium rounded-xl",
        sm: "h-8.5 rounded-lg gap-1.5 px-3.5 text-xs font-semibold has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-7 text-base font-semibold has-[>svg]:px-5",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  )
}

export { Button, buttonVariants }
