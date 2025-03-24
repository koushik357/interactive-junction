
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { ChartContainer } from '@/components/dashboard/ChartContainer';
import { BarChart, BarChartData } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { DataTable } from '@/components/dashboard/DataTable';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useDrillDown } from '@/hooks/useDrillDown';
import { DollarSign, Percent, Clock, Users } from 'lucide-react';

// Sample payroll KPIs
const payrollKPIs = [
  { title: 'Total Payroll', value: '$89,560', icon: <DollarSign size={20} />, trend: -2.1, trendLabel: 'vs last month' },
  { title: 'Avg. Salary', value: '$5,650', icon: <DollarSign size={20} />, trend: 1.5, trendLabel: 'vs last month' },
  { title: 'Overtime Hours', value: '245', icon: <Clock size={20} />, trend: 8.2, trendLabel: 'vs last month' },
  { title: 'Bonus Payout', value: '$12,450', icon: <Percent size={20} />, trend: 15.3, trendLabel: 'vs last month' },
];

// Sample data for payroll by department
const departmentPayrollData: BarChartData[] = [
  { name: 'IT', value: 32500 },
  { name: 'Finance', value: 18900 },
  { name: 'Marketing', value: 15800 },
  { name: 'Operations', value: 22360 },
];

// Sample drill-down data for IT department
const itPayrollData: BarChartData[] = [
  { name: 'Developers', value: 14200 },
  { name: 'QA Engineers', value: 5800 },
  { name: 'DevOps', value: 7500 },
  { name: 'UI/UX Designers', value: 5000 },
];

// Sample payroll trend data
const payrollTrendData = [
  { month: 'Jan', amount: 78500 },
  { month: 'Feb', amount: 82300 },
  { month: 'Mar', amount: 81200 },
  { month: 'Apr', amount: 85600 },
  { month: 'May', amount: 84900 },
  { month: 'Jun', amount: 87300 },
  { month: 'Jul', amount: 89560 },
];

// Sample employee payroll data
const employeePayrollData = [
  { id: 1, name: 'John Smith', department: 'IT', position: 'Senior Developer', salary: 8500, overtime: 12, bonus: 1500 },
  { id: 2, name: 'Emily Johnson', department: 'IT', position: 'UI/UX Designer', salary: 6200, overtime: 0, bonus: 800 },
  { id: 3, name: 'Michael Brown', department: 'Finance', position: 'Financial Analyst', salary: 5800, overtime: 8, bonus: 700 },
  { id: 4, name: 'Sarah Wilson', department: 'Marketing', position: 'Marketing Manager', salary: 6500, overtime: 0, bonus: 1200 },
  { id: 5, name: 'David Lee', department: 'Operations', position: 'Operations Coordinator', salary: 4900, overtime: 15, bonus: 500 },
  { id: 6, name: 'Jennifer Garcia', department: 'IT', position: 'QA Engineer', salary: 5500, overtime: 10, bonus: 600 },
  { id: 7, name: 'Robert Martinez', department: 'IT', position: 'DevOps Engineer', salary: 7200, overtime: 5, bonus: 900 },
  { id: 8, name: 'Lisa Anderson', department: 'Marketing', position: 'Content Strategist', salary: 5100, overtime: 0, bonus: 500 },
];

const PayrollPage = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Set up drill-down for department payroll chart
  const { 
    currentData: deptData, 
    currentLabel: deptLabel, 
    drillDown: drillDownDept, 
    drillUp: drillUpDept, 
    isTopLevel: isDeptTopLevel
  } = useDrillDown<BarChartData>(departmentPayrollData);
  
  // Handle department drill-down logic
  const handleDeptClick = (data: BarChartData) => {
    if (isDeptTopLevel) {
      if (data.name === 'IT') {
        drillDownDept('IT Department Payroll', itPayrollData);
      } else {
        // Simulate drill-down for other departments
        drillDownDept(`${data.name} Department Payroll`, [
          { name: 'Role 1', value: Math.round(data.value * 0.4) },
          { name: 'Role 2', value: Math.round(data.value * 0.3) },
          { name: 'Role 3', value: Math.round(data.value * 0.2) },
          { name: 'Role 4', value: Math.round(data.value * 0.1) },
        ]);
      }
    }
  };

  // Filter options
  const timeFilterOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ];
  
  const departmentFilterOptions = [
    { label: 'All Departments', value: 'all' },
    { label: 'IT', value: 'IT' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Operations', value: 'Operations' },
  ];

  // Table columns configuration
  const payrollColumns = [
    { header: 'Employee', accessor: 'name' as keyof typeof employeePayrollData[0], sortable: true },
    { header: 'Department', accessor: 'department' as keyof typeof employeePayrollData[0], sortable: true },
    { header: 'Position', accessor: 'position' as keyof typeof employeePayrollData[0], sortable: true },
    { 
      header: 'Salary', 
      accessor: 'salary' as keyof typeof employeePayrollData[0], 
      cell: (value: number) => `$${value.toLocaleString()}`,
      sortable: true 
    },
    { 
      header: 'Overtime (hrs)', 
      accessor: 'overtime' as keyof typeof employeePayrollData[0], 
      sortable: true 
    },
    { 
      header: 'Bonus', 
      accessor: 'bonus' as keyof typeof employeePayrollData[0], 
      cell: (value: number) => `$${value.toLocaleString()}`,
      sortable: true 
    },
    { 
      header: 'Total', 
      accessor: 'id' as keyof typeof employeePayrollData[0], 
      cell: (_: any, item: typeof employeePayrollData[0]) => {
        const total = item.salary + (item.overtime * (item.salary / 160) * 1.5) + item.bonus;
        return `$${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      },
      sortable: false
    },
  ];

  // Handle table row click
  const handleEmployeeClick = (row: typeof employeePayrollData[0]) => {
    console.log('Employee clicked:', row);
    // In a real app, this would open a detailed employee profile
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payroll Analytics</h1>
          <p className="text-muted-foreground mt-1">Track payroll expenditures and employee compensation</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {payrollKPIs.map((kpi, index) => (
            <DashboardCard
              key={index}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              trendLabel={kpi.trendLabel}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Department Payroll Chart with Drill Down */}
          <ChartContainer
            title={isDeptTopLevel ? "Payroll by Department" : deptLabel}
            description="Click on bars to see detailed role breakdown"
            isDrilledDown={!isDeptTopLevel}
            onDrillUp={drillUpDept}
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
              data={deptData} 
              onBarClick={handleDeptClick}
              showGrid={true}
              barDataKey="value"
              dataKey="Amount ($)"
            />
          </ChartContainer>

          {/* Payroll Trend Line Chart */}
          <ChartContainer
            title="Payroll Trend"
            description="Monthly payroll expenditure"
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
              data={payrollTrendData}
              lines={[
                { dataKey: 'amount', color: '#3b82f6', name: 'Payroll Amount' },
              ]}
              showLegend={true}
              xAxisDataKey="month"
              onPointClick={(data, index) => console.log('Point clicked:', data, index)}
            />
          </ChartContainer>
        </div>

        {/* Employee Payroll Table */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Employee Payroll Details</h2>
          <div className="mb-4">
            <CustomSelect
              label="Filter by Department"
              options={departmentFilterOptions}
              value={departmentFilter}
              onChange={setDepartmentFilter}
              className="w-60"
            />
          </div>
          <DataTable
            data={employeePayrollData.filter(e => departmentFilter === 'all' || e.department === departmentFilter)}
            columns={payrollColumns}
            onRowClick={handleEmployeeClick}
            searchable={true}
            pagination={true}
            itemsPerPage={5}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
