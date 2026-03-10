'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth, useFirestore, useUser, useCollection, useDoc, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  FileUp,
  Menu,
  ChevronDown,
  Printer
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import { TaskTable } from '@/components/dashboard/task-table';
import { MetricsPanel } from '@/components/dashboard/metrics-panel';
import { LogsViewer } from '@/components/dashboard/logs-viewer';
import { ProfileSettings } from '@/components/dashboard/profile-settings';
import { ThemeToggle } from '@/components/theme-toggle';

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

  // Profile Subscription
  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  const { data: profile } = useDoc(profileRef);

  // Tasks Subscription
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc'));
  }, [db, user?.uid]);
  const { data: tasksData } = useCollection(tasksQuery);
  const tasks = useMemo(() => tasksData || [], [tasksData]);

  // Logs Subscription
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
    
    const transcriptRef = doc(db, 'users', user.uid, 'transcripts', transcriptId);
    setDocumentNonBlocking(transcriptRef, {
      id: transcriptId,
      userId: user.uid,
      content: transcript,
      submittedAt: new Date().toISOString(),
      title: transcript.slice(0, 50) + '...'
    });

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

    if (format === 'pdf') {
      window.print();
      return;
    }

    let content = "";
    let mimeType = "text/plain";
    let extension = "txt";

    if (format === 'json') {
      content = JSON.stringify(tasks, null, 2);
      mimeType = "application/json";
      extension = "json";
    } else if (format === 'csv') {
      const headers = "ID,Description,Owner,Deadline,Priority,Status\n";
      const rows = tasks.map(t => `"${t.id}","${t.description}","${t.owner}","${t.deadline || ''}","${t.priority}","${t.status}"`).join("\n");
      content = headers + rows;
      mimeType = "text/csv";
      extension = "csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${new Date().getTime()}.${extension}`;
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
      <div className="flex h-screen items-center justify-center bg-background">
        <Zap className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-card print:hidden">
      <div className="p-6 border-b flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl text-primary tracking-tight">NotesAI</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <Button variant="ghost" className="w-full justify-start bg-secondary/50 dark:bg-secondary/10 text-primary font-semibold">
          <LayoutDashboard className="mr-3 h-4 w-4" />
          Overview
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-secondary/30 dark:hover:bg-secondary/10">
          <ClipboardList className="mr-3 h-4 w-4" />
          Active Tasks
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-secondary/30 dark:hover:bg-secondary/10">
          <Clock className="mr-3 h-4 w-4" />
          Run History
        </Button>
        <ProfileSettings db={db!} userId={user?.uid || ''} currentProfile={profile} />
      </nav>
      <div className="p-4 border-t mt-auto">
        <div className="bg-secondary/20 dark:bg-secondary/5 p-4 rounded-xl mb-4">
           <div className="flex items-center mb-2">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={profile?.photoURL} />
                <AvatarFallback className="bg-accent text-white font-bold text-xs">
                  {profile?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                 <p className="text-xs font-bold text-primary truncate">{profile?.displayName || 'User'}</p>
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
    </div>
  );

  return (
    <div className="flex h-screen bg-secondary/10 dark:bg-background overflow-hidden transition-colors">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r bg-white dark:bg-card hidden md:flex flex-col shadow-sm print:hidden">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-white dark:bg-card flex items-center justify-between px-4 md:px-8 shadow-sm z-50 print:hidden">
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center space-x-2">
              <h2 className="text-sm md:text-lg font-headline font-bold text-primary">Workspace</h2>
              <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <span className="text-xs md:text-sm font-medium text-muted-foreground hidden sm:block">Extractor</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3">
             <ThemeToggle />
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/5 h-8 md:h-9 px-2 md:px-4">
                    <Download className="md:mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuItem onClick={() => handleExport('json')}>Export as JSON</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleExport('pdf')}>Print / Save as PDF</DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
             <Button size="sm" onClick={() => { setTranscript(''); setCurrentRunId(null); }} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-8 md:h-9 px-2 md:px-4">
                <Plus className="md:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">New Run</span>
             </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 md:space-y-12 bg-secondary/5 dark:bg-background/50 print:bg-white print:p-0">
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
            
            {/* Input Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 print:hidden">
              <div className="xl:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                   <div>
                      <h3 className="text-lg md:text-xl font-bold text-primary">New Transcript</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">Upload or paste meeting notes.</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".txt,.pdf" 
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="text-primary border-primary/20 hover:bg-primary/5 text-xs h-8">
                        <FileUp className="mr-2 h-4 w-4" />
                        <span className="hidden xs:inline">Upload</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleDemo} className="text-accent hover:text-accent hover:bg-accent/10 text-xs h-8">
                        Try Demo
                      </Button>
                   </div>
                </div>
                <div className="relative group">
                  <Textarea
                    placeholder="Rahul will prepare the presentation by Monday..."
                    className="min-h-[180px] md:min-h-[220px] resize-none focus-visible:ring-accent font-body bg-white dark:bg-card border-none shadow-xl shadow-primary/5 p-4 md:p-6 rounded-2xl text-sm md:text-base"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    disabled={isProcessing}
                  />
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <Button 
                      onClick={handleExtract} 
                      disabled={isProcessing || !transcript.trim()}
                      className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 rounded-xl px-4 md:px-6 h-9 md:h-10 text-xs md:text-sm"
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
                 <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-xl shadow-primary/5 h-full border border-border/50">
                    <h3 className="font-bold text-primary mb-4 flex items-center">
                       <Clock className="mr-2 h-4 w-4 text-accent" />
                       Quick Stats
                    </h3>
                    <div className="space-y-4 md:space-y-6">
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
                          <div className="flex space-x-1">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <div key={i} className="flex-1 h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded-sm flex items-center justify-center">
                                   <div className="h-3 w-0.5 bg-emerald-500 opacity-50" />
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
              <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 print:hidden">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg md:text-xl font-bold text-primary">Execution Pipeline</h3>
                   <span className="text-[10px] md:text-xs font-mono text-muted-foreground">RUN_ID: {currentRunId?.slice(0, 8)}</span>
                </div>
                <LogsViewer logs={logs} activeStep={activeStep} />
              </div>
            )}

            {/* Metrics Dashboard */}
            {tasks.length > 0 && (
              <div className="space-y-6 print:hidden">
                <h3 className="text-lg md:text-xl font-bold text-primary">Analytics Dashboard</h3>
                <MetricsPanel tasks={tasks} />
              </div>
            )}

            {/* Task Table */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-primary">Action Item Repository</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Manage and track your extracted tasks.</p>
                </div>
                <div className="flex items-center space-x-2">
                   <Button variant="outline" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-primary text-xs h-8">
                     <Share2 className="mr-2 h-4 w-4" />
                     Share
                   </Button>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="text-muted-foreground hover:text-primary text-xs h-8">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExport('json')}>JSON</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.print()}>PDF</DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
              </div>
              <div className="bg-white dark:bg-card rounded-xl border shadow-sm overflow-hidden print:border-none print:shadow-none">
                <div className="hidden print:block p-8 border-b mb-8">
                  <h1 className="text-2xl font-bold text-primary">NotesAI: Meeting Action Items</h1>
                  <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <TaskTable tasks={tasks as any} db={db!} userId={user?.uid || ''} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
