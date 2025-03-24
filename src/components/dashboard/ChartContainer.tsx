
import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Filter, MoreHorizontal, ZoomIn } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ChartContainerProps {
  title: string;
  description?: string;
  filters?: React.ReactNode;
  children: React.ReactNode;
  onDrillDown?: () => void;
  onDrillUp?: () => void;
  isDrilledDown?: boolean;
  drillDownLabel?: string;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  filters,
  children,
  onDrillDown,
  onDrillUp,
  isDrilledDown = false,
  drillDownLabel,
  className = '',
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  return (
    <div className={`rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 ease-in-out ${className}`}>
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isDrilledDown && onDrillUp && (
            <button 
              onClick={onDrillUp}
              className="mr-1 p-1 rounded-md hover:bg-secondary text-muted-foreground"
              aria-label="Back to previous view"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          
          <div>
            <h3 className="font-medium text-foreground">{title}</h3>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
            {isDrilledDown && drillDownLabel && (
              <div className="text-xs text-primary mt-0.5 font-medium">{drillDownLabel}</div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {filters && (
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className={`p-1.5 rounded-md hover:bg-secondary text-muted-foreground ${isFilterVisible ? 'bg-secondary text-foreground' : ''}`}
              aria-label="Toggle filters"
            >
              <Filter size={16} />
            </button>
          )}
          
          {onDrillDown && !isDrilledDown && (
            <button 
              onClick={onDrillDown}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
              aria-label="Drill down into data"
            >
              <ZoomIn size={16} />
            </button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground">
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chart Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ExternalLink size={14} className="mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink size={14} className="mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Full Screen</DropdownMenuItem>
              <DropdownMenuItem>Refresh Data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isFilterVisible && filters && (
        <div className="px-6 py-3 border-b border-border bg-secondary/50">
          {filters}
        </div>
      )}
      
      <div className="p-6 h-[300px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
