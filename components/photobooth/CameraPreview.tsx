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
      <div className="flex flex-col items-center justify-center p-8 bg-black/50 text-white rounded-xl backdrop-blur-md border border-white/10">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-center">Camera Access Denied or Unavailable</p>
        <p className="text-sm text-zinc-400 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl group">
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
           <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
      )}
      
      {/* video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover origin-center -scale-x-100" // CSS flip
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
            <span className="text-9xl font-bold text-white drop-shadow-2xl">{countdown}</span>
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
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40">
        <Button 
          size="lg" 
          onClick={handleCapture}
          disabled={countdown !== null || !stream}
          className="rounded-full w-20 h-20 bg-white/20 hover:bg-white/40 backdrop-blur-md border-2 border-white text-white p-0"
        >
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 group">
               <Camera className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
           </div>
        </Button>
      </div>
    </div>
  );
}
