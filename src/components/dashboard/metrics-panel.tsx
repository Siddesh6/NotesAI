
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface Task {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  status: 'pending' | 'completed';
}

interface MetricsPanelProps {
  tasks: Task[];
}

const priorityConfig = {
  high: {
    label: "High",
    color: "hsl(var(--destructive))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--accent))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const completionConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-3))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export function MetricsPanel({ tasks }: MetricsPanelProps) {
  const priorityData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    tasks.forEach(t => {
      if (counts[t.priority] !== undefined) {
        counts[t.priority]++;
      }
    });
    return [
      { priority: 'high', label: 'High', value: counts.HIGH, fill: "var(--color-high)" },
      { priority: 'medium', label: 'Medium', value: counts.MEDIUM, fill: "var(--color-medium)" },
      { priority: 'low', label: 'Low', value: counts.LOW, fill: "var(--color-low)" },
    ];
  }, [tasks]);

  const completionData = useMemo(() => {
    const counts = { completed: 0, pending: 0 };
    tasks.forEach(t => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    return [
      { status: 'completed', value: counts.completed, fill: "var(--color-completed)" },
      { status: 'pending', value: counts.pending, fill: "var(--color-pending)" },
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
          <ChartContainer config={priorityConfig}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <ChartContainer config={completionConfig}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="status"
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ChartContainer>
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
