import React from 'react';
import { Users, Building2, Globe, AppWindow, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import DataCard from '@/components/DataCard';
import { trpc } from '@/lib/trpc';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useLocation } from 'wouter';

const Dashboard = () => {
  const { data: people = [] } = trpc.people.list.useQuery();
  const { data: departments = [] } = trpc.departments.list.useQuery();
  const { data: websites = [] } = trpc.websites.list.useQuery();
  const { data: applications = [] } = trpc.applications.list.useQuery();
  const [, setLocation] = useLocation();

  // Calculate metrics
  const totalPeople = people.length;
  const totalDepartments = departments.length;
  const totalWebsites = websites.length;
  const totalApps = applications.length;

  const accessibilityIssues = websites.filter(w => !w.accessibilityReviewed || (w.siteimproveScore && w.siteimproveScore < 80)).length;
  const pendingReviews = websites.filter(w => !w.manualReview).length;

  const chartData = [
    { name: 'People', value: totalPeople, color: '#3b82f6' }, // Blue-500
    { name: 'Depts', value: totalDepartments, color: '#f97316' }, // Orange-500
    { name: 'Websites', value: totalWebsites, color: '#10b981' }, // Emerald-500
    { name: 'Apps', value: totalApps, color: '#8b5cf6' }, // Violet-500
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of UTMB IT Assets and Accessibility Compliance.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total People"
          value={totalPeople}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          description="Active personnel"
          color="text-blue-500"
          onClick={() => setLocation('/people')}
        />
        <DataCard
          title="Departments"
          value={totalDepartments}
          icon={Building2}
          description="Across organization"
          color="text-orange-500"
          onClick={() => setLocation('/departments')}
        />
        <DataCard
          title="Websites"
          value={totalWebsites}
          icon={Globe}
          trend={{ value: 2, isPositive: true }}
          description="Public & Internal"
          color="text-emerald-500"
          onClick={() => setLocation('/websites')}
        />
        <DataCard
          title="Applications"
          value={totalApps}
          icon={AppWindow}
          description="Managed software"
          color="text-violet-500"
          onClick={() => setLocation('/applications')}
        />
      </div>

      {/* Secondary Metrics & Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Section */}
        <div className="col-span-4 glass-panel rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Asset Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Items */}
        <div className="col-span-3 space-y-4">
          <div className="glass-panel rounded-xl p-6 h-full">
            <h3 className="font-semibold text-lg mb-4">Compliance Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors" onClick={() => setLocation('/websites')}>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">Accessibility Issues</p>
                    <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                  </div>
                </div>
                <span className="font-bold text-red-600">{accessibilityIssues}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-colors" onClick={() => setLocation('/websites')}>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-sm">Pending Reviews</p>
                    <p className="text-xs text-muted-foreground">Manual audit required</p>
                  </div>
                </div>
                <span className="font-bold text-yellow-700">{pendingReviews}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">System Status</p>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                  </div>
                </div>
                <span className="font-bold text-green-700">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
