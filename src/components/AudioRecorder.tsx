import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Pause, Play, Trash2, Sparkles, Check, AlertTriangle, Info } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  isTranscribing: boolean;
  transcribingStatus: string;
}

const TOPICS = [
  { id: "discovery", label: "General Discovery Sync", filename: "realtime-discovery-sync.wav" },
  { id: "pricing", label: "Pricing & Budget Negotiation", filename: "realtime-pricing-negotiation.wav" },
  { id: "security", label: "Security & Sovereignty Compliance", filename: "realtime-security-compliance.wav" },
  { id: "sap", label: "SAP API & Middleware Integration", filename: "realtime-sap-integration.wav" }
];

export default function AudioRecorder({
  onRecordingComplete,
  isTranscribing,
  transcribingStatus
}: AudioRecorderProps) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio Visualizer refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Format recording duration (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start recording
  const startRecording = async () => {
    setPermissionError(null);
    chunksRef.current = [];

    try {
      // 1. Get audio stream from user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Initialize Web Audio API Analyser for live visualizer
      setupAudioVisualizer(stream);

      // 3. Setup MediaRecorder
      const options = { mimeType: "" };
      
      // Determine supported codecs
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options.mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        options.mimeType = "audio/ogg;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        options.mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        options.mimeType = "audio/mp4";
      }

      const recorder = new MediaRecorder(stream, options.mimeType ? options : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Build final audio blob
        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        
        // Convert to standard File
        const audioFile = new File([audioBlob], selectedTopic.filename, {
          type: mimeType,
          lastModified: Date.now()
        });

        // Callback parent with the completed file
        onRecordingComplete(audioFile);
      };

      // 4. Start recording and timer
      recorder.start(250); // Get chunks every 250ms
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error("Microphone access failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionError("Microphone access was denied. Please update your browser permissions for this frame.");
      } else {
        setPermissionError(`Could not access microphone: ${err.message || "Unknown error"}`);
      }
    }
  };

  // Setup Web Audio Analyser
  const setupAudioVisualizer = (stream: MediaStream) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("Could not set up Web Audio Context for visualizer:", e);
    }
  };

  // Pause / Resume
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      // Restart timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      // Pause timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state === "running") {
        audioContextRef.current.suspend();
      }
    }
  };

  // Stop & Save Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    cleanupRecordingResources();
  };

  // Cancel & Discard Recording
  const cancelRecording = () => {
    cleanupRecordingResources();
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  // Cleanup active resources
  const cleanupRecordingResources = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsRecording(false);
    setIsPaused(false);
  };

  // Live Canvas Wave Visualizer drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with soft background
      ctx.fillStyle = "rgba(248, 250, 252, 0.9)";
      ctx.fillRect(0, 0, width, height);

      // Draw grid/status line
      ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      let dataArray = new Uint8Array(0);
      let amplitude = 12; // Base height of procedural wave

      if (analyserRef.current && isRecording && !isPaused) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute average frequency level for visualizer scaling
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        amplitude = Math.max(8, (average / 255) * height * 0.7);
      } else if (isRecording && !isPaused) {
        // Procedural simulation if mic works but analyser has no feed
        amplitude = 15 + Math.sin(phase * 2) * 5;
      } else if (isPaused) {
        // flatlined state with tiny heartbeat
        amplitude = 2;
      } else {
        amplitude = 1;
      }

      phase += 0.15;

      // Draw beautiful dynamic sound waves
      ctx.lineWidth = 2.5;
      
      // Wave 1 - Indigo
      ctx.strokeStyle = isRecording && !isPaused ? "rgba(79, 70, 229, 0.85)" : "rgba(0,0,0,0.2)";
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 4 + phase;
        // Dampen at the screen edges for aesthetic feel
        const damping = Math.sin((x / width) * Math.PI);
        const y = height / 2 + Math.sin(angle) * amplitude * damping;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2 - Purple accent
      if (isRecording && !isPaused) {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(139, 92, 246, 0.55)";
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const angle = (x / width) * Math.PI * 3.5 - phase * 1.2;
          const damping = Math.sin((x / width) * Math.PI);
          const y = height / 2 + Math.cos(angle) * amplitude * 0.7 * damping;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Clean up timer/resources on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-4" id="audio-recorder-module">
      {/* 1. Topic/Focus Selector - Vital for mapping transcription template */}
      {!isRecording && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Select Meeting Focus (Selects AI Dialogue Model context)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-2 text-[11px] font-semibold text-left rounded-lg border transition-all flex items-center justify-between ${
                  selectedTopic.id === topic.id
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-3xs"
                    : "bg-white border-black/10 text-slate-700 hover:border-black/25 hover:bg-slate-50"
                }`}
              >
                <span>{topic.label}</span>
                {selectedTopic.id === topic.id && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-slate-400 italic">
            Choosing a focus presets optimal acoustic parsing and guides the AI model to locate relevant contract criteria during analysis.
          </p>
        </div>
      )}

      {/* 2. Recording Workspace */}
      <div className="border border-black/10 rounded-xl p-4 bg-white space-y-3 shadow-3xs">
        
        {/* Status indicator row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isRecording ? (isPaused ? "bg-amber-400" : "bg-red-500 animate-ping") : "bg-slate-300"}`}></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {isRecording ? (isPaused ? "Recording Paused" : "Live Recording Active") : "Ready to Record"}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {formatTime(recordingTime)}
          </span>
        </div>

        {/* Beautiful Real-Time Audio wave */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={60}
            className="w-full h-16 bg-[#F8FAFC] border border-black/5 rounded-lg overflow-hidden"
          />
          {isRecording && !isPaused && (
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-red-500 text-white font-mono text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
              REC
            </div>
          )}
        </div>

        {/* 3. Main Actions */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="px-6 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              Start Recording
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Pause/Resume button */}
              <button
                type="button"
                onClick={togglePause}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 active:scale-95 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                title={isPaused ? "Resume Recording" : "Pause Recording"}
              >
                {isPaused ? <Play className="w-4 h-4 fill-slate-800" /> : <Pause className="w-4 h-4 fill-slate-800" />}
                {isPaused ? "Resume" : "Pause"}
              </button>

              {/* Stop & Save */}
              <button
                type="button"
                onClick={stopRecording}
                className="px-5 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-slate-900 active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                Stop &amp; Save
              </button>

              {/* Cancel and discard */}
              <button
                type="button"
                onClick={cancelRecording}
                className="p-3 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl border border-transparent hover:border-red-100 active:scale-95 transition-all cursor-pointer"
                title="Discard Recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Permission and error warnings */}
        {permissionError && (
          <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg text-red-700">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <p className="text-[10px] leading-relaxed">{permissionError}</p>
          </div>
        )}

        {/* Quick tutorial or notes */}
        {!isRecording && !permissionError && (
          <div className="flex items-start gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500">
            <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
            <p className="text-[9px] leading-relaxed">
              Click &quot;Start Recording&quot; to open the browser audio consent prompt. Speak into your microphone during mock or live pitches to test conversation intelligence transcription.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
