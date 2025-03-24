
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface LineChartData {
  name: string;
  [key: string]: any;
}

interface LineDataSet {
  dataKey: string;
  color: string;
  name?: string;
}

interface LineChartProps {
  data: LineChartData[];
  lines: LineDataSet[];
  showGrid?: boolean;
  showLegend?: boolean;
  onPointClick?: (data: LineChartData, index: number) => void;
  xAxisDataKey?: string;
  enableCurve?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  showGrid = true,
  showLegend = true,
  onPointClick,
  xAxisDataKey = 'name',
  enableCurve = true,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-md border border-border text-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`value-${index}`} style={{ color: entry.color }} className="font-semibold">
              {`${entry.name || entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
        onClick={(data) => onPointClick && data.activePayload && onPointClick(data.activePayload[0].payload, data.activeTooltipIndex || 0)}
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
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        
        {lines.map((line, index) => (
          <Line
            key={`line-${index}`}
            type={enableCurve ? "monotone" : "linear"}
            dataKey={line.dataKey}
            stroke={line.color}
            name={line.name || line.dataKey}
            activeDot={{ 
              r: 6, 
              onClick: (data) => onPointClick && onPointClick(data.payload, data.index),
              className: onPointClick ? 'cursor-pointer' : ''
            }}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
