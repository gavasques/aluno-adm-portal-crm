
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardStatsProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  onClick?: () => void;
}

export function CardStats({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className,
  onClick,
}: CardStatsProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md", 
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="w-3 h-3 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center mt-1">
            {trend && (
              <div 
                className={cn(
                  "mr-1 rounded-full p-0.5",
                  trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"
                )}
              >
                {trend === "up" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 14-7-7-7 7"/></svg>
                ) : trend === "down" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 10 7 7 7-7"/></svg>
                ) : null}
              </div>
            )}
            <p 
              className={cn(
                "text-xs",
                trend === "up" 
                  ? "text-green-500" 
                  : trend === "down" 
                    ? "text-red-500" 
                    : "text-gray-500"
              )}
            >
              {trendValue && <span className="font-medium">{trendValue} </span>}
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
