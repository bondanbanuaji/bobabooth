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
       // Just one big image
       canvasWidth = IMAGE_WIDTH + (PADDING * 2);
       canvasHeight = IMAGE_HEIGHT + PADDING + FOOTER_SPACE;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw Background
    ctx.fillStyle = template.bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw Text
    ctx.fillStyle = template.textColor || '#000000';
    ctx.font = `bold 48px ${template.fontFam || 'sans-serif'}`;
    ctx.textAlign = 'center';
    
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

        // Draw shadow or border if needed
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 20;
        ctx.fillRect(x, y, IMAGE_WIDTH, IMAGE_HEIGHT); // optional underlay

        // Draw image
        ctx.shadowBlur = 0; // reset
        ctx.drawImage(img, x, y, IMAGE_WIDTH, IMAGE_HEIGHT);
      });

      // Draw footer text after images
      ctx.fillText("BobaBooth", canvasWidth / 2, canvasHeight - (FOOTER_SPACE / 2));

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
    <div className="flex flex-col items-center gap-4">
       {/* Visual Canvas (Hidden or scaled down for preview) */}
       <canvas ref={canvasRef} className="hidden" />
       
       {dataUrl ? (
          <div className="rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] group">
              <img src={dataUrl} alt="Photobooth output" className="max-w-[400px] w-full h-auto" />
          </div>
       ) : (
          <div className="w-[400px] h-[600px] flex items-center justify-center bg-zinc-900 rounded-xl animate-pulse">
             <span className="text-zinc-500">Processing...</span>
          </div>
       )}
    </div>
  );
}
