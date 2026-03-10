
'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit2, 
  Trash2, 
  MoreVertical,
  User,
  Calendar,
  Share2,
  Download,
  ExternalLink,
  ClipboardCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, Firestore } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  description: string;
  owner: string;
  deadline?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  priorityScore: number;
  confidenceScore: number;
  status: 'pending' | 'completed';
  userId: string;
}

interface TaskTableProps {
  tasks: Task[];
  db: Firestore;
  userId: string;
}

export function TaskTable({ tasks, db, userId }: TaskTableProps) {
  const { toast } = useToast();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleToggleComplete = (taskId: string, currentStatus: string) => {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    updateDocumentNonBlocking(taskRef, {
      status: currentStatus === 'completed' ? 'pending' : 'completed',
      updatedAt: new Date().toISOString()
    });
  };

  const handleDelete = (taskId: string) => {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    deleteDocumentNonBlocking(taskRef);
    toast({ title: "Task Deleted", description: "The task has been removed from your repository." });
  };

  const handleCopyToTool = (task: Task, tool: 'Jira' | 'Trello') => {
    const content = tool === 'Jira' 
      ? `*Task:* ${task.description}\n*Owner:* ${task.owner}\n*Priority:* ${task.priority}\n*Deadline:* ${task.deadline || 'None'}`
      : `### ${task.description}\n- **Owner:** ${task.owner}\n- **Priority:** ${task.priority}\n- **Deadline:** ${task.deadline || 'None'}`;
    
    navigator.clipboard.writeText(content);
    toast({ 
      title: `Copied for ${tool}`, 
      description: `Task formatted for ${tool} import has been copied to clipboard.` 
    });
  };

  const handleExportSingle = (task: Task, format: 'json' | 'csv') => {
    let content = "";
    if (format === 'json') {
      content = JSON.stringify(task, null, 2);
    } else {
      content = "Description,Owner,Deadline,Priority,Status\n";
      content += `"${task.description}","${task.owner}","${task.deadline || ''}","${task.priority}","${task.status}"`;
    }
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-${task.id.slice(0, 5)}.${format}`;
    a.click();
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-white rounded-xl border border-dashed">
        <div className="bg-secondary p-4 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-primary/40" />
        </div>
        <p className="font-medium">No tasks found</p>
        <p className="text-sm">Run an extraction or upload a file to populate this list</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-secondary/30">
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Task Description</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className={cn("group transition-colors", task.status === 'completed' && "opacity-60 grayscale-[0.5]")}>
              <TableCell>
                <Checkbox 
                  checked={task.status === 'completed'} 
                  onCheckedChange={() => handleToggleComplete(task.id, task.status)}
                  className="rounded-full"
                />
              </TableCell>
              <TableCell className="font-medium max-w-md">
                <span className={cn(task.status === 'completed' && "line-through")}>
                  {task.description}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-3 w-3 text-muted-foreground" />
                  {task.owner}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-3 w-3" />
                  {task.deadline || 'No deadline'}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("font-bold uppercase text-[10px]", getPriorityColor(task.priority))}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="h-1.5 w-12 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent" 
                      style={{ width: `${task.confidenceScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-accent">
                    {task.confidenceScore}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer" 
                      onClick={() => {
                        navigator.clipboard.writeText(`Task: ${task.description}\nOwner: ${task.owner}\nPriority: ${task.priority}`);
                        toast({ title: "Task Details Copied" });
                      }}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleExportSingle(task, 'csv')}>
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyToTool(task, 'Jira')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Copy for Jira
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyToTool(task, 'Trello')}>
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Copy for Trello
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
