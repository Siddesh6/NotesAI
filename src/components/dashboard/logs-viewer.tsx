'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Loader2, 
  AlertCircle,
  Terminal,
  ChevronRight
} from 'lucide-react';

interface LogEvent {
  id: string;
  eventType: string;
  message: string;
  timestamp: string;
  details?: string;
}

interface LogsViewerProps {
  logs: LogEvent[];
  activeStep: string;
}

const STEPS = [
  "INPUT_RECEIVED",
  "PARSING_TRANSCRIPT",
  "TASK_EXTRACTION",
  "ENTITY_DETECTION",
  "PRIORITY_SCORING",
  "RUN_COMPLETE"
];

export function LogsViewer({ logs, activeStep }: LogsViewerProps) {
  const currentStepIndex = STEPS.indexOf(activeStep);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[300px] lg:h-[400px]">
      {/* Visual Workflow */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center">
          <Terminal className="mr-2 h-4 w-4" />
          Workflow Pipeline
        </h3>
        <div className="flex-1 space-y-4">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex || activeStep === 'RUN_COMPLETE';
            const isActive = activeStep === step && activeStep !== 'RUN_COMPLETE';
            
            return (
              <div key={step} className="flex items-center group">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                  isCompleted ? "bg-accent border-accent text-white" : 
                  isActive ? "border-accent text-accent animate-pulse" : 
                  "border-muted text-muted-foreground"
                )}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : 
                   isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : 
                   <span className="text-[10px] font-bold">{idx + 1}</span>}
                </div>
                <div className="ml-4 flex-1">
                  <p className={cn(
                    "text-xs font-bold uppercase tracking-wide",
                    isCompleted ? "text-primary" : isActive ? "text-accent" : "text-muted-foreground"
                  )}>
                    {step.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Logs */}
      <div className="lg:col-span-2 bg-slate-950 text-slate-300 p-4 rounded-xl shadow-lg font-mono text-xs flex flex-col min-h-[300px]">
        <div className="flex items-center justify-between mb-3 px-2 border-b border-slate-800 pb-2">
          <span className="flex items-center text-slate-500">
            <div className="flex space-x-1.5 mr-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            ENGINE_LOGS_V1.0
          </span>
          <span className="text-slate-500">{new Date().toLocaleDateString()}</span>
        </div>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-2 pb-4">
            {logs.length === 0 ? (
              <p className="text-slate-600 animate-pulse italic">Waiting for process initiation...</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-4 group hover:bg-slate-900/50 p-1 rounded transition-colors">
                  <span className="text-slate-600 whitespace-nowrap">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className={cn(
                    "font-bold min-w-[120px]",
                    log.eventType === 'ERROR' ? "text-red-400" : 
                    log.eventType === 'STATE_TRANSITION' ? "text-cyan-400" : 
                    "text-emerald-400"
                  )}>
                    {log.eventType}
                  </span>
                  <span className="flex-1 break-words">
                    {log.message}
                    {log.details && (
                      <span className="block text-slate-500 mt-1 pl-4 border-l border-slate-800 italic">
                        {log.details}
                      </span>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
