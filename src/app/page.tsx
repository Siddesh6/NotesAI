
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Zap, FileText, ArrowRight, Linkedin, Mail, Cpu, Menu } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-meeting');

  return (
    <div className="flex flex-col min-h-screen transition-colors overflow-x-hidden">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 dark:bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="bg-primary rounded-lg p-1.5 shadow-sm">
            < Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">NotesAI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2 sm:gap-6">
          <div className="hidden md:flex items-center gap-4 sm:gap-6 mr-4">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/about">
              About Us
            </Link>
          </div>
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link className="text-lg font-medium hover:text-primary" href="#features">Features</Link>
                <Link className="text-lg font-medium hover:text-primary" href="/about">About Us</Link>
                <Link className="text-lg font-medium hover:text-primary" href="/login">Sign In</Link>
                <Button asChild className="w-full mt-4 bg-primary text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-32 lg:py-40 bg-gradient-to-b from-secondary/40 to-background dark:from-secondary/5 dark:to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6 md:space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-primary leading-[1.1]">
                    Meeting Transcripts to Action Items in Seconds
                  </h1>
                  <p className="max-w-[600px] mx-auto lg:mx-0 text-muted-foreground md:text-xl font-body leading-relaxed">
                    Automate your post-meeting workflow. Extract tasks, assign owners, and set priorities using advanced AI.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row justify-center lg:justify-start pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-lg px-8 py-6 rounded-xl w-full sm:w-auto">
                    <Link href="/dashboard">
                      Start Extracting <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 text-lg px-8 py-6 rounded-xl w-full sm:w-auto">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl opacity-30 dark:opacity-20" />
                <div className="relative aspect-video overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl border bg-white dark:bg-card">
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

        <section id="features" className="w-full py-20 md:py-24 bg-white dark:bg-card/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl text-primary">
                Powerful AI Extraction
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl font-body leading-relaxed">
                Our pipeline uses sophisticated Gemini models to ensure nothing falls through the cracks.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="border-none shadow-xl shadow-primary/5 bg-background dark:bg-card hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="mb-6 bg-accent/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <FileText className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Transcript Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">Upload any meeting transcript. Our AI parses every sentence to find actionable commitments.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl shadow-primary/5 bg-background dark:bg-card hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="mb-6 bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Smart Detection</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">Automatically identify task owners, specific tasks, and deadlines mentioned in conversation.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl shadow-primary/5 bg-background dark:bg-card hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="mb-6 bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                    < Zap className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Priority Scoring</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">Dynamic scoring engine ranks tasks based on urgency keywords and upcoming deadlines.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-12 md:py-16 bg-white dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-start text-center sm:text-left">
            <div className="space-y-6 sm:col-span-2">
              <Link className="flex items-center justify-center sm:justify-start space-x-2" href="/">
                <div className="bg-primary rounded-lg p-1.5">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-headline font-bold text-xl tracking-tight text-primary">NotesAI</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto sm:mx-0 leading-relaxed">
                Revolutionizing how teams turn conversations into actionable progress with the power of advanced Generative AI.
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-[10px] text-muted-foreground uppercase tracking-widest bg-secondary/50 dark:bg-secondary/10 px-3 py-1.5 rounded-full w-fit mx-auto sm:mx-0">
                <Cpu className="h-3 w-3" />
                <span>AI-Powered Application</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Created By</h4>
              <div className="flex flex-col space-y-3">
                <span className="text-base font-bold text-foreground">Siddesh B</span>
                <p className="text-xs text-muted-foreground">Building tools for a more productive future.</p>
                <div className="flex justify-center sm:justify-start space-x-4 pt-2">
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
                <Link className="text-sm hover:text-primary text-muted-foreground transition-colors" href="/about">About Us</Link>
                <Link className="text-sm hover:text-primary text-muted-foreground transition-colors" href="/terms">Terms of Service</Link>
                <Link className="text-sm hover:text-primary text-muted-foreground transition-colors" href="/privacy">Privacy Policy</Link>
                <Link className="text-sm hover:text-primary text-muted-foreground transition-colors" href="/dashboard">Dashboard</Link>
              </nav>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} NotesAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
