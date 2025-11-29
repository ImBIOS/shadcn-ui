import { Root } from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementRef, RefObject } from "react";

import { cn } from "../../lib/utils";

const labelVariants = cva(
  "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Root> &
  VariantProps<typeof labelVariants> & {
    ref?: RefObject<ElementRef<typeof Root> | null>;
  }) => (
  <Root className={cn(labelVariants(), className)} ref={ref} {...props} />
);
Label.displayName = Root.displayName;

export { Label };
