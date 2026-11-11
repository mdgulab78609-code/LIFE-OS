class SoundManager {
  private audioCtx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private ambientGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playClick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  playHabitDone() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.25);
      });
    } catch (e) {}
  }

  playStreakFanfare() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const chords = [
        { freqs: [523.25, 659.25, 783.99], time: 0 },
        { freqs: [587.33, 739.99, 880.0], time: 0.15 },
        { freqs: [659.25, 830.61, 987.77], time: 0.3 },
        { freqs: [783.99, 987.77, 1174.66, 1567.98], time: 0.45, duration: 0.7 },
      ];
      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + chord.time);
          const dur = chord.duration || 0.22;
          gain.gain.setValueAtTime(0.09, ctx.currentTime + chord.time);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + chord.time + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + chord.time);
          osc.stop(ctx.currentTime + chord.time + dur);
        });
      });
    } catch (e) {}
  }

  playTimerComplete() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // Resonant bell sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch (e) {}
  }

  // Synthesize white noise / ambient focus sound
  startAmbient(type: 'whitenoise' | 'rain' | 'binaural') {
    this.stopAmbient();
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      if (type === 'binaural') {
        // 200Hz left, 240Hz right (40Hz gamma binaural beat for deep focus)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();

        oscL.frequency.value = 200;
        oscR.frequency.value = 240;
        gain.gain.value = 0.05;

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(ctx.destination);

        oscL.start();
        oscR.start();

        this.ambientGain = gain;
        this.noiseNode = merger;
        return;
      }

      // Buffer-based white noise with filter for rain
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 800; // Muffled rain
      } else {
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
      }

      const gain = ctx.createGain();
      gain.gain.value = 0.035;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      this.ambientGain = gain;
      this.noiseNode = whiteNoise;
    } catch (e) {}
  }

  stopAmbient() {
    try {
      if (this.noiseNode) {
        if ('stop' in this.noiseNode) {
          (this.noiseNode as any).stop();
        }
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();
