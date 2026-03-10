
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
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

        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-headline font-bold text-primary">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground mb-8 text-sm italic">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-foreground">
          <div>
            <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-2">
              We collect information that you provide directly to us:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Account information (email, display name, profile photo).</li>
              <li>Meeting transcripts and notes you upload for processing.</li>
              <li>Authentication tokens provided by Firebase.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">2. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your information is used solely to provide the AI extraction service. This includes processing transcripts using GenAI models, storing extracted tasks in your personal repository, and personalizing your dashboard experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">3. Data Storage and Security</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use Firebase (a Google Cloud platform) for authentication and database storage. All data is scoped to your user ID via Firestore Security Rules, ensuring only you can access your information. We implement standard industry practices to protect your data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">4. Third-Party Services</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-2">
              We utilize third-party services to power NotesAI:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li><strong>Firebase:</strong> For hosting, authentication, and database.</li>
              <li><strong>Google AI (Gemini):</strong> To process and extract action items from your transcripts.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">5. AI and Data Privacy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Transcripts are sent to Google's Generative AI models for processing. We do not use your private transcripts to train generic public models. Your data remains isolated within your workflow.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">6. Your Rights</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You have the right to access, update, or delete your information at any time. You can manage your profile in the Account Settings and delete tasks directly from your repository.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">7. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground mb-4">Privacy concerns?</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="mailto:siddeshb.contact@gmail.com">Email Siddesh B</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
