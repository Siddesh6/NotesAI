
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Task {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  status: 'pending' | 'completed';
}

interface MetricsPanelProps {
  tasks: Task[];
}

export function MetricsPanel({ tasks }: MetricsPanelProps) {
  const priorityData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    tasks.forEach(t => counts[t.priority]++);
    return [
      { name: 'High', value: counts.HIGH, color: 'hsl(var(--destructive))' },
      { name: 'Medium', value: counts.MEDIUM, color: 'hsl(var(--accent))' },
      { name: 'Low', value: counts.LOW, color: 'hsl(var(--chart-3))' },
    ];
  }, [tasks]);

  const completionData = useMemo(() => {
    const counts = { completed: 0, pending: 0 };
    tasks.forEach(t => counts[t.status]++);
    return [
      { name: 'Completed', value: counts.completed, fill: 'hsl(var(--chart-3))' },
      { name: 'Pending', value: counts.pending, fill: 'hsl(var(--muted-foreground))' },
    ];
  }, [tasks]);

  const avgConfidence = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round(tasks.reduce((acc, t) => acc + t.confidenceScore, 0) / tasks.length);
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Task Priority Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-primary">{tasks.length}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-accent">{avgConfidence}%</p>
              <p className="text-xs text-muted-foreground">Avg. Confidence</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Overall Progress</span>
              <span>{tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
               <div 
                 className="h-full bg-chart-3 transition-all duration-500" 
                 style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}%` }}
               />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
