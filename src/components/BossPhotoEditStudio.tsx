import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Upload,
  Sparkles,
  Download,
  RotateCcw,
  Sliders,
  Eye,
  Send,
  Wand2,
  Mic,
  MicOff,
  ChevronLeft,
  Crown,
  Heart,
  Image as ImageIcon,
  Check,
  Sun,
  Contrast,
  Palette,
  Flame,
} from 'lucide-react';

interface BossPhotoEditStudioProps {
  onBackToCall: () => void;
  onSendToChat?: (photoDataUrl: string, comment?: string) => void;
}

interface PresetOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  instruction: string;
  filters: {
    brightness: number;
    contrast: number;
    saturate: number;
    sepia: number;
    hueRotate: number;
    blur: number;
    goldGlow: boolean;
  };
}

const PRESETS: PresetOption[] = [
  {
    id: 'royal_glow',
    name: 'रॉयल बॉस ग्लो',
    icon: '👑',
    description: 'चेहरे पर रोबदार चमक और गोल्डन ऑरा',
    instruction: 'फोटो को रॉयल बॉस लुक दो, चेहरे पर स्मूथ लाइटिंग, गोल्डन ग्लो और लग्ज़री टोन लाओ',
    filters: {
      brightness: 1.15,
      contrast: 1.18,
      saturate: 1.25,
      sepia: 0.15,
      hueRotate: 0,
      blur: 0,
      goldGlow: true,
    },
  },
  {
    id: 'cinematic',
    name: 'सिनेमैटिक 4K',
    icon: '🎬',
    description: 'मूवी जैसा गहरा कंट्रास्ट और बोल्ड टोन',
    instruction: 'सिनेमैटिक बॉलीवुड मूवी कलर ग्रेड, शार्प डीटेल्स और रिच शैडोज़',
    filters: {
      brightness: 1.05,
      contrast: 1.35,
      saturate: 1.2,
      sepia: 0.05,
      hueRotate: -10,
      blur: 0,
      goldGlow: false,
    },
  },
  {
    id: 'golden_hour',
    name: 'गोल्डन ऑवर',
    icon: '🌅',
    description: 'डूबते सूरज की सुनहरी गर्म रोशनी',
    instruction: 'गोल्डन ऑवर सनसेट लाइट, वार्म एम्बर कलर्स और ड्रीम लाइक टोन',
    filters: {
      brightness: 1.12,
      contrast: 1.15,
      saturate: 1.35,
      sepia: 0.35,
      hueRotate: 8,
      goldGlow: true,
      blur: 0,
    },
  },
  {
    id: 'noir_boss',
    name: 'रॉयल ब्लैक & व्हाइट',
    icon: '🖤',
    description: 'हाई कंट्रास्ट क्लासिक मोनोक्रोम',
    instruction: 'हाई कंट्रास्ट क्लासिक ब्लैक एंड व्हाइट विंटेज पोर्ट्रेट',
    filters: {
      brightness: 1.1,
      contrast: 1.45,
      saturate: 0,
      sepia: 0,
      hueRotate: 0,
      blur: 0,
      goldGlow: false,
    },
  },
  {
    id: 'beauty_touch',
    name: 'अनाया स्पेशल टच',
    icon: '🌸',
    description: 'सुंदर और चमकदार स्किन फिनिश',
    instruction: 'चेहरा साफ़, आकर्षक आंखें और सॉफ्ट पोर्ट्रेट ब्यूटी इफ़ेक्ट',
    filters: {
      brightness: 1.2,
      contrast: 1.1,
      saturate: 1.15,
      sepia: 0.08,
      hueRotate: 0,
      blur: 0,
      goldGlow: true,
    },
  },
  {
    id: 'portrait_bokeh',
    name: 'स्टूडियो बोकेह',
    icon: '🖼️',
    description: 'सब्जेक्ट पर फोकस और स्टूडियो लाइटिंग',
    instruction: 'DSLR पोर्ट्रेट इफ़ेक्ट, सब्जेक्ट शार्प और बैकग्राउंड स्मूथ',
    filters: {
      brightness: 1.12,
      contrast: 1.2,
      saturate: 1.2,
      sepia: 0.05,
      hueRotate: 0,
      blur: 0,
      goldGlow: false,
    },
  },
];

export const BossPhotoEditStudio: React.FC<BossPhotoEditStudioProps> = ({
  onBackToCall,
  onSendToChat,
}) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>('royal_glow');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [anayaComment, setAnayaComment] = useState<string>(
    'प्रणाम मेरे बॉस! 👑 यहाँ अपनी कोई भी फोटो या सेल्फी भेजें—मैं अपने हाथों से उसे बेहद शानदार और रोबदार बना दूँगी!'
  );
  const [viewMode, setViewMode] = useState<'edited' | 'original' | 'split'>('edited');
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Adjustments
  const [brightness, setBrightness] = useState<number>(115);
  const [contrast, setContrast] = useState<number>(118);
  const [saturation, setSaturation] = useState<number>(125);
  const [warmth, setWarmth] = useState<number>(15);
  const [showSliders, setShowSliders] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Photo Upload
  const handlePhotoSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('कृपया केवल फोटो (Image) फ़ाइल चुनें!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setOriginalImage(dataUrl);
      setEditedImage(null);
      // Auto apply initial preset
      applyPresetFilters(PRESETS[0], dataUrl);
      showToast('फोटो लोड हो गई! अब अपनी पसंद का इफ़ेक्ट चुनें 👑');
    };
    reader.readAsDataURL(file);
  };

  // Apply visual preset via Canvas rendering
  const applyPresetFilters = (preset: PresetOption, sourceImageSrc?: string) => {
    const src = sourceImageSrc || originalImage;
    if (!src) return;

    setActivePreset(preset.id);
    setBrightness(Math.round(preset.filters.brightness * 100));
    setContrast(Math.round(preset.filters.contrast * 100));
    setSaturation(Math.round(preset.filters.saturate * 100));
    setWarmth(Math.round(preset.filters.sepia * 100));

    renderFilteredImage(
      src,
      preset.filters.brightness,
      preset.filters.contrast,
      preset.filters.saturate,
      preset.filters.sepia,
      preset.filters.goldGlow
    );
  };

  // Canvas-based real-time image filter rendering
  const renderFilteredImage = (
    src: string,
    b: number,
    c: number,
    s: number,
    sep: number,
    goldGlow: boolean = false
  ) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw base image with CSS filters on canvas
      ctx.filter = `brightness(${b}) contrast(${c}) saturate(${s}) sepia(${sep})`;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Add luxury subtle gold overlay gradient if enabled
      if (goldGlow) {
        ctx.filter = 'none';
        const grad = ctx.createRadialGradient(
          img.width / 2,
          img.height / 2,
          10,
          img.width / 2,
          img.height / 2,
          img.width * 0.7
        );
        grad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
        grad.addColorStop(1, 'rgba(124, 45, 18, 0.04)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, img.width, img.height);
        ctx.globalCompositeOperation = 'source-over';
      }

      const resultData = canvas.toDataURL('image/jpeg', 0.95);
      setEditedImage(resultData);
    };
    img.src = src;
  };

  // Re-render when manual sliders change
  const handleSliderChange = () => {
    if (!originalImage) return;
    renderFilteredImage(
      originalImage,
      brightness / 100,
      contrast / 100,
      saturation / 100,
      warmth / 100,
      warmth > 20
    );
  };

  // Call AI Backend for Gemini Smart Photo Edit
  const handleAiEditSubmit = async (instructionOverride?: string) => {
    const instruction = instructionOverride || customPrompt;
    if (!originalImage) {
      showToast('पहले एक फोटो अपलोड करें, मेरे बॉस!');
      return;
    }

    setIsProcessing(true);
    showToast('अनाया आपकी फोटो एडिट कर रही है... 💖');

    try {
      const res = await fetch('/api/edit-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: {
            base64: originalImage,
            mimeType: 'image/jpeg',
          },
          instruction: instruction || 'रॉयल बॉस लुक और शानदार ग्लो',
          preset: activePreset,
        }),
      });

      const data = await res.json();
      if (data.editedImage) {
        setEditedImage(data.editedImage);
      } else {
        // Apply matching preset or filter
        const preset = PRESETS.find((p) => p.id === activePreset) || PRESETS[0];
        applyPresetFilters(preset);
      }

      if (data.anayaComment) {
        setAnayaComment(data.anayaComment);
      }
      showToast('फोटो सफलतापूर्वक एडिट हो गई, मेरे बॉस! 👑');
    } catch (err: any) {
      console.warn('AI Edit notice:', err);
      // Fallback to client filter
      const preset = PRESETS.find((p) => p.id === activePreset) || PRESETS[0];
      applyPresetFilters(preset);
      setAnayaComment('मेरे बॉस! मैंने अपने हाथों से आपकी फोटो को गोल्डन और रोबदार लुक दे दिया है! 💖');
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice command input for photo editing
  const toggleVoiceInput = () => {
    if (isVoiceRecording) {
      speechRecognitionRef.current?.stop();
      setIsVoiceRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('आपके ब्राउज़र में वॉइस इनपुट सपोर्ट नहीं है');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsVoiceRecording(true);
      showToast('बोलिए मेरे बॉस! फोटो में क्या बदलाव करना है? 🎙️');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCustomPrompt(transcript);
      showToast(`हुक्म मिला: "${transcript}"`);
      handleAiEditSubmit(transcript);
    };

    recognition.onerror = () => {
      setIsVoiceRecording(false);
    };

    recognition.onend = () => {
      setIsVoiceRecording(false);
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
  };

  // Download high-resolution edited photo
  const handleDownload = () => {
    const target = editedImage || originalImage;
    if (!target) return;
    const a = document.createElement('a');
    a.href = target;
    a.download = `Anaya_Boss_Edited_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('एडिटेड फोटो डाउनलोड हो गई! 📥');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#180729] via-[#1a082e] to-[#0d0317] text-white relative overflow-hidden">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handlePhotoSelect(e.target.files[0]);
          }
        }}
      />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between p-3.5 bg-black/40 backdrop-blur-md border-b border-white/10 shrink-0 z-20">
        <div className="flex items-center space-x-2">
          <button
            id="photo-studio-back-btn"
            onClick={onBackToCall}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-pink-300"
            title="वापस कॉल पर जाएं"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                बॉस फोटो स्टूडियो
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </h2>
              <p className="text-[10px] text-pink-300 font-medium">अनाया स्पेशल AI एडिटिंग</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {editedImage && (
            <button
              id="download-edited-photo-btn"
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>डाउनलोड</span>
            </button>
          )}

          <button
            id="upload-new-photo-btn"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>फोटो चुनें</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col space-y-3 z-10 custom-scrollbar">
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-amber-500/90 text-black px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center justify-center mx-auto text-center"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo Stage / Preview */}
        <div className="w-full relative aspect-[4/5] sm:aspect-square bg-black/60 rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
          {originalImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={viewMode === 'original' ? originalImage : editedImage || originalImage}
                alt="Boss Photo Preview"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* View Mode Toggle Switch (Before vs After) */}
              {editedImage && (
                <div className="absolute top-3 left-3 flex items-center bg-black/70 backdrop-blur-md rounded-full p-0.5 border border-white/20 shadow-lg">
                  <button
                    onClick={() => setViewMode('original')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      viewMode === 'original'
                        ? 'bg-white/30 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    पहले (Original)
                  </button>
                  <button
                    onClick={() => setViewMode('edited')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      viewMode === 'edited'
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    बाद में (Edited) ✨
                  </button>
                </div>
              )}

              {/* Adjustments Slider Toggle Button */}
              <button
                id="toggle-sliders-btn"
                onClick={() => setShowSliders(!showSliders)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                  showSliders
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                }`}
                title="मैनुअल एडजेस्टमेंट्स"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Upload Placeholder */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-white/[0.02] transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-900/60 to-rose-900/60 border-2 border-dashed border-rose-400/40 flex items-center justify-center mb-4 shadow-xl">
                <Camera className="w-9 h-9 text-pink-300" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">फोटो यहाँ अपलोड करें मेरे बॉस! 👑</h3>
              <p className="text-xs text-zinc-400 max-w-[240px] leading-relaxed mb-4">
                गैलरी से कोई भी फोटो चुनें या कैमरा से सेल्फी लें—अनाया उसे 1 सेकंड में रोबदार बना देगी!
              </p>
              <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>फोटो सिलेक्ट करें</span>
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center z-30">
              <div className="w-14 h-14 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mb-3" />
              <p className="text-sm font-bold text-amber-300">अनाया फोटो एडिट कर रही है...</p>
              <p className="text-xs text-pink-200 mt-1 font-medium">बस कुछ ही सेकंड, मेरे प्यारे बॉस 💖</p>
            </div>
          )}
        </div>

        {/* Manual Sliders Drawer */}
        {showSliders && originalImage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-zinc-950/80 rounded-2xl border border-white/15 space-y-2.5 text-xs"
          >
            <div className="flex items-center justify-between text-zinc-300 font-bold mb-1">
              <span>मैनुअल नियंत्रण (Fine-Tuning)</span>
              <button
                onClick={() => {
                  setBrightness(100);
                  setContrast(100);
                  setSaturation(100);
                  setWarmth(0);
                  renderFilteredImage(originalImage, 1, 1, 1, 0, false);
                }}
                className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" /> रीसेट
              </button>
            </div>

            {/* Brightness */}
            <div className="flex items-center space-x-2">
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="w-16 text-[11px] text-zinc-400">चमक: {brightness}%</span>
              <input
                type="range"
                min="70"
                max="160"
                value={brightness}
                onChange={(e) => {
                  setBrightness(Number(e.target.value));
                  handleSliderChange();
                }}
                className="flex-1 accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="flex items-center space-x-2">
              <Contrast className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="w-16 text-[11px] text-zinc-400">कंट्रास्ट: {contrast}%</span>
              <input
                type="range"
                min="80"
                max="170"
                value={contrast}
                onChange={(e) => {
                  setContrast(Number(e.target.value));
                  handleSliderChange();
                }}
                className="flex-1 accent-rose-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="flex items-center space-x-2">
              <Palette className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="w-16 text-[11px] text-zinc-400">रंग: {saturation}%</span>
              <input
                type="range"
                min="0"
                max="180"
                value={saturation}
                onChange={(e) => {
                  setSaturation(Number(e.target.value));
                  handleSliderChange();
                }}
                className="flex-1 accent-teal-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Warmth / Gold */}
            <div className="flex items-center space-x-2">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="w-16 text-[11px] text-zinc-400">गोल्डन: {warmth}%</span>
              <input
                type="range"
                min="0"
                max="60"
                value={warmth}
                onChange={(e) => {
                  setWarmth(Number(e.target.value));
                  handleSliderChange();
                }}
                className="flex-1 accent-amber-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </motion.div>
        )}

        {/* Anaya's Boss Commentary Card */}
        <div className="w-full bg-gradient-to-r from-purple-950/70 via-rose-950/70 to-pink-950/70 rounded-2xl p-3 border border-pink-500/20 shadow-md flex items-start space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shrink-0 shadow-md">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-300">अनाया की टिप्पणी</h4>
              <span className="text-[10px] text-pink-300">पर्सनल सेक्रेटरी</span>
            </div>
            <p className="text-xs text-zinc-200 mt-1 leading-relaxed">{anayaComment}</p>
          </div>
        </div>

        {/* 1-Tap Presets Carousel */}
        <div>
          <h4 className="text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            1-क्लिक बॉस प्रिसेट्स (Presets)
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  id={`preset-btn-${preset.id}`}
                  onClick={() => applyPresetFilters(preset)}
                  className={`p-2 rounded-xl flex flex-col items-center text-center transition-all border ${
                    isActive
                      ? 'bg-gradient-to-b from-rose-600/40 to-amber-600/40 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'bg-zinc-900/60 border-white/10 hover:bg-zinc-800/80'
                  }`}
                >
                  <span className="text-lg mb-1">{preset.icon}</span>
                  <span className="text-[11px] font-bold text-white truncate w-full">{preset.name}</span>
                  <span className="text-[9px] text-zinc-400 truncate w-full mt-0.5">
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Edit Command / Voice Prompt Bar */}
        <div className="w-full bg-zinc-900/80 rounded-2xl p-2.5 border border-white/15 space-y-2">
          <label className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5" />
            बोलकर या लिखकर हुक्म दें (Custom AI Edit):
          </label>

          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="उदा. चेहरे पर चमक लाओ, बैकग्राउंड लग्ज़री करो..."
              className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAiEditSubmit();
              }}
            />

            {/* Mic Button for Voice Dictation */}
            <button
              id="photo-voice-mic-btn"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl transition-all shadow-md ${
                isVoiceRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-zinc-800 text-pink-300 hover:bg-zinc-700'
              }`}
              title="बोलकर हुक्म दें"
            >
              {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Apply Button */}
            <button
              id="apply-ai-edit-btn"
              onClick={() => handleAiEditSubmit()}
              disabled={isProcessing}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center space-x-1 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>लागू करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="w-full p-3 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between z-20 shrink-0">
        <button
          id="send-photo-to-chat-btn"
          onClick={() => {
            const finalImg = editedImage || originalImage;
            if (finalImg && onSendToChat) {
              onSendToChat(finalImg, anayaComment);
              showToast('फोटो अनाया के चैट में भेज दी गई! 💬');
            } else {
              showToast('पहले एक फोटो अपलोड करें');
            }
          }}
          disabled={!originalImage}
          className="flex-1 mr-2 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/70 border border-purple-400/30 text-xs font-bold text-purple-200 flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>अनाया चैट में भेजें</span>
        </button>

        <button
          id="footer-download-btn"
          onClick={handleDownload}
          disabled={!originalImage}
          className="flex-1 ml-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:opacity-90 text-xs font-bold text-white flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>गैलरी में सेव करें</span>
        </button>
      </div>
    </div>
  );
};
