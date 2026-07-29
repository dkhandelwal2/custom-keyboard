
import { useRef, useCallback } from 'react';

interface SoundConfig {
  frequency: number;
  type: OscillatorType;
  duration: number;
  attackTime: number;
  releaseTime: number;
}

const ROW_SOUND_CONFIGS: SoundConfig[] = [
  { frequency: 820, type: 'sine',     duration: 0.08, attackTime: 0.005, releaseTime: 0.06 }, // numbers row
  { frequency: 520, type: 'sine',     duration: 0.09, attackTime: 0.005, releaseTime: 0.07 }, // QWERTY row
  { frequency: 360, type: 'triangle', duration: 0.10, attackTime: 0.005, releaseTime: 0.08 }, // ASDF row
  { frequency: 220, type: 'triangle', duration: 0.10, attackTime: 0.005, releaseTime: 0.08 }, // ZXCV row
  { frequency:  90, type: 'triangle', duration: 0.14, attackTime: 0.008, releaseTime: 0.12 }, // space row
];

const SPECIAL_KEY_CONFIG: SoundConfig = {
  frequency: 440,
  type: 'square',
  duration: 0.07,
  attackTime: 0.003,
  releaseTime: 0.06,
};

export function useSoundEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  const getAudioCtx = useCallback((): AudioContext => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      
      // Precompute noise buffer once to prevent main thread blocking on keystrokes
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.15;
      }
      noiseBufferRef.current = noiseBuffer;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback((key: string, rowIndex: number) => {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      const isSpecial = ['Backspace', 'Enter', 'Tab', 'Shift', 'Caps', 'Alt', 'Ctrl'].includes(key);
      const config = isSpecial
        ? SPECIAL_KEY_CONFIG
        : ROW_SOUND_CONFIGS[Math.min(rowIndex, ROW_SOUND_CONFIGS.length - 1)];

      // Create nodes
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Add subtle detuning for character variety
      const detuneAmount = (key.charCodeAt(0) % 40) - 20;
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, now);
      oscillator.detune.setValueAtTime(detuneAmount, now);

      // ADSR-like envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.35, now + config.attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

      // Noise click layer for realism
      if (noiseBufferRef.current) {
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBufferRef.current;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        noiseSource.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start(now);
        noiseSource.stop(now + 0.03);
      }

      // Connect and play
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + config.duration);
    } catch (e) {
      // Silently fail if audio not available
    }
  }, [getAudioCtx]);

  return { playClick };
}
