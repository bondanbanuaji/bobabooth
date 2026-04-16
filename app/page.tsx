import Link from 'next/link';
import { InteractiveBackground } from '@/components/photobooth/InteractiveBackground';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <InteractiveBackground />
      
      <div className="z-10 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-12 max-w-3xl w-full text-center shadow-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-8">
            <Sparkles className="w-6 h-6 text-pink-400 mr-2" />
            <span className="text-sm font-semibold tracking-wider text-pink-100 uppercase">Modern Web Photobooth</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 mb-6 tracking-tight">
          BobaBooth
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-xl mx-auto leading-relaxed">
          The ultimate browser-based photobooth experience. No installations. Pick a template, strike a pose, and save directly to your Google Drive.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/booth">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <Camera className="mr-2 w-6 h-6" /> Start Booth
            </Button>
          </Link>
          <Link href="/api/auth/signin">
             <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-white/20 text-white hover:bg-white/10 transition-all">
               Login / Connect Drive
             </Button>
          </Link>
        </div>
      </div>
{/* 
      <div className="absolute top-6 right-6">
         <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Dashboard
         </Link>
      </div> */}
    </main>
  );
}

