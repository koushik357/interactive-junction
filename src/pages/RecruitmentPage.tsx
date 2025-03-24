
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { ChartContainer } from '@/components/dashboard/ChartContainer';
import { BarChart, BarChartData } from '@/components/charts/BarChart';
import { DataTable } from '@/components/dashboard/DataTable';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useDrillDown } from '@/hooks/useDrillDown';
import { Users, UserPlus, UserMinus, Clock } from 'lucide-react';

// Sample recruitment KPIs
const recruitmentKPIs = [
  { title: 'Total Hires', value: '125', icon: <UserPlus size={20} />, trend: 5.3, trendLabel: 'vs last month' },
  { title: 'Open Positions', value: '48', icon: <Users size={20} />, trend: -3.2, trendLabel: 'vs last month' },
  { title: 'Attrition Rate', value: '3.2%', icon: <UserMinus size={20} />, trend: -0.5, trendLabel: 'vs last month' },
  { title: 'Avg. Time to Hire', value: '22 days', icon: <Clock size={20} />, trend: -2.1, trendLabel: 'vs last month' },
];

// Sample data for recruitment by department
const departmentData: BarChartData[] = [
  { name: 'IT', value: 42 },
  { name: 'Finance', value: 28 },
  { name: 'Marketing', value: 23 },
  { name: 'Operations', value: 32 },
];

// Sample drill-down data
const itRoleData: BarChartData[] = [
  { name: 'Developers', value: 18 },
  { name: 'QA Engineers', value: 8 },
  { name: 'DevOps', value: 10 },
  { name: 'UI/UX Designers', value: 6 },
];

// Sample candidates data
const candidatesData = [
  { id: 1, name: 'John Smith', role: 'Senior Developer', department: 'IT', status: 'Hired', hireDate: '2023-05-15' },
  { id: 2, name: 'Emily Johnson', role: 'UI/UX Designer', department: 'IT', status: 'In Process', hireDate: '-' },
  { id: 3, name: 'Michael Brown', role: 'Financial Analyst', department: 'Finance', status: 'Hired', hireDate: '2023-04-23' },
  { id: 4, name: 'Sarah Wilson', role: 'Marketing Manager', department: 'Marketing', status: 'Hired', hireDate: '2023-06-10' },
  { id: 5, name: 'David Lee', role: 'Operations Coordinator', department: 'Operations', status: 'Rejected', hireDate: '-' },
  { id: 6, name: 'Jennifer Garcia', role: 'QA Engineer', department: 'IT', status: 'In Process', hireDate: '-' },
  { id: 7, name: 'Robert Martinez', role: 'DevOps Engineer', department: 'IT', status: 'Hired', hireDate: '2023-05-05' },
  { id: 8, name: 'Lisa Anderson', role: 'Content Strategist', department: 'Marketing', status: 'In Process', hireDate: '-' },
];

const RecruitmentPage = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Set up drill-down for department chart
  const { 
    currentData: deptData, 
    currentLabel: deptLabel, 
    drillDown: drillDownDept, 
    drillUp: drillUpDept, 
    isTopLevel: isDeptTopLevel
  } = useDrillDown<BarChartData>(departmentData);
  
  // Handle department drill-down logic
  const handleDeptClick = (data: BarChartData) => {
    if (isDeptTopLevel) {
      if (data.name === 'IT') {
        drillDownDept('IT Roles', itRoleData);
      } else {
        // Simulate drill-down for other departments
        drillDownDept(`${data.name} Roles`, [
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
  
  const statusFilterOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Hired', value: 'hired' },
    { label: 'In Process', value: 'in-process' },
    { label: 'Rejected', value: 'rejected' },
  ];

  // Table columns configuration
  const candidatesColumns = [
    { header: 'Name', accessor: 'name' as keyof typeof candidatesData[0], sortable: true },
    { header: 'Role', accessor: 'role' as keyof typeof candidatesData[0], sortable: true },
    { header: 'Department', accessor: 'department' as keyof typeof candidatesData[0], sortable: true },
    { 
      header: 'Status', 
      accessor: 'status' as keyof typeof candidatesData[0], 
      cell: (value: string) => {
        let color = 'bg-gray-100 text-gray-800';
        if (value === 'Hired') color = 'bg-green-100 text-green-800';
        if (value === 'In Process') color = 'bg-blue-100 text-blue-800';
        if (value === 'Rejected') color = 'bg-red-100 text-red-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {value}
          </span>
        );
      },
      sortable: true 
    },
    { header: 'Hire Date', accessor: 'hireDate' as keyof typeof candidatesData[0], sortable: true },
  ];

  // Handle table row click
  const handleCandidateClick = (row: typeof candidatesData[0]) => {
    console.log('Candidate clicked:', row);
    // In a real app, this would open a detailed candidate profile
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Recruitment Analytics</h1>
          <p className="text-muted-foreground mt-1">Track hiring metrics and recruitment performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recruitmentKPIs.map((kpi, index) => (
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

        {/* Department Chart with Drill Down */}
        <div className="mt-6">
          <ChartContainer
            title={isDeptTopLevel ? "Recruitment by Department" : deptLabel}
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
            />
          </ChartContainer>
        </div>

        {/* Candidates Table */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Candidates</h2>
          <div className="mb-4">
            <CustomSelect
              label="Filter by Status"
              options={statusFilterOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
          </div>
          <DataTable
            data={candidatesData.filter(c => statusFilter === 'all' || c.status.toLowerCase() === statusFilter)}
            columns={candidatesColumns}
            onRowClick={handleCandidateClick}
            searchable={true}
            pagination={true}
            itemsPerPage={5}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruitmentPage;
