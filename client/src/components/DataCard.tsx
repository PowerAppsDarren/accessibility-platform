import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  color?: string; // CSS color value (e.g., "text-blue-500" or hex)
  onClick?: () => void;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className,
  color,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "glass-panel overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group", 
        onClick && "cursor-pointer active:scale-95",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn("p-2 rounded-full bg-background/50 backdrop-blur-sm transition-colors group-hover:bg-background/80", color)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(description || trend) && (
          <div className="flex items-center mt-1 text-xs">
            {trend && (
              <span className={cn(
                "font-medium mr-2",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
      
      {/* Decorative gradient blob - dynamic color */}
      <div 
        className={cn(
          "absolute -bottom-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity opacity-20 group-hover:opacity-40",
          color ? color.replace('text-', 'bg-') : "bg-primary/10"
        )} 
      />
      
      {/* Hover border effect */}
      <div className={cn(
        "absolute inset-0 border-2 border-transparent rounded-xl transition-colors pointer-events-none",
        color ? `group-hover:border-${color.split('-')[1]}-500/20` : "group-hover:border-primary/20"
      )} />
    </Card>
  );
};

export default DataCard;
