
import React, { useState } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

export interface BarChartData {
  name: string;
  value: number;
  color?: string;
  drillDownData?: BarChartData[];
}

interface BarChartProps {
  data: BarChartData[];
  xAxisDataKey?: string;
  barDataKey?: string;
  barSize?: number;
  showGrid?: boolean;
  onBarClick?: (data: BarChartData, index: number) => void;
  highlightedIndex?: number | null;
  colors?: string[];
  dataKey?: string;
  showLegend?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisDataKey = 'name',
  barDataKey = 'value',
  barSize = 30,
  showGrid = true,
  onBarClick,
  highlightedIndex = null,
  colors = ['#3b82f6', '#60a5fa'],
  dataKey = 'value',
  showLegend = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const handleMouseEnter = (_: any, index: number) => {
    setHoveredIndex(index);
  };
  
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  
  const getBarColor = (index: number) => {
    if (highlightedIndex === index) {
      return '#2563eb'; // Highlighted bar color
    }
    if (hoveredIndex === index) {
      return '#60a5fa'; // Hovered bar color
    }
    return index % 2 === 0 ? colors[0] : colors[1]; // Alternating colors
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-md border border-border text-sm">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-primary font-semibold">{`${dataKey}: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        barSize={barSize}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />}
        <XAxis 
          dataKey={xAxisDataKey} 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />
        {showLegend && <Legend />}
        <Bar 
          dataKey={barDataKey}
          radius={[4, 4, 0, 0]}
          onClick={(data, index) => onBarClick && onBarClick(data as BarChartData, index)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={onBarClick ? 'cursor-pointer' : ''}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(index)} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
