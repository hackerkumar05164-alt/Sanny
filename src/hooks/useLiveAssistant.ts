import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ConnectionState,
  AtmosphereTheme,
  ToolExecution,
  SupportedLanguage,
  MoodVibe,
} from '../types';
import { AudioRecorder } from '../services/AudioRecorder';
import { AudioStreamer } from '../services/AudioStreamer';

export function useLiveAssistant() {
  const [status, setStatus] = useState<ConnectionState>('disconnected');
  const [atmosphere, setAtmosphere] = useState<AtmosphereTheme>('cyber-rose');
  const [language, setLanguage] = useState<SupportedLanguage>('hindi');
  const [moodVibe, setMoodVibe] = useState<MoodVibe>('attitude');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [inputLevel, setInputLevel] = useState<number>(0);
  const [outputLevel, setOutputLevel] = useState<number>(0);
  const [frequencies, setFrequencies] = useState<Uint8Array>(new Uint8Array(64));
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [lastTool, setLastTool] = useState<ToolExecution | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>('');

  // Video Call States
  const [callMode, setCallMode] = useState<'voice' | 'video'>('voice');
  const [isVideoCallActive, setIsVideoCallActive] = useState<boolean>(false);
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(null);
  const [isCameraMuted, setIsCameraMuted] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');

  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const streamerRef = useRef<AudioStreamer>(new AudioStreamer());
  const animationFrameRef = useRef<number | null>(null);
  const durationTimerRef = useRef<any>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const pendingMessagesRef = useRef<string[]>([]);
  
  // Video Frame Streaming Refs
  const videoIntervalRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize audio visualizer frame loop
  const startVisualizerLoop = useCallback(() => {
    const updateMetrics = () => {
      const rec = recorderRef.current;
      const str = streamerRef.current;

      const inLvl = rec.getAudioLevel();
      const outLvl = str.getAudioLevel();

      setInputLevel(inLvl);
      setOutputLevel(outLvl);

      if (str.getIsPlaying()) {
        setFrequencies(str.getFrequencies());
      } else {
        setFrequencies(rec.getFrequencies());
      }

      animationFrameRef.current = requestAnimationFrame(updateMetrics);
    };

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(updateMetrics);
  }, []);

  const stopVisualizerLoop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setInputLevel(0);
    setOutputLevel(0);
    setFrequencies(new Uint8Array(64));
  }, []);

  // Handle stream speaking status changes
  useEffect(() => {
    streamerRef.current.setOnSpeakingChange((isSpeaking) => {
      isSpeakingRef.current = isSpeaking;
      if (status !== 'disconnected' && status !== 'connecting') {
        if (isSpeaking) {
          setStatus('speaking');
        } else {
          setStatus('listening');
        }
      }
    });

    return () => {
      stopVisualizerLoop();
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [status, stopVisualizerLoop]);

  // Session duration timer
  useEffect(() => {
    if (status !== 'disconnected' && status !== 'connecting') {
      if (!durationTimerRef.current) {
        durationTimerRef.current = setInterval(() => {
          setSessionDuration((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }
  }, [status]);

  // Execute client side of tool calls
  const handleClientToolExecution = useCallback(async (toolCall: any) => {
    const functionCalls = toolCall.functionCalls;
    if (!functionCalls || functionCalls.length === 0) return;

    setStatus('executing_tool');
    const responses: any[] = [];

    for (const call of functionCalls) {
      const toolRecord: ToolExecution = {
        id: call.id || Math.random().toString(36).substring(7),
        name: call.name,
        args: call.args || {},
        timestamp: Date.now(),
        status: 'executing',
      };
      setLastTool(toolRecord);

      try {
        if (call.name === 'switchLanguage') {
          const targetLang = (call.args.language || 'hindi').toLowerCase() as SupportedLanguage;
          setLanguage(targetLang);
          responses.push({
            response: {
              output: {
                status: 'success',
                language: targetLang,
                message: `बॉस, भाषा ${targetLang} में बदल दी गई है!`,
              },
            },
            id: call.id,
            name: call.name,
          });
        } else if (call.name === 'singRomanticSong') {
          setMoodVibe('romantic_love');
          responses.push({
            response: {
              output: {
                status: 'success',
                song: call.args.songName,
                message: 'बॉस के लिए दिलकश नगमा शुरू!',
              },
            },
            id: call.id,
            name: call.name,
          });
        } else if (call.name === 'reciteBossShayari') {
          setMoodVibe(call.args.category === 'attitude' ? 'attitude' : 'romantic_love');
          responses.push({
            response: {
              output: {
                status: 'success',
                category: call.args.category,
                message: 'बॉस के लिए धमाकेदार शायरी!',
              },
            },
            id: call.id,
            name: call.name,
          });
        } else if (call.name === 'setAtmosphere') {
          if (call.args.atmosphere) {
            setAtmosphere(call.args.atmosphere as AtmosphereTheme);
          }
          responses.push({
            response: {
              output: {
                status: 'success',
                atmosphere: call.args.atmosphere,
                message: 'बॉस के लिए माहौल सेट हो गया!',
              },
            },
            id: call.id,
            name: call.name,
          });
        } else if (call.name === 'openWebsite') {
          if (call.args.url) {
            try {
              window.open(call.args.url, '_blank');
            } catch (e) {
              console.warn('Could not open external url:', e);
            }
          }
          responses.push({
            response: {
              output: {
                status: 'success',
                url: call.args.url,
                siteName: call.args.siteName,
                message: `बॉस के लिए ${call.args.siteName} ओपन कर दिया गया है!`,
              },
            },
            id: call.id,
            name: call.name,
          });
        }
      } catch (err: any) {
        console.error(`[useLiveAssistant] Error executing tool ${call.name}:`, err);
        responses.push({
          response: {
            output: {
              status: 'error',
              error: err.message || 'Tool execution failed',
            },
          },
          id: call.id,
          name: call.name,
        });
      }
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && responses.length > 0) {
      wsRef.current.send(
        JSON.stringify({
          type: 'tool_response',
          functionResponses: responses,
        })
      );
    }
  }, []);

  // Connect to Gemini Live
  const connect = useCallback(async () => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      setStatus('connecting');
      setErrorMessage(null);

      await streamerRef.current.init();

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live`;
      console.log('[useLiveAssistant] Connecting to live WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log('[useLiveAssistant] WebSocket opened');
        try {
          await recorderRef.current.start((base64PCM) => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: 'audio',
                  data: base64PCM,
                })
              );
            }
          });
          startVisualizerLoop();
        } catch (recErr: any) {
          console.error('[useLiveAssistant] Error starting AudioRecorder:', recErr);
          setErrorMessage('माइक्रोफोन शुरू करने में समस्या हुई। कृपया अनुमति दें।');
        }
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'connection_ack') {
            console.log('[useLiveAssistant] WebSocket server acknowledged connection');
          } else if (msg.type === 'session_ready') {
            console.log('[useLiveAssistant] Live session initialized for Boss with voice:', msg.voice);
            if (pendingMessagesRef.current.length > 0) {
              const pending = [...pendingMessagesRef.current];
              pendingMessagesRef.current = [];
              for (const text of pending) {
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                  wsRef.current.send(
                    JSON.stringify({
                      type: 'realtime_input',
                      text: text,
                    })
                  );
                }
              }
            }
          } else if (msg.type === 'audio' && msg.data) {
            await streamerRef.current.addPCM16Chunk(msg.data);
          } else if (msg.type === 'interrupted') {
            streamerRef.current.stop();
            setStatus('listening');
          } else if (msg.type === 'turn_complete') {
            if (!streamerRef.current.getIsPlaying()) {
              setStatus('listening');
            }
          } else if (msg.type === 'transcript') {
            if (msg.text) {
              setLastTranscript(msg.text);
            }
          } else if (msg.type === 'tool_call') {
            await handleClientToolExecution(msg.toolCall);
          } else if (msg.type === 'error') {
            console.error('[useLiveAssistant] Server error message:', msg.error);
            setErrorMessage(msg.error);
          }
        } catch (parseErr) {
          console.warn('[useLiveAssistant] Error parsing WebSocket message:', parseErr);
        }
      };

      ws.onerror = (err) => {
        console.warn('[useLiveAssistant] WebSocket error (handled):', err);
      };

      ws.onclose = () => {
        console.log('[useLiveAssistant] WebSocket closed');
        setStatus('disconnected');
        recorderRef.current.stop();
        streamerRef.current.stop();
        stopVisualizerLoop();
      };
    } catch (err: any) {
      console.error('[useLiveAssistant] Connection error:', err);
      setStatus('disconnected');
      setErrorMessage(err.message || 'कनेक्शन विफल रहा');
    }
  }, [handleClientToolExecution, startVisualizerLoop, stopVisualizerLoop]);

  // Disconnect cleanly
  const disconnect = useCallback(() => {
    if (videoIntervalRef.current) {
      clearInterval(videoIntervalRef.current);
      videoIntervalRef.current = null;
    }
    if (localVideoStream) {
      localVideoStream.getTracks().forEach((track) => track.stop());
      setLocalVideoStream(null);
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
    setIsVideoCallActive(false);
    setCallMode('voice');

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    recorderRef.current.stop();
    streamerRef.current.stop();
    stopVisualizerLoop();
    setStatus('disconnected');
  }, [localVideoStream, stopVisualizerLoop]);

  // User interruption
  const interrupt = useCallback(() => {
    streamerRef.current.stop();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'interrupt' }));
    }
    setStatus('listening');
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    recorderRef.current.setMuted(nextMute);
  }, [isMuted]);

  // Toggle Camera Mute (Pause Video)
  const toggleCameraMute = useCallback(() => {
    const nextMute = !isCameraMuted;
    setIsCameraMuted(nextMute);
    if (localVideoStream) {
      localVideoStream.getVideoTracks().forEach((track) => {
        track.enabled = !nextMute;
      });
    }
  }, [isCameraMuted, localVideoStream]);

  // Send Text Prompt to Gemini Live
  const sendTextMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'realtime_input',
          text: text,
        })
      );
    } else {
      pendingMessagesRef.current.push(text);
      connect();
    }
  }, [connect]);

  // Start Live Video Call (Camera + Gemini Live Vision Streaming at 1 FPS)
  const startVideoCall = useCallback(async () => {
    try {
      setErrorMessage(null);
      setCallMode('video');
      setIsVideoCallActive(true);

      // 1. Get webcam stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      setLocalVideoStream(stream);

      // Offscreen video element for capturing frames
      if (!videoElementRef.current) {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        videoElementRef.current = video;
      }
      videoElementRef.current.srcObject = stream;
      await videoElementRef.current.play().catch(() => {});

      if (!videoCanvasRef.current) {
        videoCanvasRef.current = document.createElement('canvas');
      }

      // 2. Connect Live Voice session if not connected
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        await connect();
      }

      // 3. Set frame loop at 1 FPS (1000ms)
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }

      videoIntervalRef.current = setInterval(() => {
        if (!isCameraMuted && videoElementRef.current && videoCanvasRef.current) {
          const video = videoElementRef.current;
          const canvas = videoCanvasRef.current;
          if (video.readyState >= 2) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = 480;
              canvas.height = 360;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
              const base64Data = dataUrl.split(',')[1];
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && base64Data) {
                wsRef.current.send(
                  JSON.stringify({
                    type: 'video',
                    data: base64Data,
                    mimeType: 'image/jpeg',
                  })
                );
              }
            }
          }
        }
      }, 1000);

      // Send opening video call prompt to Anaya
      setTimeout(() => {
        sendTextMessage('अनाया, मैंने आपके साथ लाइव वीडियो कॉल शुरू किया है! देखिए मैं आपके सामने लाइव हूँ, बताइए मैं कैसा लग रहा हूँ?');
      }, 1000);
    } catch (err: any) {
      console.error('[useLiveAssistant] Error starting video call:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'कैमरा की अनुमति नहीं मिली। कृपया ब्राउज़र में कैमरा चालू करें।'
          : 'कैमरा शुरू करने में समस्या हुई।'
      );
      setIsVideoCallActive(false);
      setCallMode('voice');
    }
  }, [cameraFacingMode, connect, isCameraMuted, sendTextMessage]);

  // Stop Video Call
  const stopVideoCall = useCallback(() => {
    if (videoIntervalRef.current) {
      clearInterval(videoIntervalRef.current);
      videoIntervalRef.current = null;
    }
    if (localVideoStream) {
      localVideoStream.getTracks().forEach((track) => track.stop());
      setLocalVideoStream(null);
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
    setIsVideoCallActive(false);
    setCallMode('voice');
  }, [localVideoStream]);

  // Toggle Camera Facing Mode (Front / Back)
  const toggleCamera = useCallback(async () => {
    const nextMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(nextMode);

    if (isVideoCallActive && localVideoStream) {
      localVideoStream.getTracks().forEach((track) => track.stop());
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: nextMode,
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });
        setLocalVideoStream(newStream);
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = newStream;
          await videoElementRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error('[useLiveAssistant] Error switching camera:', err);
      }
    }
  }, [cameraFacingMode, isVideoCallActive, localVideoStream]);

  // Trigger quick romantic & attitude requests
  const triggerBossAction = useCallback((actionType: 'attitude_shayari' | 'love_shayari' | 'sing_song' | 'boss_swag' | 'sassy_compliment') => {
    let prompt = '';
    switch (actionType) {
      case 'attitude_shayari':
        prompt = 'अनाया, अपने बॉस के लिए एक धांसू और कातिलाना Attitude & Ego शायरी सुनाओ!';
        break;
      case 'love_shayari':
        prompt = 'अनाया, अपने बॉस के लिए एक बहुत ही प्यारी और रोमांटिक Love शायरी सुनाओ!';
        break;
      case 'sing_song':
        prompt = 'अनाया, अपने बॉस के लिए अपनी सुरीली आवाज़ में एक रोमांटिक बॉलीवुड गाना गाओ!';
        break;
      case 'boss_swag':
        prompt = 'अनाया, अपने बॉस के स्वैग, रुतबे और दबदबे पर एक धमाकेदार शायरी या तारीफ बोलो!';
        break;
      case 'sassy_compliment':
        prompt = 'अनाया, थोड़े नखरे और फुल एटीट्यूड के साथ अपने बॉस से प्यार भरी बातें करो!';
        break;
    }
    sendTextMessage(prompt);
  }, [sendTextMessage]);

  return {
    status,
    atmosphere,
    setAtmosphere,
    language,
    setLanguage,
    moodVibe,
    setMoodVibe,
    isMuted,
    toggleMute,
    inputLevel,
    outputLevel,
    frequencies,
    sessionDuration,
    lastTool,
    errorMessage,
    lastTranscript,
    // Video Call
    callMode,
    setCallMode,
    isVideoCallActive,
    localVideoStream,
    isCameraMuted,
    cameraFacingMode,
    startVideoCall,
    stopVideoCall,
    toggleCamera,
    toggleCameraMute,
    connect,
    disconnect,
    interrupt,
    sendTextMessage,
    triggerBossAction,
  };
}
