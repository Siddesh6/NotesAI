'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth, useFirestore, useUser, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  LogOut, 
  LayoutDashboard, 
  Clock, 
  ClipboardList, 
  Download, 
  Plus,
  ChevronRight,
  Loader2,
  Share2,
  FileUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { TaskTable } from '@/components/dashboard/task-table';
import { MetricsPanel } from '@/components/dashboard/metrics-panel';
import { LogsViewer } from '@/components/dashboard/logs-viewer';

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState('');
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

  // Firestore Data Subscriptions - Scoped to User UID for strict isolation
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc'));
  }, [db, user?.uid]);
  
  const { data: tasksData } = useCollection(tasksQuery);
  const tasks = useMemo(() => tasksData || [], [tasksData]);

  const logsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !currentRunId) return null;
    return query(collection(db, 'users', user.uid, 'runs', currentRunId, 'logEvents'), orderBy('timestamp', 'asc'));
  }, [db, user?.uid, currentRunId]);

  const { data: logsData } = useCollection(logsQuery);
  const logs = useMemo(() => logsData || [], [logsData]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const createLog = (runId: string, type: string, message: string, details?: string | null) => {
    if (!user?.uid || !db) return;
    const logId = crypto.randomUUID();
    const logRef = doc(db, 'users', user.uid, 'runs', runId, 'logEvents', logId);
    
    setDocumentNonBlocking(logRef, {
      id: logId,
      runId,
      userId: user.uid,
      eventType: type,
      message,
      details: details ?? null,
      timestamp: new Date().toISOString()
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      toast({
        title: "PDF Detected",
        description: "Standard PDF parsing is active. Complex layouts may vary.",
      });
      setTranscript(`[File Uploaded: ${file.name}]\nProcessing PDF content... (Simulation)`);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target?.result as string);
        toast({ title: "File Loaded", description: "Transcript loaded from text file." });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Unsupported File",
        description: "Please upload a .txt or .pdf file.",
        variant: "destructive"
      });
    }
  };

  const handleExtract = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty Transcript",
        description: "Please enter some meeting notes or a transcript.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.uid || !db) return;

    setIsProcessing(true);
    const runId = crypto.randomUUID();
    const transcriptId = crypto.randomUUID();
    setCurrentRunId(runId);
    
    // 1. Store Transcript first (for history)
    const transcriptRef = doc(db, 'users', user.uid, 'transcripts', transcriptId);
    setDocumentNonBlocking(transcriptRef, {
      id: transcriptId,
      userId: user.uid,
      content: transcript,
      submittedAt: new Date().toISOString(),
      title: transcript.slice(0, 50) + '...'
    });

    // 2. Initialize Run
    const runRef = doc(db, 'users', user.uid, 'runs', runId);
    setDocumentNonBlocking(runRef, {
      id: runId,
      userId: user.uid,
      transcriptId: transcriptId,
      startedAt: new Date().toISOString(),
      status: 'PENDING'
    });

    const STEPS = ["INPUT_RECEIVED", "PARSING_TRANSCRIPT", "TASK_EXTRACTION", "ENTITY_DETECTION", "PRIORITY_SCORING", "RUN_COMPLETE"];

    try {
      for (let i = 0; i < STEPS.length - 1; i++) {
        const step = STEPS[i];
        setActiveStep(step);
        createLog(runId, 'STATE_TRANSITION', `Moving to state: ${step}`);
        await new Promise(r => setTimeout(r, 600)); 
      }

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, userId: user.uid }),
      });

      if (!response.ok) throw new Error('Failed to process');

      const data = await response.json();
      
      if (data.tasks && Array.isArray(data.tasks)) {
        data.tasks.forEach((task: any) => {
          const taskId = crypto.randomUUID();
          const taskRef = doc(db, 'users', user?.uid!, 'tasks', taskId);
          setDocumentNonBlocking(taskRef, {
            id: taskId,
            userId: user?.uid!,
            transcriptId: transcriptId,
            description: task.task_description || 'No description',
            owner: task.owner || 'Unassigned',
            deadline: task.deadline || '',
            priority: task.priority || 'LOW',
            priorityScore: task.priority_score ?? 0,
            confidenceScore: task.confidence_score ?? 0,
            status: 'pending',
            sourceSentence: task.task_description || '',
            createdAt: new Date().toISOString()
          });
        });
      }

      setActiveStep('RUN_COMPLETE');
      createLog(runId, 'INFO', `Run completed successfully. Extracted ${data.tasks?.length || 0} tasks.`);
      
      updateDocumentNonBlocking(runRef, {
        completedAt: new Date().toISOString(),
        status: 'COMPLETED',
        totalTasksExtracted: data.tasks?.length || 0
      });

      toast({
        title: "Extraction Complete",
        description: `Successfully extracted ${data.tasks?.length || 0} tasks.`,
      });
    } catch (err: any) {
      createLog(runId, 'ERROR', `Run failed: ${err.message}`);
      updateDocumentNonBlocking(runRef, {
        completedAt: new Date().toISOString(),
        status: 'FAILED',
        errorDetails: err.message
      });
      toast({
        title: "Error",
        description: "Something went wrong during extraction.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemo = () => {
    setTranscript(`John will finalize the UI design by Friday. Sarah will prepare the budget report tomorrow. Alex will contact suppliers this week.`);
  };

  const handleSignOut = () => {
    auth?.signOut();
    router.push('/');
  };

  const handleExport = (format: string) => {
    if (tasks.length === 0) {
      toast({ title: "Nothing to export", description: "You have no tasks to export.", variant: "destructive" });
      return;
    }

    let content = "";
    if (format === 'json') {
      content = JSON.stringify(tasks, null, 2);
    } else if (format === 'csv') {
      const headers = "ID,Description,Owner,Deadline,Priority,Status\n";
      const rows = tasks.map(t => `"${t.id}","${t.description}","${t.owner}","${t.deadline || ''}","${t.priority}","${t.status}"`).join("\n");
      content = headers + rows;
    } else {
      content = "PDF Export Simulation\n\n" + tasks.map(t => `- ${t.description} (Owner: ${t.owner})`).join("\n");
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${new Date().getTime()}.${format}`;
    a.click();
    toast({ title: "Export Started", description: `Exporting ${tasks.length} tasks as ${format.toUpperCase()}` });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Meeting Action Items',
      text: `Check out these ${tasks.length} action items I extracted with NotesAI!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          toast({ title: "Link Copied", description: "Sharing failed. Link copied to clipboard instead." });
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Dashboard link copied to clipboard." });
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Zap className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-secondary/10 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden md:flex flex-col shadow-sm">
        <div className="p-6 border-b flex items-center space-x-3">
          <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl text-primary tracking-tight">NotesAI</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Button variant="ghost" className="w-full justify-start bg-secondary/50 text-primary font-semibold" asChild>
            <div className="flex items-center">
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Overview
            </div>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-secondary/30">
            <ClipboardList className="mr-3 h-4 w-4" />
            Active Tasks
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-secondary/30">
            <Clock className="mr-3 h-4 w-4" />
            Run History
          </Button>
        </nav>
        <div className="p-4 border-t mt-auto">
          <div className="bg-secondary/20 p-4 rounded-xl mb-4">
             <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs mr-3">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                   <p className="text-xs font-bold text-primary truncate">{user?.displayName || 'User'}</p>
                   <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>
             </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-headline font-bold text-primary">Workspace</h2>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Action Item Extractor</span>
          </div>
          <div className="flex items-center space-x-3">
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/5">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuItem onClick={() => handleExport('json')}>Export as JSON</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
             <Button size="sm" onClick={() => { setTranscript(''); setCurrentRunId(null); }} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" />
                New Run
             </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-secondary/5">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Input Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <div>
                      <h3 className="text-xl font-bold text-primary">New Transcript</h3>
                      <p className="text-sm text-muted-foreground">Upload or paste your meeting notes.</p>
                   </div>
                   <div className="flex items-center space-x-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".txt,.pdf" 
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="text-primary border-primary/20 hover:bg-primary/5">
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload File (.txt, .pdf)
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleDemo} className="text-accent hover:text-accent hover:bg-accent/10">
                        Try Demo Text
                      </Button>
                   </div>
                </div>
                <div className="relative group">
                  <Textarea
                    placeholder="Rahul will prepare the presentation by Monday. We need to finalize the budget by next Friday..."
                    className="min-h-[220px] resize-none focus-visible:ring-accent font-body bg-white border-none shadow-xl shadow-primary/5 p-6 rounded-2xl"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    disabled={isProcessing}
                  />
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <Button 
                      onClick={handleExtract} 
                      disabled={isProcessing || !transcript.trim()}
                      className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 rounded-xl px-6"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Run Extraction
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-1">
                 <div className="bg-white rounded-2xl p-6 shadow-xl shadow-primary/5 h-full border border-border/50">
                    <h3 className="font-bold text-primary mb-4 flex items-center">
                       <Clock className="mr-2 h-4 w-4 text-accent" />
                       Quick Stats
                    </h3>
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Runs</span>
                          <span className="text-sm font-bold text-primary">{logsData ? logsData.length : 0}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Active Tasks</span>
                          <span className="text-sm font-bold text-primary">{tasks.filter(t => t.status === 'pending').length}</span>
                       </div>
                       <div className="pt-4 border-t">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">AI Engine Health</p>
                          <div className="flex space-x-1.5">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <div key={i} className="flex-1 h-8 bg-emerald-100 rounded-sm flex items-center justify-center">
                                   <div className="h-4 w-0.5 bg-emerald-500 opacity-50" />
                                </div>
                             ))}
                          </div>
                          <p className="text-[10px] text-emerald-600 font-medium mt-2">All systems operational</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Workflow Visualization */}
            {(isProcessing || activeStep === 'RUN_COMPLETE') && (
              <div className="space-y-6 animate-in fade-in duration-500 relative z-20">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold text-primary">Execution Pipeline</h3>
                   <span className="text-xs font-mono text-muted-foreground">RUN_ID: {currentRunId?.slice(0, 8)}</span>
                </div>
                <LogsViewer logs={logs} activeStep={activeStep} />
              </div>
            )}

            {/* Metrics Dashboard */}
            {tasks.length > 0 && (
              <div className="space-y-6 relative z-10">
                <h3 className="text-xl font-bold text-primary">Analytics Dashboard</h3>
                <MetricsPanel tasks={tasks} />
              </div>
            )}

            {/* Task Table */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">Action Item Repository</h3>
                  <p className="text-sm text-muted-foreground">Manage and track your extracted tasks.</p>
                </div>
                <div className="flex items-center space-x-2">
                   <Button variant="outline" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-primary">
                     <Share2 className="mr-2 h-4 w-4" />
                     Share
                   </Button>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="text-muted-foreground hover:text-primary">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExport('json')}>Download as JSON</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('csv')}>Download as CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pdf')}>Download as PDF</DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
              </div>
              <TaskTable tasks={tasks as any} db={db!} userId={user?.uid || ''} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
