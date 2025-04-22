import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  href: string;
}

export function Link({ className, children, ...props }: LinkProps) {
  return (
    <a className={cn("font-medium text-primary underline-offset-4 hover:underline", className)} {...props}>
      {children}
    </a>
  );
}
