
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  User, 
  Calendar, 
  Clock, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type TaskStatus = 'pending' | 'completed';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

interface ActionItem {
  task_description: string;
  owner: string;
  deadline?: string;
  priority: Priority;
  priority_score: number;
  status?: TaskStatus;
}

const STEPS = [
  "INPUT_RECEIVED",
  "PARSING_TRANSCRIPT",
  "TASK_EXTRACTION",
  "ENTITY_DETECTION",
  "PRIORITY_SCORING",
  "RUN_COMPLETE"
];

export default function Dashboard() {
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<ActionItem[] | null>(null);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty Transcript",
        description: "Please enter some meeting notes or a transcript.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setResults(null);
    setStep(0);

    // Simulate state machine progress for UI effect
    const interval = setInterval(() => {
      setStep(s => {
        if (s < STEPS.length - 2) return s + 1;
        return s;
      });
    }, 800);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, userId: 'mock-user-123' }),
      });

      if (!response.ok) throw new Error('Failed to process');

      const data = await response.json();
      setResults(data.tasks);
      setStep(STEPS.length - 1);
      toast({
        title: "Success",
        description: `Extracted ${data.tasks.length} action items.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong during extraction.",
        variant: "destructive"
      });
    } finally {
      clearInterval(interval);
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden md:flex flex-col">
        <div className="p-6 border-b flex items-center space-x-2">
          <div className="bg-primary rounded-lg p-1.5">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl text-primary">NotesAI</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-primary bg-secondary/50" asChild>
            <div className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Extractor
            </div>
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-secondary/30">
            <ClipboardList className="mr-2 h-4 w-4" />
            My Tasks
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-secondary/30">
            <Clock className="mr-2 h-4 w-4" />
            History
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8">
          <h2 className="text-xl font-headline font-bold text-primary">Action Item Extractor</h2>
          <div className="flex items-center space-x-4">
             <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-secondary flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i + 10}/32/32`} alt="user" />
                  </div>
                ))}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {!results && (
            <Card className="max-w-4xl mx-auto border-none shadow-xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-accent" />
                  Submit Meeting Transcript
                </CardTitle>
                <CardDescription>
                  Paste your meeting notes or a full transcript below to extract structured tasks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Rahul will prepare the presentation by Monday. We need to finalize the budget by next Friday. Sarah is responsible for the vendor outreach..."
                  className="min-h-[300px] resize-none focus-visible:ring-accent font-body"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  disabled={isProcessing}
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-secondary/20 py-4">
                <p className="text-xs text-muted-foreground italic">
                  Tip: Specific mentions of names and dates improve accuracy.
                </p>
                <Button 
                  onClick={handleExtract} 
                  disabled={isProcessing || !transcript.trim()}
                  className="bg-accent hover:bg-accent/90"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Pipeline...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Extract Action Items
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {isProcessing && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Workflow State: {STEPS[step].replace(/_/g, ' ')}
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {Math.round((step / (STEPS.length - 1)) * 100)}%
                </span>
              </div>
              <Progress value={(step / (STEPS.length - 1)) * 100} className="h-2 bg-secondary" />
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {STEPS.map((s, i) => (
                  <div 
                    key={s} 
                    className={cn(
                      "text-[10px] p-2 rounded border text-center transition-all",
                      i <= step ? "bg-accent text-white border-accent" : "bg-white text-muted-foreground border-border"
                    )}
                  >
                    {s.split('_')[0]}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-primary">Extracted Results</h2>
                  <p className="text-muted-foreground">Found {results.length} tasks from your transcript.</p>
                </div>
                <Button variant="outline" onClick={() => { setResults(null); setTranscript(''); }} className="border-accent text-accent hover:bg-accent/5">
                  Process New Transcript
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.map((task, idx) => (
                  <Card key={idx} className="group hover:shadow-lg transition-all border-l-4 border-l-primary/10 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <h4 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                            {task.task_description}
                          </h4>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <User className="mr-1.5 h-4 w-4 text-accent" />
                              <span className="font-medium text-foreground">{task.owner}</span>
                            </div>
                            {task.deadline && (
                              <div className="flex items-center">
                                <Calendar className="mr-1.5 h-4 w-4 text-accent" />
                                <span>{task.deadline}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className={cn("px-2.5 py-0.5 font-bold uppercase text-[10px]", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Priority Score</span>
                            <span className="text-sm font-mono font-bold text-accent">{task.priority_score}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="h-1.5 w-full bg-secondary">
                      <div 
                        className="h-full bg-accent" 
                        style={{ width: `${task.priority_score}%` }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="pt-8 flex justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-12 shadow-xl shadow-primary/20">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Save Tasks to My List
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
