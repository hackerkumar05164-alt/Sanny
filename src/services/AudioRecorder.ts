/**
 * AudioRecorder captures microphone input and streams 16kHz PCM16 little-endian audio.
 */
export class AudioRecorder {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isRecording: boolean = false;
  private isMuted: boolean = false;
  private onAudioChunkCallback: ((base64Chunk: string) => void) | null = null;
  private frequencyData: Uint8Array = new Uint8Array(64);

  public async start(onAudioChunk: (base64Chunk: string) => void): Promise<void> {
    if (this.isRecording) return;
    this.onAudioChunkCallback = onAudioChunk;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 16000 });

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 128;
      this.analyserNode.smoothingTimeConstant = 0.8;
      this.frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);

      // 2048 buffer size at 16kHz gives ~128ms ultra-fast real-time chunks for lowest latency
      this.processorNode = this.audioContext.createScriptProcessor(2048, 1, 1);

      this.processorNode.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!this.isRecording || this.isMuted) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const actualSampleRate = this.audioContext?.sampleRate || 16000;

        let pcmData: Float32Array;
        if (actualSampleRate !== 16000) {
          // Downsample to 16000Hz
          pcmData = this.resampleAudio(inputData, actualSampleRate, 16000);
        } else {
          pcmData = inputData;
        }

        const base64PCM = this.floatTo16BitPCMBase64(pcmData);
        if (this.onAudioChunkCallback && base64PCM) {
          this.onAudioChunkCallback(base64PCM);
        }
      };

      const muteGain = this.audioContext.createGain();
      muteGain.gain.value = 0;

      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.processorNode);
      this.processorNode.connect(muteGain);
      muteGain.connect(this.audioContext.destination);

      this.isRecording = true;
    } catch (err) {
      console.error('[AudioRecorder] Failed to start microphone recording:', err);
      this.stop();
      throw err;
    }
  }

  public stop(): void {
    this.isRecording = false;

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode.onaudioprocess = null;
      this.processorNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.onAudioChunkCallback = null;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getAudioLevel(): number {
    if (!this.analyserNode || !this.isRecording || this.isMuted) return 0;
    this.analyserNode.getByteFrequencyData(this.frequencyData);
    let sum = 0;
    for (let i = 0; i < this.frequencyData.length; i++) {
      sum += this.frequencyData[i];
    }
    const avg = sum / this.frequencyData.length;
    return Math.min(1, avg / 128);
  }

  public getFrequencies(): Uint8Array {
    if (!this.analyserNode || !this.isRecording || this.isMuted) {
      return new Uint8Array(64);
    }
    this.analyserNode.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  private resampleAudio(source: Float32Array, fromRate: number, toRate: number): Float32Array {
    const ratio = fromRate / toRate;
    const newLength = Math.round(source.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const index = Math.floor(srcIndex);
      const frac = srcIndex - index;
      const nextIndex = Math.min(index + 1, source.length - 1);
      result[i] = source[index] * (1 - frac) + source[nextIndex] * frac;
    }
    return result;
  }

  private floatTo16BitPCMBase64(input: Float32Array): string {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      const pcm = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(i * 2, pcm, true);
    }

    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const slice = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, slice as any);
    }
    return btoa(binary);
  }
}
