// shadcn/ui Button pattern (MIT), manually adapted: no animation or transition classes.
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";
const styles = cva("button", {
  variants: {
    tone: {
      primary: "button-primary",
      secondary: "button-secondary",
      plain: "button-plain",
    },
  },
  defaultVariants: { tone: "primary" },
});
export function Button({
  className,
  tone,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof styles> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={clsx(styles({ tone }), className)} {...props} />;
}
