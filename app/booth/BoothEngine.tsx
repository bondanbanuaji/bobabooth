'use client';

import { useState } from 'react';
import { CameraPreview } from '@/components/photobooth/CameraPreview';
import { CanvasRenderer } from '@/components/photobooth/CanvasRenderer';
import { InteractiveBackground } from '@/components/photobooth/InteractiveBackground';
import { PhotoboothTemplate, defaultTemplates } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, Download, UploadCloud, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export function BoothEngine() {
  const [step, setStep] = useState<'template' | 'capture' | 'preview'>('template');
  const [template, setTemplate] = useState<PhotoboothTemplate>(defaultTemplates[0]);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const maxImages = template.layout === 'strip-4' ? 4 : template.layout === 'grid-2x2' ? 4 : 1;

  const handleCapture = (base64: string) => {
    const newImages = [...images, base64];
    setImages(newImages);
    
    if (newImages.length >= maxImages) {
      setStep('preview');
    }
  };

  const handleRetake = () => {
    setImages([]);
    setStep('capture');
  };

  const handleSaveToDrive = async () => {
    // Note: Canvas rendering output can be grabbed via capturing a specific div, 
    // but our CanvasRenderer component already returns the dataUrl.
    // For this example, we assume we want to pull the base64 from an image tag.
    const finalImage = document.querySelector('img[alt="Photobooth output"]') as HTMLImageElement;
    if (!finalImage) {
        toast.error('Could not find rendered image');
        return;
    }

    setIsUploading(true);
    try {
        const res = await fetch('/api/upload-drive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageBase64: finalImage.src,
                filename: `BobaBooth_${template.name}_${Date.now()}.png`
            })
        });

        const data = await res.json();
        if (data.success) {
            toast.success('Saved to Google Drive successfully!');
        } else {
            if (res.status === 401) {
                toast.error('You need to login to save to Drive.', {
                    action: { label: "Login", onClick: () => window.location.href = '/api/auth/signin' }
                });
            } else {
                throw new Error(data.error);
            }
        }
    } catch (err: any) {
        toast.error('Failed to upload: ' + err.message);
    } finally {
        setIsUploading(false);
    }
  };

  const handleDownload = () => {
     const finalImage = document.querySelector('img[alt="Photobooth output"]') as HTMLImageElement;
     if (!finalImage) return;
     const a = document.createElement('a');
     a.href = finalImage.src;
     a.download = `BobaBooth_${Date.now()}.png`;
     a.click();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-10 p-4">
      <InteractiveBackground />
      
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 z-20 bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10">
         <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">BobaBooth</h2>
         <div className="flex gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${step === 'template' ? 'bg-white text-black' : 'bg-white/10 text-zinc-400'}`}>1. Template</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${step === 'capture' ? 'bg-white text-black' : 'bg-white/10 text-zinc-400'}`}>2. Capture</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${step === 'preview' ? 'bg-white text-black' : 'bg-white/10 text-zinc-400'}`}>3. Review</div>
         </div>
      </div>

      <div className="w-full max-w-5xl z-10 flex-1 flex flex-col md:flex-row gap-8 items-start justify-center">
            
            {/* Main Area */}
            <div className="flex-1 w-full max-w-full md:max-w-2xl bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl min-h-[60vh] flex flex-col items-center justify-center">
                
                {step === 'template' && (
                    <div className="w-full text-center">
                        <h3 className="text-2xl font-semibold text-white mb-8">Choose Your Style</h3>
                        <div className="grid grid-cols-2 gap-4">
                           {defaultTemplates.map(t => (
                              <div 
                                key={t.id} 
                                onClick={() => setTemplate(t)}
                                className={`cursor-pointer rounded-xl p-6 border-2 transition-all hover:scale-105 ${template.id === t.id ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5'}`}
                              >
                                 <div className="w-16 h-20 mx-auto mb-4 border border-white/30 rounded flex items-center justify-center bg-zinc-800" style={{ backgroundColor: t.bgColor }}>
                                    <span className="text-xs" style={{ color: t.textColor }}>Preview</span>
                                 </div>
                                 <p className="font-medium text-white">{t.name}</p>
                                 <p className="text-xs text-zinc-400 mt-1">{t.layout}</p>
                              </div>
                           ))}
                        </div>
                        <Button 
                            className="mt-10 px-12 py-6 text-lg rounded-full"
                            onClick={() => setStep('capture')}
                        >
                            Next: Strike a Pose!
                        </Button>
                    </div>
                )}

                {step === 'capture' && (
                    <div className="w-full flex flex-col items-center">
                        <div className="mb-4 text-center">
                            <p className="text-white font-medium">Shot {images.length + 1} of {maxImages}</p>
                        </div>
                        <CameraPreview onCapture={handleCapture} isActive={step === 'capture'} />
                    </div>
                )}

                {step === 'preview' && (
                    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <CanvasRenderer images={images} template={template} />
                    </div>
                )}
            </div>

            {/* Sidebar Tools mainly for Preview Step */}
            {step === 'preview' && (
                <div className="w-full md:w-80 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-right duration-500">
                    <h3 className="font-semibold text-xl text-white mb-2 text-center">Export</h3>
                    
                    <Button onClick={handleDownload} variant="secondary" className="w-full h-14 justify-start px-6 gap-3 rounded-xl bg-white/10 hover:bg-white/20 text-white">
                        <Download className="w-5 h-5 text-indigo-400" /> Save to Device
                    </Button>
                    
                    <Button 
                        onClick={handleSaveToDrive} 
                        disabled={isUploading}
                        className="w-full h-14 justify-start px-6 gap-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white"
                    >
                        {isUploading ? <span className="loading loading-spinner"></span> : <UploadCloud className="w-5 h-5" />}
                        {isUploading ? 'Uploading...' : 'Save to Google Drive'}
                    </Button>

                    <div className="divider before:bg-white/10 after:bg-white/10 text-zinc-500 text-sm my-2">OR</div>

                    <Button onClick={handleRetake} variant="ghost" className="w-full h-14 justify-start px-6 gap-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-zinc-300">
                        <RefreshCw className="w-5 h-5" /> Retake Photos
                    </Button>

                    <Link href="/" className="mt-auto">
                        <Button variant="ghost" className="w-full h-12 text-zinc-400 hover:text-white mt-8">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            )}
            
      </div>
    </div>
  );
}
