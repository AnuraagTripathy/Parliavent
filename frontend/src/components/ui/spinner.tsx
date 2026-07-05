import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label }: SpinnerProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin text-primary" strokeWidth={2.25} />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </span>
  );
}
