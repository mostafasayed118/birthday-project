import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuoteStatusBadgeProps {
  status: "published" | "draft";
}

export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  return (
    <Badge
      variant={status === "published" ? "default" : "secondary"}
      className={cn(
        status === "published" 
          ? "bg-green-100 text-green-800" 
          : "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </Badge>
  );
}