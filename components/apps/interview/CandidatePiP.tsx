'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, User } from 'lucide-react';

interface CandidatePiPProps {
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
}

export default function CandidatePiP({
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
}: CandidatePiPProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number | null>(null);

  // Initialize Media Devices (Webcam + Microphone)
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          activeStream = mediaStream;
          setStream(mediaStream);

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          // Setup AudioContext for waveform visualizer
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;

          const source = audioCtx.createMediaStreamSource(mediaStream);
          source.connect(analyser);

          audioCtxRef.current = audioCtx;
          analyserRef.current = analyser;
        }
      } catch (err) {
        console.warn('Camera / Microphone permission denied or unavailable:', err);
      }
    }

    initMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Update track enabled state when isMuted or isCameraOff changes
  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !isCameraOff));
      stream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
    }
  }, [stream, isMuted, isCameraOff]);

  // Audio Waveform Canvas Animation
  useEffect(() => {
    let isRunning = true;

    function renderWaveform() {
      if (!isRunning) return;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          ctx.clearRect(0, 0, width, height);

          if (analyserRef.current && !isMuted) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);

            const barWidth = (width / dataArray.length) * 1.5;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
              const barHeight = (dataArray[i] / 255) * height * 0.9;
              ctx.fillStyle = `rgba(52, 211, 153, ${0.4 + (dataArray[i] / 255) * 0.6})`;
              ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
              x += barWidth;
            }
          } else {
            // Draw idle line if muted or no analyser
            ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
            ctx.fillRect(0, height / 2 - 1, width, 2);
          }
        }
      }

      animRef.current = requestAnimationFrame(renderWaveform);
    }

    renderWaveform();

    return () => {
      isRunning = false;
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isMuted]);

  return (
    <div className="relative w-44 h-32 sm:w-52 sm:h-36 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden group">
      {/* Video Feed */}
      {!isCameraOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
          <User size={32} className="mb-1 text-slate-500" />
          <span className="text-[10px] uppercase font-semibold tracking-wider">Cam Off</span>
        </div>
      )}

      {/* Candidate PiP Header Tag */}
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-slate-950/70 backdrop-blur-sm text-[10px] font-semibold text-slate-200">
        You (Candidate)
      </div>

      {/* Real-time Mic Audio Waveform Bar at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-950/80 backdrop-blur-sm px-2 flex items-center justify-between">
        <canvas ref={canvasRef} width={120} height={12} className="w-24 h-3" />
        <span className="text-[9px] font-medium text-slate-400">
          {isMuted ? 'Muted' : 'Mic Active'}
        </span>
      </div>

      {/* Hover Action Quick Controls */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-full border ${
            isMuted ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-800 border-slate-600 text-slate-200'
          } hover:scale-105 transition-transform`}
          title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
        </button>
        <button
          onClick={onToggleCamera}
          className={`p-2 rounded-full border ${
            isCameraOff ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-800 border-slate-600 text-slate-200'
          } hover:scale-105 transition-transform`}
          title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
        >
          {isCameraOff ? <CameraOff size={14} /> : <Camera size={14} />}
        </button>
      </div>
    </div>
  );
}
