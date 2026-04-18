'use client';

import { PhotoboothTemplate } from '@/lib/templates';
import { useEffect, useRef, useState } from 'react';

interface CanvasRendererProps {
  images: string[];
  template: PhotoboothTemplate;
}

export function CanvasRenderer({ images, template }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed 1200x1800 size for Boothlab overlay templates
    const canvasWidth = 1200;
    const canvasHeight = 1800;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Remove solid background fill so it relies purely on the frame
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const maxImages = template.boxes?.length || 4;

    const loadImages = [...images.slice(0, maxImages), template.frameSrc].map(startLoadImage);

    Promise.all(loadImages).then((loadedImgs) => {
      // The last image is the overlay frame
      const frameImg = loadedImgs.pop()!;
      const userPhotos = loadedImgs;

      userPhotos.forEach((img, i) => {
        // Use the explicit bounding box for this photo, fallback for hot reload
        const boxes = template.boxes || [];
        const box = boxes[i];
        if (!box) return;
        const { x: targetX, y: targetY, w: photoWidth, h: photoHeight } = box;
        
        // Add 20px padding to strictly ensure the corners bleed comfortably under the transparent frame edges
        const x_padded = targetX - 20;
        const y_padded = targetY - 20;
        const w_padded = photoWidth + 40;
        const h_padded = photoHeight + 40;

        // Calculate object-fit: cover 
        const canvasRatio = w_padded / h_padded;
        const imgRatio = img.width / img.height;
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
        
        if (imgRatio > canvasRatio) {
           sWidth = img.height * canvasRatio;
           sx = (img.width - sWidth) / 2;
        } else {
           sHeight = img.width / canvasRatio;
           sy = (img.height - sHeight) / 2;
        }

        ctx.save();
        ctx.beginPath();
        // Clip to padded dimensions
        ctx.rect(x_padded, y_padded, w_padded, h_padded);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sWidth, sHeight, x_padded, y_padded, w_padded, h_padded);
        ctx.restore();
      });

      // Draw the frame overlay ON TOP of everything
      ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);

      // Save output
      setDataUrl(canvas.toDataURL('image/png'));
    });

  }, [images, template]);

  const startLoadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
         console.error("Failed to load image:", src);
         // Fallback by creating an empty image to not break Promise.all
         const emptyImg = new Image();
         resolve(emptyImg);
      };
      img.src = src;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full max-h-[70vh] overflow-y-auto custom-scrollbar p-4">
       {/* Visual Canvas (Hidden) */}
       <canvas ref={canvasRef} className="hidden" />
       
       {dataUrl ? (
          <div className="rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(244,114,182,0.2)] group border-4 border-white/50 dark:border-white/10 w-fit mx-auto transition-transform hover:scale-[1.02] duration-500">
              <img src={dataUrl} alt="Photobooth output" className="max-w-[320px] sm:max-w-[400px] w-full h-auto object-contain" />
          </div>
       ) : (
          <div className="w-[320px] sm:w-[400px] h-[600px] flex flex-col items-center justify-center bg-secondary/50 rounded-[2rem] border-4 border-dashed border-primary/20 animate-pulse">
             <span className="loading loading-spinner text-primary loading-lg mb-4"></span>
             <span className="text-primary font-bold">Applying template frame...</span>
          </div>
       )}
    </div>
  );
}
