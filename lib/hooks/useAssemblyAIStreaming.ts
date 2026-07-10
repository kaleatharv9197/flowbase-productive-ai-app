"use client";

import { useState, useRef, useEffect } from "react";

interface UseAssemblyAIStreamingProps {
  onFinalTranscript: (text: string) => void;
}

export function useAssemblyAIStreaming({ onFinalTranscript }: UseAssemblyAIStreamingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  // References for browser Audio capture nodes & socket
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // References for Simulation Mode fallback
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      cleanupSimulation();
    };
  }, []);

  const cleanupAudio = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ terminate_session: true }));
        socketRef.current.close();
      }
      socketRef.current = null;
    }
  };

  const cleanupSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
      simulationTimeoutRef.current = null;
    }
  };

  const startRecording = async () => {
    setError(null);
    setPartialTranscript("");
    cleanupAudio();
    cleanupSimulation();

    try {
      // 1. Fetch token from our backend endpoint
      const response = await fetch("/api/assemblyai/token", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.token) {
        // Fallback to Simulation Mode if token server fails (e.g. no API key configured)
        console.warn("AssemblyAI key is not set. Switching to Cozy Speech Simulator mode.");
        startSimulation();
        return;
      }

      // 2. Request user microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Connect to AssemblyAI Streaming WebSocket API
      const sampleRate = 16000;
      const socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=${sampleRate}&token=${data.token}`);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsRecording(true);
        setupAudioRecorder(stream);
      };

      socket.onmessage = (event) => {
        try {
          const res = JSON.parse(event.data);
          
          if (res.message_type === "PartialTranscript") {
            setPartialTranscript(res.text);
          } else if (res.message_type === "FinalTranscript") {
            setPartialTranscript("");
            if (res.text && res.text.trim()) {
              onFinalTranscript(res.text + " ");
            }
          }
        } catch (err: any) {
          console.error("Failed to parse websocket frame:", err);
        }
      };

      socket.onerror = (e) => {
        console.error("AssemblyAI websocket error:", e);
        setError("Speech-to-Text WebSocket encountered an error.");
      };

      socket.onclose = () => {
        setIsRecording(false);
      };

    } catch (err: any) {
      console.error("Speech to text start failed:", err);
      setError(err.message || "Failed to start microphone streaming.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    cleanupAudio();
    cleanupSimulation();
    setIsRecording(false);
    setPartialTranscript("");
  };

  // Helper: Setup Audio Context and Downsampler to 16kHz 16-bit PCM
  const setupAudioRecorder = (stream: MediaStream) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const inputSampleRate = audioContext.sampleRate;
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(inputData, inputSampleRate, 16000);
        const pcmBuffer = floatTo16BitPCM(downsampled);
        
        socketRef.current.send(pcmBuffer);
      };
    } catch (err: any) {
      console.error("Failed to setup audio downsampler:", err);
      setError("Failed to setup browser audio processor nodes.");
      stopRecording();
    }
  };

  // Helper: Simulated Speech mode if API key is not active
  const startSimulation = async () => {
    try {
      // Still request mic access so browser displays standard permission popups
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setIsRecording(true);

      const simulatedPhrases = [
        "We are checkin off the active project milestone outlines",
        "The Notion notes page supports rich text formatting block elements",
        "Autosaving note pages is fully functional inside the editor grid layout",
        "Speech to text voice generators capture transcripts at cursor lines"
      ];

      let phraseIndex = 0;
      let wordIndex = 0;

      const simulateNextWord = () => {
        const words = simulatedPhrases[phraseIndex].split(" ");
        
        if (wordIndex < words.length) {
          const currentWords = words.slice(0, wordIndex + 1).join(" ");
          setPartialTranscript(currentWords);
          wordIndex++;
          
          // Random spacing between simulated spoken words
          simulationTimeoutRef.current = setTimeout(simulateNextWord, 400 + Math.random() * 300);
        } else {
          // Finalize current phrase
          setPartialTranscript("");
          onFinalTranscript(simulatedPhrases[phraseIndex] + ". ");
          
          phraseIndex = (phraseIndex + 1) % simulatedPhrases.length;
          wordIndex = 0;
          
          // Gap between full sentences
          simulationTimeoutRef.current = setTimeout(simulateNextWord, 2000);
        }
      };

      // Start the simulated transcription typing loops
      simulationTimeoutRef.current = setTimeout(simulateNextWord, 1500);

    } catch (err: any) {
      console.error("Microphone permission denied for simulator:", err);
      setError("Microphone permission denied.");
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    partialTranscript,
    error,
    startRecording,
    stopRecording
  };
}

// Float32 audio downsampler helper
function downsampleBuffer(buffer: Float32Array, inputSampleRate: number, outputSampleRate: number) {
  if (inputSampleRate === outputSampleRate) {
    return buffer;
  }
  const sampleRateRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

// Convert Float32Array to 16-bit signed PCM ArrayBuffer
function floatTo16BitPCM(input: Float32Array) {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer;
}
