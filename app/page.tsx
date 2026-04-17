import Link from 'next/link';
import { InteractiveBackground } from '@/components/photobooth/InteractiveBackground';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <InteractiveBackground />
      
      <div className="z-10 relative bg-background/80 dark:bg-background/80 backdrop-blur-3xl border border-primary/20 rounded-[2rem] p-8 md:p-14 w-full max-w-4xl text-center shadow-[0_20px_50px_rgba(244,114,182,0.1)] transition-all duration-300">
        
        {/* Badge */}
        <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground rounded-full mb-8 shadow-sm">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Premium Browser Photobooth</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-accent-foreground to-primary mb-6 drop-shadow-sm leading-tight pb-2">
          BobaBooth
        </h1>
        
        {/* Description */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          The ultimate browser-based photobooth experience. Choose a cute template, strike a pose, and save memories directly to your Google Drive.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-4">
          <Link href="/booth" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-16 sm:w-auto text-lg px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-all hover:scale-105 active:scale-95 group">
              <Camera className="mr-3 w-6 h-6 group-hover:-rotate-12 transition-transform" /> 
              Start session
            </Button>
          </Link>
          <Link href="/api/auth/signin" className="w-full sm:w-auto">
             <Button size="lg" variant="outline" className="w-full h-16 sm:w-auto text-lg px-8 rounded-full border-2 border-primary/30 text-foreground hover:bg-primary/5 transition-all active:scale-95 group">
               <ImageIcon className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" /> Connect Drive
             </Button>
          </Link>
        </div>
        
        {/* Footer info in card */}
        <div className="mt-16 pt-8 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span> Free to use
          </div>
          <div className="flex items-center">
             No installation required
          </div>
        </div>
      </div>
    </main>
  );
}

