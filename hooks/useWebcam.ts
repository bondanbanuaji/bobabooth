import { useState, useRef, useCallback, useEffect } from 'react';

interface UseWebcamOptions {
  onSuccess?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
  deviceId?: string;
}

export function useWebcam({ onSuccess, onError, deviceId }: UseWebcamOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices.filter(d => d.kind === 'videoinput'));
    } catch (e) {
      console.error("Could not get device list", e);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, []);

  const startWebcam = useCallback(async () => {
    try {
      if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" })
        },
        audio: false,
      });
      
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(e => console.error("Video play failed:", e));
      }
      
      if (onSuccess) {
        onSuccess(mediaStream);
      }
      
      await getDevices();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to access webcam';
      setError(errMsg);
      if (onError) {
        onError(errMsg);
      }
    }
  }, [deviceId, onSuccess, onError, getDevices]);

  // Refresh devices list when devices change
  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [getDevices]);

  // Fetch devices initially in case permissions are already granted
  useEffect(() => {
    getDevices();
  }, [getDevices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { stream, error, videoRef, startWebcam, stopWebcam, devices };
}
