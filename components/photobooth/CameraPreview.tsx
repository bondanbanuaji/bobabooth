'use client';

import { useWebcam } from '@/hooks/useWebcam';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraPreviewProps {
  onCapture: (base64Image: string) => void;
  isActive: boolean;
}

export function CameraPreview({ onCapture, isActive }: CameraPreviewProps) {
  const { videoRef, error, startWebcam, stopWebcam, stream } = useWebcam();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isActive) {
      startWebcam();
    } else {
      stopWebcam();
    }
  }, [isActive, startWebcam, stopWebcam]);

  const handleCapture = () => {
    if (countdown !== null) return;
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Capture
      if (videoRef.current) {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Flip horizontally to act like a mirror
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL('image/png');
          onCapture(base64);
        }
      }
      setCountdown(null);
    }
  }, [countdown, onCapture, videoRef]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-destructive/10 text-destructive rounded-[2rem] border-2 border-destructive shadow-lg w-full max-w-2xl mx-auto aspect-[4/3] sm:aspect-video">
        <AlertCircle className="w-12 h-12 mb-4 animate-bounce" />
        <p className="text-center font-bold text-lg">Camera Access Denied or Unavailable</p>
        <p className="text-sm font-medium mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-[2rem] bg-zinc-900 border-4 border-primary/20 shadow-[0_0_40px_rgba(244,114,182,0.15)] group aspect-[4/3] sm:aspect-video">
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-900/50 backdrop-blur-sm">
           <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
      )}
      
      {/* video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full absolute inset-0 object-cover origin-center -scale-x-100" // CSS flip and cover
      />

      {/* Overlays */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <span className="text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(244,114,182,1)]">{countdown}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Flash overlay */}
      <AnimatePresence>
        {countdown === 0 && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40 transition-transform duration-300 group-hover:-translate-y-2">
        <Button 
          onClick={handleCapture}
          disabled={countdown !== null || !stream}
          className="rounded-full w-20 h-20 bg-background/50 backdrop-blur-md hover:bg-background border-4 border-primary/50 hover:border-primary text-primary p-0 shadow-2xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
           <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-inner group">
               <Camera className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform" />
           </div>
        </Button>
      </div>
    </div>
  );
}
