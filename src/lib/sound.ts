class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playCorrect() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880, now + 0.12); // A5

    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.setValueAtTime(1174.66, now + 0.12); // D6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  }

  public playIncorrect() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130.81, now); // C3
    osc.frequency.setValueAtTime(110.00, now + 0.15); // A2

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playDailyDouble() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [
      { freq: 440, start: 0, dur: 0.12 },
      { freq: 554.37, start: 0.12, dur: 0.12 },
      { freq: 659.25, start: 0.24, dur: 0.12 },
      { freq: 880, start: 0.36, dur: 0.35 },
      { freq: 659.25, start: 0.72, dur: 0.12 },
      { freq: 880, start: 0.85, dur: 0.5 }
    ];

    const now = ctx.currentTime;
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.25, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + dur);
    });
  }

  public playTimerTick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playTimesUp() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.15, 0.3].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now + offset);

      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
  }

  public playFinalJeopardyThinkTheme() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Classic 30-second iconic tune notes
    const melody = [
      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 329.63, dur: 0.35, pause: 0.05 }, // E4
      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 196.00, dur: 0.35, pause: 0.05 }, // G3
      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 329.63, dur: 0.35, pause: 0.05 }, // E4
      { note: 261.63, dur: 0.70, pause: 0.10 }, // C4 (long)

      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 329.63, dur: 0.35, pause: 0.05 }, // E4
      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 392.00, dur: 0.35, pause: 0.05 }, // G4
      { note: 349.23, dur: 0.50, pause: 0.05 }, // F4
      { note: 329.63, dur: 0.50, pause: 0.05 }, // E4
      { note: 293.66, dur: 0.50, pause: 0.10 }, // D4

      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 329.63, dur: 0.35, pause: 0.05 }, // E4
      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 196.00, dur: 0.35, pause: 0.05 }, // G3
      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 329.63, dur: 0.35, pause: 0.05 }, // E4
      { note: 261.63, dur: 0.70, pause: 0.10 }, // C4

      { note: 329.63, dur: 0.35, pause: 0.05 }, // E4
      { note: 293.66, dur: 0.35, pause: 0.05 }, // D4
      { note: 261.63, dur: 0.35, pause: 0.05 }, // C4
      { note: 246.94, dur: 0.35, pause: 0.05 }, // B3
      { note: 220.00, dur: 0.50, pause: 0.05 }, // A3
      { note: 196.00, dur: 0.50, pause: 0.05 }, // G3
      { note: 261.63, dur: 0.90, pause: 0.10 }  // C4
    ];

    let t = ctx.currentTime;
    melody.forEach(({ note, dur, pause }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur);

      t += dur + pause;
    });
  }
}

export const soundFx = new SoundManager();
