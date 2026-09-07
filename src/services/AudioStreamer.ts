/**
 * AudioStreamer plays 24kHz PCM16 audio chunks from Gemini Live with gapless scheduling
 * and supports instant cancellation/interruption.
 */
export class AudioStreamer {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private nextStartTime: number = 0;
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private frequencyData: Uint8Array = new Uint8Array(64);
  private isPlaying: boolean = false;
  private onSpeakingChangeCallback: ((isSpeaking: boolean) => void) | null = null;
  private volume: number = 1.0;

  constructor() {
    // Lazy init audioContext on user interaction
  }

  public async init(): Promise<void> {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 24000 });
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.volume;

      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 128;
      this.analyserNode.smoothingTimeConstant = 0.8;
      this.frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);

      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  public setOnSpeakingChange(cb: (isSpeaking: boolean) => void): void {
    this.onSpeakingChangeCallback = cb;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.volume, this.audioContext?.currentTime || 0);
    }
  }

  public async addPCM16Chunk(base64Data: string): Promise<void> {
    await this.init();
    if (!this.audioContext || !this.gainNode) return;

    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = this.audioContext.createBuffer(
      1,
      float32Array.length,
      24000
    );
    audioBuffer.copyToChannel(float32Array, 0);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.gainNode);

    const currentTime = this.audioContext.currentTime;
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime;
    }

    const scheduledStartTime = this.nextStartTime;
    source.start(scheduledStartTime);
    this.nextStartTime += audioBuffer.duration;

    this.activeSources.add(source);
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.onSpeakingChangeCallback?.(true);
    }

    source.onended = () => {
      this.activeSources.delete(source);
      if (this.activeSources.size === 0) {
        this.isPlaying = false;
        this.onSpeakingChangeCallback?.(false);
      }
    };
  }

  public handleInterruption(): void {
    console.log('[AudioStreamer] Interruption requested - stopping all active audio buffers');
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // already stopped
      }
    }
    this.activeSources.clear();
    if (this.audioContext) {
      this.nextStartTime = this.audioContext.currentTime;
    }
    this.isPlaying = false;
    this.onSpeakingChangeCallback?.(false);
  }

  public getAudioLevel(): number {
    if (!this.analyserNode || !this.isPlaying) return 0;
    this.analyserNode.getByteFrequencyData(this.frequencyData);
    let sum = 0;
    for (let i = 0; i < this.frequencyData.length; i++) {
      sum += this.frequencyData[i];
    }
    const avg = sum / this.frequencyData.length;
    return Math.min(1, avg / 128);
  }

  public getFrequencies(): Uint8Array {
    if (!this.analyserNode || !this.isPlaying) {
      return new Uint8Array(64);
    }
    this.analyserNode.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public stop(): void {
    this.handleInterruption();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }
}
