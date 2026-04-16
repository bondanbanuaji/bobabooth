import { useState, useRef, useCallback, useEffect } from 'react';

interface UseWebcamOptions {
  onSuccess?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
}

export function useWebcam({ onSuccess, onError }: UseWebcamOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      if (stream) {
        // Already started
        return;
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user"
        },
        audio: false,
      });
      
      setStream(mediaStream);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      if (onSuccess) {
        onSuccess(mediaStream);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to access webcam';
      setError(errMsg);
      if (onError) {
        onError(errMsg);
      }
    }
  }, [stream, onSuccess, onError]);

  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return { stream, error, videoRef, startWebcam, stopWebcam };
}
