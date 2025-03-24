
import React from 'react';
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  "rounded-xl p-6 backdrop-blur-sm transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-card border border-border hover:shadow-md",
        glass: "glass border border-white/20 hover:shadow-lg",
        filled: "bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface DashboardCardProps extends VariantProps<typeof cardVariants> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon = <BarChart3 size={20} />,
  description,
  trend,
  trendLabel,
  variant,
  size,
  className,
  onClick,
}) => {
  // Determine if the trend is positive, negative, or neutral
  let trendColor = 'text-muted-foreground';
  let TrendIcon = null;
  
  if (trend) {
    if (trend > 0) {
      trendColor = 'text-emerald-500';
      TrendIcon = TrendingUp;
    } else if (trend < 0) {
      trendColor = 'text-red-500';
      TrendIcon = TrendingDown;
    }
  }

  return (
    <div 
      className={`${cardVariants({ variant, size })} ${className} ${onClick ? 'cursor-pointer interactive' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-primary">{icon}</div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      {(trend || trendLabel) && (
        <div className={`flex items-center mt-3 text-sm ${trendColor}`}>
          {TrendIcon && <TrendIcon size={16} className="mr-1" />}
          <span>
            {trend && `${Math.abs(trend)}%`} {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};
