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

     // Setup Layout Constants
    const IMAGE_WIDTH = 640;
    const IMAGE_HEIGHT = 480;
    const PADDING = 40;
    const HEADER_SPACE = 60;
    const FOOTER_SPACE = 120;
    const RADIUS = 24; // Rounded corners for photos

    let canvasWidth = 0;
    let canvasHeight = 0;
    
    // Config per template
    if (template.layout === 'strip-4') {
      canvasWidth = IMAGE_WIDTH + (PADDING * 2);
      canvasHeight = (IMAGE_HEIGHT * 4) + (PADDING * 5) + HEADER_SPACE + FOOTER_SPACE;
    } else if (template.layout === 'grid-2x2') {
      canvasWidth = (IMAGE_WIDTH * 2) + (PADDING * 3);
      canvasHeight = (IMAGE_HEIGHT * 2) + (PADDING * 3) + HEADER_SPACE + FOOTER_SPACE;
    } else if (template.layout === 'polaroid') {
       canvasWidth = IMAGE_WIDTH + (PADDING * 2);
       canvasHeight = IMAGE_HEIGHT + PADDING + FOOTER_SPACE;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Wait until fonts are loaded ideally, but we will proceed
    // Draw Background
    ctx.fillStyle = template.bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw Text
    ctx.fillStyle = template.textColor || '#000000';
    ctx.font = `bold 64px ${template.fontFam || 'sans-serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const maxImages = template.layout === 'strip-4' ? 4 : template.layout === 'grid-2x2' ? 4 : 1;
    
    // Load Images
    const loadImages = images.slice(0, maxImages).map(startLoadImage);

    Promise.all(loadImages).then((loadedImgs) => {
      loadedImgs.forEach((img, i) => {
        let x = 0, y = 0;

        if (template.layout === 'strip-4') {
          x = PADDING;
          y = HEADER_SPACE + PADDING + (i * (IMAGE_HEIGHT + PADDING));
        } else if (template.layout === 'grid-2x2') {
          x = (i % 2 === 0) ? PADDING : PADDING * 2 + IMAGE_WIDTH;
          y = (i < 2) ? HEADER_SPACE + PADDING : HEADER_SPACE + PADDING * 2 + IMAGE_HEIGHT;
        } else if (template.layout === 'polaroid') {
            x = PADDING;
            y = PADDING;
        }

        // Draw shadow underlay
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, IMAGE_WIDTH, IMAGE_HEIGHT, RADIUS);
        } else {
            ctx.rect(x, y, IMAGE_WIDTH, IMAGE_HEIGHT); // fallback
        }
        ctx.fill();
        ctx.restore();

        // Calculate object-fit: cover
        const canvasRatio = IMAGE_WIDTH / IMAGE_HEIGHT;
        const imgRatio = img.width / img.height;
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
        
        if (imgRatio > canvasRatio) {
           sWidth = img.height * canvasRatio;
           sx = (img.width - sWidth) / 2;
        } else {
           sHeight = img.width / canvasRatio;
           sy = (img.height - sHeight) / 2;
        }

        // Draw image with clipping
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, IMAGE_WIDTH, IMAGE_HEIGHT, RADIUS);
        } else {
            ctx.rect(x, y, IMAGE_WIDTH, IMAGE_HEIGHT);
        }
        ctx.clip();
        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, IMAGE_WIDTH, IMAGE_HEIGHT);
        ctx.restore();
      });

      // Draw footer text after images
      const footerY = canvasHeight - (FOOTER_SPACE / 2);
      ctx.fillText("BobaBooth", canvasWidth / 2, footerY);

      // Save output
      setDataUrl(canvas.toDataURL('image/png'));
    });

  }, [images, template]);

  const startLoadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full max-h-[70vh] overflow-y-auto custom-scrollbar p-4">
       {/* Visual Canvas (Hidden or scaled down for preview) */}
       <canvas ref={canvasRef} className="hidden" />
       
       {dataUrl ? (
          <div className="rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(244,114,182,0.2)] group border-4 border-white/50 dark:border-white/10 w-fit mx-auto transition-transform hover:scale-[1.02] duration-500">
              <img src={dataUrl} alt="Photobooth output" className="max-w-[320px] sm:max-w-[400px] w-full h-auto object-contain" />
          </div>
       ) : (
          <div className="w-[320px] sm:w-[400px] h-[600px] flex flex-col items-center justify-center bg-secondary/50 rounded-[2rem] border-4 border-dashed border-primary/20 animate-pulse">
             <span className="loading loading-spinner text-primary loading-lg mb-4"></span>
             <span className="text-primary font-bold">Processing your masterpiece...</span>
          </div>
       )}
    </div>
  );
}
