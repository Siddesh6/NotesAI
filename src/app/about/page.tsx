
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Target, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-secondary/10 dark:bg-background py-12 px-4 sm:px-6 lg:px-8 font-body transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-card rounded-2xl shadow-xl p-8 sm:p-12 border dark:border-border/50">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center text-primary font-medium hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-1">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-headline font-bold text-primary">NotesAI</span>
          </div>
        </div>

        <h1 className="text-4xl font-headline font-bold text-primary mb-6">About NotesAI</h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          NotesAI was born out of a simple observation: meetings are where work is discussed, but the "real work" often gets lost in translation between the conversation and the task list. We built a bridge using advanced Generative AI to ensure that every commitment made in a meeting is captured, assigned, and prioritized automatically.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Target className="h-6 w-6" />
              <h2 className="text-xl font-bold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To maximize human productivity by automating the administrative overhead of post-meeting coordination. We want you to focus on the execution, not the note-taking.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-accent">
              <Users className="h-6 w-6" />
              <h2 className="text-xl font-bold">For Teams</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Whether you're a startup moving at light speed or a large enterprise coordinating across time zones, NotesAI brings clarity and accountability to your workflows.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl border border-primary/10 mb-12">
          <div className="flex items-center space-x-3 mb-4 text-primary">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-2xl font-bold">The AI Advantage</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Leveraging the latest in Large Language Models, NotesAI doesn't just "read" text; it understands intent. It recognizes when a team member says "I'll take care of it" versus "We should look into it," ensuring that task owners are assigned with high precision.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-white dark:bg-background rounded-full text-xs font-bold text-primary shadow-sm">
              Contextual Analysis
            </div>
            <div className="px-4 py-2 bg-white dark:bg-background rounded-full text-xs font-bold text-primary shadow-sm">
              Automated Prioritization
            </div>
            <div className="px-4 py-2 bg-white dark:bg-background rounded-full text-xs font-bold text-primary shadow-sm">
              Seamless Export
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-primary mb-4">Ready to reclaim your time?</h3>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Link href="/dashboard">Get Started with NotesAI</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
