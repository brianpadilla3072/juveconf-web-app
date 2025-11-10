import { Loader2 } from "lucide-react";
import { BRANDING_CONFIG } from "@/lib/constants";

export function LoadingSpinner({
  className = "",
  size = 8,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2
        className={`h-${size} w-${size} animate-spin`}
        style={{ color: BRANDING_CONFIG.loading.colorHex }}
      />
    </div>
  );
}
