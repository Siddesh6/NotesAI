
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap } from 'lucide-react';

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
            <h2 className="text-xl font-bold mb-2">4. Data Ownership & Intellectual Property</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You retain all rights to the transcripts and data you upload. NotesAI owns the underlying technology, algorithms, and branding associated with the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">5. AI Disclaimer</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              NotesAI uses generative AI to extract tasks. While we strive for accuracy, AI models can occasionally produce errors or hallucinations. Users should verify extracted tasks for accuracy before relying on them.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">6. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              NotesAI shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">7. Termination</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including breach of these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">8. Governing Law</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
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
