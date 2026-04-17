'use client';

import { useState } from 'react';
import { CameraPreview } from '@/components/photobooth/CameraPreview';
import { CanvasRenderer } from '@/components/photobooth/CanvasRenderer';
import { InteractiveBackground } from '@/components/photobooth/InteractiveBackground';
import { PhotoboothTemplate, defaultTemplates } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, Download, UploadCloud, RefreshCw, Sparkles, Home, Camera } from 'lucide-react';
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
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-6 sm:pt-10 p-4 md:p-8 overflow-hidden">
      <InteractiveBackground />
      
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 z-20 bg-background/80 dark:bg-background/80 backdrop-blur-3xl p-4 sm:p-5 rounded-3xl border border-primary/20 shadow-xl gap-4">
         <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> BobaBooth
         </h2>
         <div className="flex gap-2 sm:gap-3 bg-secondary/50 p-1.5 rounded-full overflow-x-auto w-full sm:w-auto">
            <div className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${step === 'template' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'}`}>1. Template</div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${step === 'capture' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'}`}>2. Capture</div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${step === 'preview' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'}`}>3. Review</div>
         </div>
      </div>

      <div className="w-full max-w-5xl z-10 flex-1 flex flex-col lg:flex-row gap-6 sm:gap-8 items-stretch justify-center">
            
            {/* Main Area */}
            <div className="flex-1 w-full bg-background/80 dark:bg-background/80 backdrop-blur-3xl rounded-[2rem] border border-primary/20 p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center min-h-[60vh] transition-all duration-300">
                
                {step === 'template' && (
                    <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center h-full animate-in fade-in zoom-in duration-500">
                        <h3 className="text-3xl font-heading font-semibold text-foreground mb-4">Choose Your Theme</h3>
                        <p className="text-muted-foreground mb-8">Select a layout that matches your vibe today.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
                           {defaultTemplates.map(t => (
                              <div 
                                key={t.id} 
                                onClick={() => setTemplate(t)}
                                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-xl ${template.id === t.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/20' : 'border-border bg-card'}`}
                              >
                                 <div className="w-24 h-32 mx-auto mb-4 border border-black/10 dark:border-white/10 rounded-lg flex items-center justify-center shadow-inner" style={{ backgroundColor: t.bgColor }}>
                                    <span className="text-xs font-bold px-2 py-1 bg-white/50 backdrop-blur rounded-md" style={{ color: t.textColor }}>Preview</span>
                                 </div>
                                 <p className="font-heading font-semibold text-lg text-foreground">{t.name}</p>
                                 <p className="text-sm text-muted-foreground mt-1 capitalize font-medium">{t.layout.replace('-', ' ')}</p>
                              </div>
                           ))}
                        </div>
                        <Button 
                            className="mt-12 px-12 py-7 text-xl rounded-full shadow-xl hover:scale-105 transition-transform"
                            onClick={() => setStep('capture')}
                        >
                            Next: Strike a Pose!
                        </Button>
                    </div>
                )}

                {step === 'capture' && (
                    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
                        <div className="mb-4 inline-flex items-center px-4 py-2 bg-secondary rounded-full text-secondary-foreground font-bold shadow-sm">
                            <Camera className="w-5 h-5 mr-2" /> Shot {images.length + 1} of {maxImages}
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

            {/* Sidebar Tools for Preview Step */}
            {step === 'preview' && (
                <div className="w-full lg:w-80 bg-background/80 dark:bg-background/80 backdrop-blur-3xl rounded-[2rem] border border-primary/20 p-6 flex flex-col gap-4 animate-in slide-in-from-bottom lg:slide-in-from-right duration-500 shadow-2xl">
                    <h3 className="font-heading font-semibold text-2xl text-foreground mb-4 text-center">Export</h3>
                    
                    <Button onClick={handleDownload} variant="outline" className="w-full h-16 justify-start px-6 gap-3 rounded-2xl border-2 border-primary/20 hover:bg-primary/10 text-foreground font-semibold text-lg">
                        <Download className="w-6 h-6 text-primary" /> Save to Device
                    </Button>
                    
                    <Button 
                        onClick={handleSaveToDrive} 
                        disabled={isUploading}
                        className="w-full h-16 justify-start px-6 gap-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg"
                    >
                        {isUploading ? <span className="loading loading-spinner"></span> : <UploadCloud className="w-6 h-6" />}
                        {isUploading ? 'Uploading...' : 'Save to Drive'}
                    </Button>

                    <div className="divider text-muted-foreground font-medium text-sm my-4">OR</div>

                    <Button onClick={handleRetake} variant="ghost" className="w-full h-14 justify-start px-6 gap-3 rounded-2xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-semibold">
                        <RefreshCw className="w-5 h-5" /> Retake Photos
                    </Button>

                    <div className="mt-auto pt-6 border-t border-border">
                        <Link href="/">
                            <Button variant="ghost" className="w-full h-14 text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-semibold rounded-2xl">
                                <Home className="w-5 h-5 mr-2" /> Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
            
      </div>
    </div>
  );
}
