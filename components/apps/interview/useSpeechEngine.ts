'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AvatarPersona, PERSONA_DETAILS } from './types';

interface UseSpeechEngineProps {
  persona: AvatarPersona;
  onAnswerCaptured?: (text: string) => void;
}

// Interface for Web Speech Recognition event
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export function useSpeechEngine({ persona, onAnswerCaptured }: UseSpeechEngineProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mouthOpen, setMouthOpen] = useState(0); // 0 to 1 for avatar lip-sync animation
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionLike;
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      };
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          if (onAnswerCaptured) {
            onAnswerCaptured(currentTranscript);
          }
        };

        recognition.onerror = (event: { error: string }) => {
          console.warn('SpeechRecognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSpeechSupported(false);
      }
    }
  }, [onAnswerCaptured]);

  // Start listening (STT)
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Failed to start SpeechRecognition:', err);
      }
    } else {
      setIsListening(true); // UI fallback mode
    }
  }, [isListening]);

  // Stop listening (STT)
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Failed to stop SpeechRecognition:', err);
      }
    }
    setIsListening(false);
  }, [isListening]);

  // Text-To-Speech (TTS) engine with synced Avatar Lip-sync simulation
  const speakText = useCallback(
    (text: string, onEndCallback?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        if (onEndCallback) onEndCallback();
        return;
      }

      // Stop any ongoing speech or recognition
      window.speechSynthesis.cancel();
      stopListening();

      const details = PERSONA_DETAILS[persona] || PERSONA_DETAILS['Corporate Recruiter'];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = details.voiceRate;
      utterance.pitch = details.voicePitch;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        // Start mouth keyframe lip-sync animation simulation
        const startTime = Date.now();
        const animateMouth = () => {
          const elapsed = (Date.now() - startTime) / 1000;
          // Sine wave modulation + random variance for realistic lip sync
          const rawScale = Math.sin(elapsed * 12) * 0.4 + Math.cos(elapsed * 7) * 0.3 + 0.3;
          setMouthOpen(Math.max(0, Math.min(1, rawScale)));
          animFrameRef.current = requestAnimationFrame(animateMouth);
        };
        animFrameRef.current = requestAnimationFrame(animateMouth);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setMouthOpen(0);
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
        if (onEndCallback) {
          onEndCallback();
        }
      };

      utterance.onerror = (err) => {
        console.warn('TTS Speech error:', err);
        setIsSpeaking(false);
        setMouthOpen(0);
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
        if (onEndCallback) {
          onEndCallback();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [persona, stopListening]
  );

  // Stop TTS speech
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setMouthOpen(0);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  return {
    isSpeaking,
    isListening,
    transcript,
    setTranscript,
    mouthOpen,
    isSpeechSupported,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  };
}
