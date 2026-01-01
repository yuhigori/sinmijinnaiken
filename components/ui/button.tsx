import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const variantStyles = {
            default: "bg-terracotta-500 text-warm-50 hover:bg-terracotta-600",
            outline:
                "border-2 border-terracotta-500 text-terracotta-500 hover:bg-terracotta-50",
            ghost: "hover:bg-warm-100 text-dark-600",
        };

        const sizeStyles = {
            default: "h-10 px-4 py-2",
            sm: "h-9 px-3 text-sm",
            lg: "h-11 px-8",
        };

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
