
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Cpu } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-secondary/10 py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12">
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

        <h1 className="text-3xl font-headline font-bold text-primary mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-8 text-sm italic">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-foreground">
          <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 mb-6 flex items-start space-x-4">
            <Cpu className="h-6 w-6 text-accent shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-1">AI Usage Disclosure</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                NotesAI is an AI-powered application generated and enhanced using advanced generative AI tools. By using this service, you acknowledge that content and task extractions are automated.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              By accessing and using NotesAI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">2. Description of Service</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              NotesAI provides AI-powered extraction of action items from meeting transcripts. The Service includes task management, priority scoring, and data export features.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">3. User Responsibilities</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to use the Service only for lawful purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">4. AI Content Disclaimer & Accuracy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              NotesAI utilizes Large Language Models (LLMs) to process and extract data. While the underlying technology is highly advanced, AI models can produce inaccurate results ("hallucinations"). <strong>Users are solely responsible for verifying the accuracy of all AI-generated tasks, owners, and deadlines</strong> before acting upon them. NotesAI assumes no liability for errors in extracted content.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">5. Data Ownership & Intellectual Property</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You retain all rights to the transcripts and data you upload. NotesAI owns the underlying technology, branding, and proprietary algorithms associated with the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">6. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              In no event shall NotesAI or its creator, Siddesh B, be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service, including reliance on automated AI outputs.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">7. Termination</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including breach of these Terms.
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground mb-4">Questions about our Terms?</p>
          <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/5">
            <Link href="mailto:siddeshb.contact@gmail.com">Contact Siddesh B</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
