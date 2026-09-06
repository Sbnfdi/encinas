import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioAmbience: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const startSoundtrack = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.065, ctx.currentTime + 3); // subtle, luxury quiet level
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Warm cinematic luxury chord (A1, E2, A2, C#3)
      const freqs = [55.0, 82.41, 110.0, 138.59];
      const oscs: OscillatorNode[] = [];

      // Warm low-pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      filter.connect(masterGain);

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle chorus detune
        const detuneAmount = (i % 2 === 0 ? 1 : -1) * (i * 2.5);
        osc.detune.setValueAtTime(detuneAmount, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.35 / (i + 1), ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;
      setIsPlaying(true);
    } catch (err) {
      console.warn('Web Audio playback error:', err);
    }
  };

  const stopSoundtrack = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try { osc.stop(); osc.disconnect(); } catch { /* no-op */ }
        });
        oscillatorsRef.current = [];
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
        setIsPlaying(false);
      }, 1500);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopSoundtrack();
    } else {
      startSoundtrack();
    }
  };

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); osc.disconnect(); } catch { /* no-op */ }
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      className="glass-pill flex items-center gap-2.5 px-3.5 py-2 rounded-full cursor-pointer text-xs uppercase tracking-widest transition-all"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.45rem 0.95rem',
        borderRadius: '9999px',
        color: isPlaying ? 'var(--gold-light)' : 'var(--text-secondary)',
        borderColor: isPlaying ? 'var(--border-gold)' : 'rgba(255,255,255,0.1)',
        fontSize: '0.72rem',
        letterSpacing: '0.12em',
      }}
      title={isPlaying ? 'Mute cinematic ambient audio' : 'Enable ambient soundtrack'}
      aria-label="Toggle ambient soundtrack"
    >
      {isPlaying ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '14px' }}>
            <span className="wave-bar" style={{ height: '6px' }} />
            <span className="wave-bar" style={{ height: '14px' }} />
            <span className="wave-bar" style={{ height: '10px' }} />
            <span className="wave-bar" style={{ height: '12px' }} />
          </div>
          <span>ATMOSPHERE</span>
        </>
      ) : (
        <>
          <VolumeX size={14} style={{ opacity: 0.6 }} />
          <span>SOUND: OFF</span>
        </>
      )}
    </button>
  );
};
