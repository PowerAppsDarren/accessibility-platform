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
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className 
}) => {
  return (
    <Card className={cn("glass-panel overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
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
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
    </Card>
  );
};

export default DataCard;
