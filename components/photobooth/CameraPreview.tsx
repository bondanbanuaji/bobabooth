'use client';

import { useWebcam } from '@/hooks/useWebcam';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraPreviewProps {
  onCapture: (base64Image: string) => void;
  isActive: boolean;
}

export function CameraPreview({ onCapture, isActive }: CameraPreviewProps) {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const { videoRef, error, startWebcam, stopWebcam, stream, devices } = useWebcam({ deviceId });
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
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {/* Top Controls: Dropdown and Info */}
      <div className="flex flex-wrap items-center justify-end gap-2 px-2">
         {devices.length > 0 && (
            <select 
               className="select select-bordered select-sm bg-background border-primary/20 text-foreground font-medium max-w-[200px] truncate rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
               value={deviceId || ''}
               onChange={(e) => setDeviceId(e.target.value)}
            >
               {devices.map((device, idx) => (
                  <option key={device.deviceId} value={device.deviceId}>
                     {device.label || `Camera ${idx + 1}`}
                  </option>
               ))}
            </select>
         )}
         
         <button 
           className="btn btn-sm btn-outline rounded-full shadow-sm border-primary/20 font-semibold gap-1 hover:bg-primary/10 text-foreground"
           onClick={() => (document.getElementById('hd_camera_tutorial') as HTMLDialogElement)?.showModal()}
         >
           <Smartphone className="w-4 h-4" /> <span className="hidden sm:inline">Use Phone Camera</span>
         </button>
      </div>

      <div className="relative w-full overflow-hidden rounded-[2rem] bg-zinc-900 border-4 border-primary/20 shadow-[0_0_40px_rgba(244,114,182,0.15)] aspect-[4/3] sm:aspect-video">
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
      </div>

      {/* Bottom Controls: Shutter Button */}
      <div className="flex justify-center mt-2">
        <Button 
          onClick={handleCapture}
          disabled={countdown !== null || !stream}
          className="rounded-full w-20 h-20 bg-background border-4 border-primary/50 hover:border-primary text-primary p-0 shadow-xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
           <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-inner group-hover:scale-105">
               <Camera className="w-7 h-7 text-primary-foreground" />
           </div>
        </Button>
      </div>

      {/* Tutorial Modal */}
      <dialog id="hd_camera_tutorial" className="modal modal-bottom sm:modal-middle text-left">
        <div className="modal-box bg-background border border-primary/20 rounded-3xl shadow-2xl overflow-y-auto max-h-[80vh]">
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-primary flex items-center gap-2">
            <Smartphone className="w-6 h-6 sm:w-8 sm:h-8" /> HD Phone Camera
          </h3>
          <p className="py-4 text-muted-foreground text-sm sm:text-base">
            Want sharper, better-looking photos? You can connect your smartphone to use its high-quality camera!
          </p>
          <div className="space-y-4 text-sm sm:text-base text-foreground">
             <div className="bg-secondary/40 p-4 sm:p-5 rounded-2xl border border-border mt-2">
                <p className="font-bold text-lg mb-3 flex items-center gap-2">🤖 For Android:</p>
                <div className="space-y-3">
                   <p className="font-medium"><strong>Opsi 1 (Android 14+):</strong><br/>Colok USB, cek notifikasi, pilih opsi <span className="font-bold text-primary">"Webcam"</span>. Kalau nggak ada, pakai Opsi 2.</p>
                   <p className="font-medium"><strong>Opsi 2 (Semua Android):</strong><br/>
                      <ol className="list-decimal ml-6 space-y-1 marker:text-primary">
                         <li>Install <a href="https://iriun.com/" target="_blank" className="font-bold text-blue-500 underline">Iriun Webcam</a> atau <span className="font-bold text-primary">DroidCam</span> di HP & PC kamu.</li>
                         <li>Buka aplikasinya di HP dan PC secara bersamaan (bisa via USB/WiFi).</li>
                         <li>Nanti kamera HP kamu otomatis muncul di PC.</li>
                      </ol>
                   </p>
                </div>
                <p className="mt-3 text-sm italic opacity-80">*Pilih nama kamera (misal: Iriun/Droidcam) dari menu dropdown kamera web ini.</p>
             </div>
             
             <div className="bg-secondary/40 p-4 sm:p-5 rounded-2xl border border-border">
                <p className="font-bold text-lg mb-3 flex items-center gap-2">🍎 For iPhone (iOS):</p>
                <ol className="list-decimal ml-6 space-y-2 marker:text-primary font-medium">
                   <li>If you are using a Mac, simply bring your iPhone close to enable <span className="font-bold text-primary">Continuity Camera</span>.</li>
                   <li>For PC, use a 3rd-party app like <a href="https://reincubate.com/camo/" target="_blank" rel="noreferrer" className="text-blue-500 underline hover:text-blue-600">Camo</a>, Iriun, or EpocCam.</li>
                </ol>
             </div>
          </div>
          <div className="modal-action mt-6">
            <form method="dialog" className="w-full">
              <Button className="w-full rounded-2xl shadow-xl h-14 text-lg">Got it!</Button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default">close</button>
        </form>
      </dialog>
    </div>
  );
}
