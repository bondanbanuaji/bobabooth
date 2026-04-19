import Link from 'next/link';
import { InteractiveBackground } from '@/components/photobooth/InteractiveBackground';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* GitHub Link Top Left */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="https://github.com/bondanbanuaji/bobabooth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-background/50 hover:bg-background/80 backdrop-blur-md rounded-full border border-primary/20 text-muted-foreground hover:text-foreground transition-all shadow-sm group">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 group-hover:scale-110 transition-transform"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </Link>
      </div>
      <InteractiveBackground />
      
      <div className="z-10 relative bg-background/80 dark:bg-background/80 backdrop-blur-3xl border border-primary/20 rounded-[2rem] p-8 md:p-14 w-full max-w-4xl text-center shadow-[0_20px_50px_rgba(244,114,182,0.1)] transition-all duration-300">
        
        {/* Badge */}
        <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground rounded-full mb-8 shadow-sm">
            <Camera className="w-5 h-5 mr-2" />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Premium Browser Photobooth</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-primary mb-6 drop-shadow-sm leading-tight pb-2">
          BobaBooth
        </h1>
        
        {/* Description */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Every glance holds a story. Every frame, a fleeting whisper of who we are. Step into the light — let the lens remember what time forgets.
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
        <div className="mt-16 pt-8 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
          <div className="flex items-center">
            Made with boba...
          </div>
        </div>
      </div>
    </main>
  );
}

