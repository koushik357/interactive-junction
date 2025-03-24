
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { ChartContainer } from '@/components/dashboard/ChartContainer';
import { BarChart, BarChartData } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { DataTable } from '@/components/dashboard/DataTable';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useDrillDown } from '@/hooks/useDrillDown';
import { 
  BarChart3, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

// Sample data for KPIs
const kpiData = [
  { title: 'Total Revenue', value: '$256,890', icon: <DollarSign size={20} />, trend: 12.5, trendLabel: 'vs last month' },
  { title: 'Recruitment', value: '125 Hires', icon: <Users size={20} />, trend: 5.3, trendLabel: 'vs last month' },
  { title: 'Payroll Processed', value: '$89,560', icon: <DollarSign size={20} />, trend: -2.1, trendLabel: 'vs last month' },
  { title: 'Sales', value: '$145,290', icon: <BarChart3 size={20} />, trend: 18.2, trendLabel: 'vs last month' },
  { title: 'Invoices Generated', value: '246', icon: <FileText size={20} />, trend: 7.5, trendLabel: 'vs last month' },
  { title: 'SLA Compliance', value: '98.7%', icon: <ShieldCheck size={20} />, trend: 0.8, trendLabel: 'vs last month' },
];

// Sample data for bar chart
const initialBarData: BarChartData[] = [
  { name: 'Recruitment', value: 125 },
  { name: 'Payroll', value: 89 },
  { name: 'Billing', value: 112 },
  { name: 'Sales', value: 145 },
  { name: 'SLA', value: 99 },
];

// Sample drill-down data
const recruitmentDrillData: BarChartData[] = [
  { name: 'IT', value: 42 },
  { name: 'Finance', value: 28 },
  { name: 'Marketing', value: 23 },
  { name: 'Operations', value: 32 },
];

const itDrillData: BarChartData[] = [
  { name: 'Developers', value: 18 },
  { name: 'QA', value: 8 },
  { name: 'DevOps', value: 10 },
  { name: 'UI/UX', value: 6 },
];

// Sample data for line chart
const lineChartData = [
  { name: 'Jan', revenue: 42000, expenses: 25000 },
  { name: 'Feb', revenue: 52000, expenses: 29000 },
  { name: 'Mar', revenue: 48000, expenses: 31000 },
  { name: 'Apr', revenue: 61000, expenses: 33000 },
  { name: 'May', revenue: 55000, expenses: 30000 },
  { name: 'Jun', revenue: 67000, expenses: 35000 },
  { name: 'Jul', revenue: 75000, expenses: 39000 },
  { name: 'Aug', revenue: 82000, expenses: 42000 },
  { name: 'Sep', revenue: 79000, expenses: 40000 },
  { name: 'Oct', revenue: 86000, expenses: 43000 },
  { name: 'Nov', revenue: 94000, expenses: 46000 },
  { name: 'Dec', revenue: 102000, expenses: 49000 },
];

// Sample data for table
const tableData = [
  { id: 1, department: 'IT', revenue: 125000, expenses: 78000, profit: 47000 },
  { id: 2, department: 'Marketing', revenue: 85000, expenses: 62000, profit: 23000 },
  { id: 3, department: 'Sales', revenue: 145000, expenses: 89000, profit: 56000 },
  { id: 4, department: 'HR', revenue: 65000, expenses: 55000, profit: 10000 },
  { id: 5, department: 'Finance', revenue: 72000, expenses: 58000, profit: 14000 },
  { id: 6, department: 'Operations', revenue: 118000, expenses: 82000, profit: 36000 },
  { id: 7, department: 'Customer Support', revenue: 95000, expenses: 79000, profit: 16000 },
  { id: 8, department: 'Research', revenue: 110000, expenses: 92000, profit: 18000 },
];

const Index = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');
  
  // Set up drill-down for bar chart
  const { 
    currentData: barData, 
    currentLabel: barLabel, 
    drillDown: drillDownBar, 
    drillUp: drillUpBar, 
    isTopLevel: isBarTopLevel,
    currentLevel: barLevel
  } = useDrillDown<BarChartData>(initialBarData);
  
  // Handle bar drill-down logic
  const handleBarClick = (data: BarChartData, index: number) => {
    if (barLevel === 0) {
      if (data.name === 'Recruitment') {
        drillDownBar('Recruitment by Department', recruitmentDrillData);
      } else {
        // This would fetch real data in a production app
        drillDownBar(`${data.name} Details`, [
          { name: 'Category 1', value: Math.round(data.value * 0.3) },
          { name: 'Category 2', value: Math.round(data.value * 0.25) },
          { name: 'Category 3', value: Math.round(data.value * 0.2) },
          { name: 'Category 4', value: Math.round(data.value * 0.25) },
        ]);
      }
    } else if (barLevel === 1 && barLabel.includes('Recruitment')) {
      if (data.name === 'IT') {
        drillDownBar('IT Recruitment Breakdown', itDrillData);
      } else {
        // Simulate deeper drill for other departments
        drillDownBar(`${data.name} Recruitment Details`, [
          { name: 'Junior', value: Math.round(data.value * 0.4) },
          { name: 'Mid-level', value: Math.round(data.value * 0.35) },
          { name: 'Senior', value: Math.round(data.value * 0.25) },
        ]);
      }
    }
    // Could add more levels here
  };

  // Time filter options
  const timeFilterOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  // Table columns configuration
  const tableColumns = [
    { header: 'Department', accessor: 'department' as keyof typeof tableData[0], sortable: true },
    { 
      header: 'Revenue', 
      accessor: 'revenue' as keyof typeof tableData[0], 
      cell: (value: number) => `$${value.toLocaleString()}`,
      sortable: true 
    },
    { 
      header: 'Expenses', 
      accessor: 'expenses' as keyof typeof tableData[0], 
      cell: (value: number) => `$${value.toLocaleString()}`,
      sortable: true 
    },
    { 
      header: 'Profit', 
      accessor: 'profit' as keyof typeof tableData[0], 
      cell: (value: number) => `$${value.toLocaleString()}`,
      sortable: true 
    },
  ];

  // Handle table row click
  const handleRowClick = (row: typeof tableData[0]) => {
    console.log('Row clicked:', row);
    // In a real app, this would open a detailed view or drill down
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your AI-powered analytics dashboard</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiData.map((kpi, index) => (
            <DashboardCard
              key={index}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              trendLabel={kpi.trendLabel}
              onClick={() => console.log(`Clicked on ${kpi.title}`)}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Bar Chart with Drill Down */}
          <ChartContainer
            title={isBarTopLevel ? "Performance by Category" : barLabel}
            description="Click on bars to see detailed breakdown"
            isDrilledDown={!isBarTopLevel}
            onDrillUp={drillUpBar}
            filters={
              <div className="flex items-center space-x-4">
                <CustomSelect
                  label="Time Period"
                  options={timeFilterOptions}
                  value={timeFilter}
                  onChange={setTimeFilter}
                  className="w-40"
                />
              </div>
            }
          >
            <BarChart 
              data={barData} 
              onBarClick={handleBarClick}
              showGrid={true}
            />
          </ChartContainer>

          {/* Line Chart */}
          <ChartContainer
            title="Revenue vs Expenses Trend"
            description="Monthly comparison of revenue against expenses"
            filters={
              <div className="flex items-center space-x-4">
                <CustomSelect
                  label="Time Period"
                  options={timeFilterOptions}
                  value={timeFilter}
                  onChange={setTimeFilter}
                  className="w-40"
                />
              </div>
            }
          >
            <LineChart
              data={lineChartData}
              lines={[
                { dataKey: 'revenue', color: '#3b82f6', name: 'Revenue' },
                { dataKey: 'expenses', color: '#ef4444', name: 'Expenses' }
              ]}
              showLegend={true}
              onPointClick={(data, index) => console.log('Point clicked:', data, index)}
            />
          </ChartContainer>
        </div>

        {/* Data Table */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Department Performance</h2>
          <DataTable
            data={tableData}
            columns={tableColumns}
            onRowClick={handleRowClick}
            searchable={true}
            pagination={true}
            itemsPerPage={5}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
