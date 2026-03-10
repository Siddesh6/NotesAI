
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Zap, FileText, ArrowRight, Linkedin, Mail, Cpu } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-meeting');

  return (
    <div className="flex flex-col min-h-screen transition-colors">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 dark:bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="bg-primary rounded-lg p-1.5 shadow-sm">
            < Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">NotesAI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/about">
            About Us
          </Link>
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-primary/20 hover:bg-primary/5">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-sm">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-secondary/40 to-background dark:from-secondary/5 dark:to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl font-headline font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-primary">
                    Meeting Transcripts to Action Items in Seconds
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl font-body leading-relaxed">
                    Automate your post-meeting workflow. Extract tasks, assign owners, and set priorities using advanced AI.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-lg px-8 py-6 rounded-xl">
                    <Link href="/dashboard">
                      Start Extracting <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 text-lg px-8 py-6 rounded-xl">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl opacity-30 dark:opacity-20" />
                <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl border bg-white dark:bg-card">
                  {heroImage ? (
                    <Image
                      src={heroImage.imageUrl}
                      alt={heroImage.description}
                      fill
                      className="object-cover"
                      priority
                      data-ai-hint={heroImage.imageHint}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                       <Zap className="h-20 w-20 text-primary/20 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 bg-white dark:bg-card/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl text-primary">
                Powerful AI Extraction
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl font-body leading-relaxed">
                Our pipeline uses sophisticated Gemini models to ensure nothing falls through the cracks of your conversations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-xl shadow-primary/5 bg-background dark:bg-card hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="mb-6 bg-accent/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <FileText className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Transcript Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">Upload any meeting transcript. Our AI parses every sentence to find actionable commitments and promises.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl shadow-primary/5 bg-background dark:bg-card hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="mb-6 bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Smart Entity Detection</h3>
                  <p className="text-muted-foreground leading-relaxed">Automatically identify task owners, specific tasks, and deadlines mentioned in conversation with high accuracy.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl shadow-primary/5 bg-background dark:bg-card hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="mb-6 bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                    < Zap className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Priority Scoring</h3>
                  <p className="text-muted-foreground leading-relaxed">Dynamic scoring engine ranks tasks based on urgency keywords and upcoming deadlines identified in the text.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-16 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
            <div className="space-y-6 md:col-span-2">
              <Link className="flex items-center space-x-2" href="/">
                <div className="bg-primary rounded-lg p-1.5">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-headline font-bold text-xl tracking-tight text-primary">NotesAI</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Revolutionizing how teams turn conversations into actionable progress with the power of advanced Generative AI.
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-muted-foreground uppercase tracking-widest bg-secondary/50 dark:bg-secondary/10 px-3 py-1.5 rounded-full w-fit">
                <Cpu className="h-3 w-3" />
                <span>AI-Powered Application</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Created By</h4>
              <div className="flex flex-col space-y-3">
                <span className="text-base font-bold text-foreground">Siddesh B</span>
                <p className="text-xs text-muted-foreground">Building tools for a more productive future.</p>
                <div className="flex space-x-4 pt-2">
                  <Link href="mailto:siddeshb.contact@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </Link>
                  <Link href="https://www.linkedin.com/in/bsiddesh" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Quick Links</h4>
              <nav className="flex flex-col space-y-3">
                <Link className="text-sm hover:text-primary text-muted-foreground transition-colors" href="/about">
                  About Us
                </Link>
                <Link className="text-sm hover:text-primary text-muted-foreground transition-colors" href="/terms">
                  Terms of Service
                </Link>
                <Link className="text-sm hover:text-primary text-muted-foreground transition-colors" href="/privacy">
                  Privacy Policy
                </Link>
                <Link className="text-sm hover:text-primary text-muted-foreground transition-colors" href="/dashboard">
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} NotesAI. All rights reserved. Built with advanced AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
