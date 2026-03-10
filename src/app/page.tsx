import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Zap, FileText, ArrowRight, Linkedin, Mail, Cpu } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-meeting');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="bg-primary rounded-lg p-1.5">
            < Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">NotesAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/dashboard">
            Dashboard
          </Link>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Meeting Transcripts to Action Items in Seconds
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl font-body">
                    Automate your post-meeting workflow. Extract tasks, assign owners, and set priorities using advanced AI.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <Link href="/dashboard">
                      Start Extracting <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto aspect-video overflow-hidden rounded-2xl shadow-2xl lg:order-last">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-primary">
                Powerful AI Extraction
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl font-body">
                Our pipeline uses sophisticated NLP to ensure nothing falls through the cracks.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md bg-background/50 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="mb-4 bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Transcript Analysis</h3>
                  <p className="text-muted-foreground">Upload any meeting transcript. Our AI parses sentences to find actionable commitments.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-background/50 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="mb-4 bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Smart Entity Detection</h3>
                  <p className="text-muted-foreground">Automatically identify task owners, specific tasks, and deadlines mentioned in conversation.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-background/50 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="mb-4 bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    < Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Priority Scoring</h3>
                  <p className="text-muted-foreground">Dynamic scoring engine ranks tasks based on urgency keywords and upcoming deadlines.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-12 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="space-y-4">
              <Link className="flex items-center space-x-2" href="/">
                <div className="bg-primary rounded-lg p-1.5">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-headline font-bold text-xl tracking-tight text-primary">NotesAI</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Revolutionizing how teams turn conversations into actionable progress with the power of GenAI.
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-muted-foreground uppercase tracking-widest bg-secondary/30 px-3 py-1.5 rounded-full w-fit">
                <Cpu className="h-3 w-3" />
                <span>AI-Powered Application</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Created By</h4>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-bold text-foreground">Siddesh B</span>
                <p className="text-xs text-muted-foreground">Building the future of meeting productivity.</p>
                <div className="flex space-x-4 pt-2">
                  <Link href="mailto:siddeshb.contact@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </Link>
                  <Link href="https://www.linkedin.com/in/bsiddesh" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="/terms">
                  Terms of Service
                </Link>
                <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="/privacy">
                  Privacy Policy
                </Link>
                <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="/dashboard">
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} NotesAI. Created with advanced AI Tools. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
