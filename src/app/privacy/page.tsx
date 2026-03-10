
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Shield, Cpu } from 'lucide-react';

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
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-6 flex items-start space-x-4">
            <Cpu className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">AI Data Processing Standard</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your data is processed using modern Generative AI standards. We utilize secure APIs to interact with AI models, ensuring your transcripts are not used for public model training.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-2">
              We collect information that you provide directly to us:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Account information (email, display name, profile photo).</li>
              <li>Meeting transcripts and notes you upload for AI processing.</li>
              <li>Authentication metadata provided by Firebase.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">2. How AI Uses Your Data</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your meeting transcripts are transmitted via secure HTTPS to Google's Generative AI models (Gemini) solely for the purpose of task extraction and summarization. <strong>Your private transcripts are not used to train generic public AI models</strong>. The data is processed in a transient manner during the extraction run.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">3. Data Storage and Security</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use Firebase for secure cloud storage and authentication. All user-generated content is isolated to your specific User ID via Firestore Security Rules. We implement standard encryption and access control protocols.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">4. Third-Party Services</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li><strong>Firebase:</strong> For infrastructure, authentication, and data persistence.</li>
              <li><strong>Google Generative AI:</strong> For automated transcript analysis.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">5. Your Privacy Rights</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You have full control over your data. You may delete your account, remove transcripts, or purge your task history at any time through the dashboard. All deletions are final and remove the data from our active Firestore database.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">6. Contact</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              For any privacy-related inquiries, please contact Siddesh B at <Link href="mailto:siddeshb.contact@gmail.com" className="text-primary font-medium">siddeshb.contact@gmail.com</Link>.
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
