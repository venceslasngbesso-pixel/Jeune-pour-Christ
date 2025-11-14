import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, iconColor = "text-primary", trend }: StatCardProps) {
  return (
    <Card className="hover-elevate">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-2 rounded-md bg-primary/10")}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {trend.value}
            </span>
          )}
        </div>
        <div>
          <p className="text-3xl md:text-4xl font-bold font-poppins mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
