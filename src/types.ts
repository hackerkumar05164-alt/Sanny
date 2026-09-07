export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'listening'
  | 'speaking'
  | 'interrupted'
  | 'executing_tool';

export type AtmosphereTheme =
  | 'cyber-rose'
  | 'royal-gold'
  | 'velvet-crimson'
  | 'midnight-matrix'
  | 'electric-violet'
  | 'neon-cyan'
  | 'sunset-flare';

export type SupportedLanguage = 'hindi' | 'english' | 'bhojpuri';

export type MoodVibe = 'attitude' | 'romantic_love' | 'boss_swag' | 'sassy_tease';

export type AssistantMode = 'lovely' | 'boss';
export type StudySubject = string;

export interface ToolExecution {
  id: string;
  name: string;
  args: Record<string, any>;
  timestamp: number;
  status: 'executing' | 'completed' | 'failed';
  result?: any;
}

export interface AudioMetrics {
  inputLevel: number;
  outputLevel: number;
  frequencies: Uint8Array;
}

export interface AssistantConfig {
  voice: 'Aoede' | 'Kore' | 'Zephyr' | 'Fenrir' | 'Puck' | 'Charon';
  atmosphere: AtmosphereTheme;
  autoOpenLinks: boolean;
  soundFx: boolean;
  language: SupportedLanguage;
}

export interface WhiteboardData {
  id: string;
  subject: string;
  question: string;
  topic: string;
  formulasOrRules?: string;
  steps: string[];
  finalAnswer: string;
  simpleExplanation?: string;
  doubtResolution?: string;
  timestamp: number;
}

export interface StudyMemoryItem {
  id: string;
  subject: string;
  topic: string;
  question?: string;
  summary: string;
  keyPoints: string[];
  timestamp: number;
}

export interface MathWhiteboardData {
  question: string;
  topic: string;
  formulasUsed: string;
  steps: string[];
  finalAnswer: string;
  simpleExplanation?: string;
  language?: SupportedLanguage;
}

export type Model3DType = 'optics' | 'dna' | 'atom' | 'solar' | 'geometry';

export interface Animation3DData {
  modelType: Model3DType;
  title: string;
  subject: string;
  angle?: number;
  lightRefractionIndex?: number;
  explanation: string;
  promptToCopy: string;
  language?: SupportedLanguage;
  interactiveControls?: {
    angle?: number;
    speed?: number;
    zoom?: number;
    color?: string;
  };
  timestamp?: number;
}

export interface ScreenControlData {
  action: 'open_app' | 'scroll' | 'back' | 'home' | 'click' | 'type_text';
  targetApp?: string;
  text?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  coordinates?: { x: number; y: number };
  status?: 'success' | 'running';
  message: string;
  language?: SupportedLanguage;
  timestamp?: number;
}

export interface ColorfulNotesData {
  title: string;
  subject: string;
  keyConcepts: string[];
  reactionsOrFormulas?: string[];
  proTipsOrStories?: string[];
  authorSignature: string;
  colorTheme?: 'cyan' | 'rose' | 'emerald' | 'amber' | 'violet';
  language?: SupportedLanguage;
  timestamp?: number;
}

export interface JavaCodeData {
  title: string;
  pseudoCode: string;
  javaCode: string;
  explanationHinglish: string;
  sampleInputOutput: string;
  mobileRunTip: string;
  authorSignature: string;
  timestamp?: number;
}

export interface PythonTutorialData {
  week: string;
  topic: string;
  codeSnippet: string;
  explanationHinglish: string;
  mobileRunner: string;
  authorSignature: string;
  timestamp?: number;
}

export interface ImagePromptData {
  topic: string;
  prompt: string;
  aspectRatio: string;
  suggestedAI: string;
  authorSignature: string;
  timestamp?: number;
}

export interface StudyRoutineData {
  dayType: 'daily' | 'sunday';
  title: string;
  slots: { time: string; activity: string; subject: string; icon: string }[];
  motivation: string;
  timestamp?: number;
}

export type CallMode = 'voice' | 'video';

export interface ExtractedEnglishWord {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  formatted: string; // e.g. "Apple (ऐपल) सेब"
}

export interface UploadedPdf {
  name: string;
  size: number;
  base64: string;
  mimeType: string;
}

export interface CopyBoxData {
  words: ExtractedEnglishWord[];
  rawText: string;
  sourceName?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: { type: 'image'; dataUrl: string; name?: string }[];
  pdfAttachment?: UploadedPdf;
  extractedWords?: ExtractedEnglishWord[];
  copyBoxText?: string;
  toolResult?: {
    type: string;
    data: any;
  };
  audioUrl?: string;
  isVoice?: boolean;
  isGenerating?: boolean;
}
