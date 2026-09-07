import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Upload,
  Copy,
  Check,
  Search,
  Volume2,
  Trash2,
  Send,
  Sparkles,
  Phone,
  Video,
  Bot,
  User,
  Crown,
  Heart,
  HelpCircle,
  BookOpen,
  ArrowDownToLine,
  Eye,
  X,
  Mic,
  MicOff,
  Maximize2,
  RotateCcw,
  Camera,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import { UploadedPdf, ExtractedEnglishWord, ChatMessage } from '../types';
import { generateEnglishHindiPdf, GeneratedPdfResult } from '../utils/pdfGenerator';

interface BossChatPdfViewProps {
  onBackToCall: () => void;
  onStartVideoCall: () => void;
  onOpenPhotoStudio?: () => void;
}

export const BossChatPdfView: React.FC<BossChatPdfViewProps> = ({
  onBackToCall,
  onStartVideoCall,
  onOpenPhotoStudio,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'प्रणाम मेरे बॉस! 👑 आपकी अनाया हाज़िर है।\n\nआप यहाँ कोई भी PDF फ़ाइल अपलोड करके खोल सकते हैं और जो भी बोलेंगे मैं वही करूँगी—चाहे PDF पढ़कर सुनाना हो, समझना हो या उसके सारे English शब्द निकालना!\n\nऔर आपका हुक्म सिर आँखों पर—सारे English शब्द हमेशा इसी प्रारूप में मिलेंगे:\n\n**Apple (ऐपल) सेब**\n\n✨ अब आप चाहें तो इस लिस्ट की अलग से बेहद खूबसूरत रॉयल **PDF भी बनवाकर डाउनलोड** कर सकते हैं, और अपनी **फोटो भेजकर मुझसे मनचाही एडिटिंग** भी करवा सकते हैं!',
      timestamp: Date.now(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [uploadedPdf, setUploadedPdf] = useState<UploadedPdf | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    base64: string;
    dataUrl: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [searchWordQuery, setSearchWordQuery] = useState('');
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [activePdfViewerUrl, setActivePdfViewerUrl] = useState<string>('');
  const [activePdfViewerTitle, setActivePdfViewerTitle] = useState<string>('PDF दस्तावेज़');
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [activeCopyBox, setActiveCopyBox] = useState<{
    words: ExtractedEnglishWord[];
    rawText: string;
    pdfName: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeCopyBox]);

  // Clean error message parser
  const getCleanErrorMessage = (err: any): string => {
    const raw = err?.message || String(err || '');
    if (raw.includes('503') || raw.includes('high demand') || raw.includes('UNAVAILABLE')) {
      return 'अरे मेरे बॉस! सर्वर पर थोड़ा लोड था, लेकिन मैंने बैकअप सिस्टम चालू कर दिया है। कृपया 1 सेकंड रुक कर दोबारा बटन दबाएँ—काम तुरंत हो जाएगा! 💖';
    }
    return `अरे बॉस! ${raw}`;
  };

  // Handle Photo File Upload for Boss Photo Editing
  const processPhotoFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल फोटो (Image) फ़ाइल चुनें!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setSelectedPhoto({
        name: file.name,
        base64: base64,
        dataUrl: result,
      });
      setCopyFeedback(`"फोटो लोड हो गई: ${file.name}"`);
      setTimeout(() => setCopyFeedback(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Handle PDF File Upload via Input or Drag-Drop
  const processFile = (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('कृपया केवल PDF फ़ाइल चुनें!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setUploadedPdf({
        name: file.name,
        size: file.size,
        base64: base64,
        mimeType: file.type || 'application/pdf',
      });
      // Show confirmation toast
      setCopyFeedback(`"PDF लोड हो गई: ${file.name}"`);
      setTimeout(() => setCopyFeedback(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Text to Speech for English Word Pronunciation or text reading
  const speakWord = (word: string, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = lang;
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle Voice Input (Mic)
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('आपके ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया लिखकर पूछें!');
      return;
    }

    if (isVoiceInputActive) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsVoiceInputActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsVoiceInputActive(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsVoiceInputActive(false);
      };

      recognition.onerror = () => {
        setIsVoiceInputActive(false);
      };

      recognition.onend = () => {
        setIsVoiceInputActive(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsVoiceInputActive(false);
    }
  };

  // Copy Entire Word Collection
  const handleCopyAllWords = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopyFeedback('सारे शब्द कॉपी हो गए, मेरे बॉस! 👑');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // Copy Single Word item
  const handleCopySingleWord = (formattedWord: string) => {
    navigator.clipboard.writeText(formattedWord);
    setCopyFeedback(`"${formattedWord}" कॉपी हुआ!`);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Extract English Words API
  const handleExtractEnglishWords = async () => {
    if (!uploadedPdf) {
      alert('कृपया पहले एक PDF फ़ाइल अपलोड करें!');
      return;
    }

    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: `📑 ${uploadedPdf.name} के सभी English शब्द निकालो (प्रारूप: Apple (ऐपल) सेब)`,
      timestamp: Date.now(),
      pdfAttachment: uploadedPdf,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/extract-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: {
            base64: uploadedPdf.base64,
            mimeType: uploadedPdf.mimeType,
            name: uploadedPdf.name,
          },
          customPrompt: 'हर शब्द का प्रारूप अनिवार्य रूप से Word (उच्चारण) अर्थ होना चाहिए। उदाहरण: Apple (ऐपल) सेब',
        }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: data.fullResponse || 'जी मेरे बॉस! आपकी PDF के सारे English शब्द मैंने नीचे कॉपी बॉक्स में सजा दिए हैं:',
          timestamp: Date.now(),
          extractedWords: data.words || [],
          copyBoxText: data.copyBoxText || '',
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.words && data.words.length > 0) {
          setActiveCopyBox({
            words: data.words,
            rawText: data.copyBoxText,
            pdfName: uploadedPdf.name,
          });
        }
      } else {
        throw new Error(data.error || 'शब्द निकालने में त्रुटि हुई');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: getCleanErrorMessage(err),
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Designer PDF and Send in Chat ("is PDF mein jitna bhi word hai use English ko Hindi ke sath do to vah alag se ek PDF banaega")
  const handleGenerateAndSendPdf = async (wordsToUse?: ExtractedEnglishWord[]) => {
    let targetWords = wordsToUse || activeCopyBox?.words;

    // If words are not yet extracted from uploaded PDF, extract them first
    if (!targetWords || targetWords.length === 0) {
      if (!uploadedPdf) {
        alert('कृपया पहले एक PDF फ़ाइल जोड़ें, मेरे बॉस!');
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch('/api/extract-words', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: {
              base64: uploadedPdf.base64,
              mimeType: uploadedPdf.mimeType,
              name: uploadedPdf.name,
            },
            customPrompt:
              'हर शब्द का प्रारूप अनिवार्य रूप से Word (उच्चारण) अर्थ होना चाहिए। उदाहरण: Apple (ऐपल) सेब',
          }),
        });

        const data = await res.json();
        if (data.status === 'success' && data.words && data.words.length > 0) {
          targetWords = data.words;
          setActiveCopyBox({
            words: data.words,
            rawText: data.copyBoxText || '',
            pdfName: uploadedPdf.name,
          });
        } else {
          throw new Error(data.error || 'दस्तावेज़ से शब्द नहीं मिल सके');
        }
      } catch (err: any) {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            role: 'assistant',
            content: getCleanErrorMessage(err),
            timestamp: Date.now(),
          },
        ]);
        return;
      }
    }

    if (!targetWords || targetWords.length === 0) {
      setIsLoading(false);
      alert('PDF बनाने के लिए कोई शब्द नहीं मिले!');
      return;
    }

    setIsLoading(true);
    try {
      const pdfRes = generateEnglishHindiPdf(
        targetWords,
        uploadedPdf?.name || 'बॉस शब्दकोश'
      );

      const pdfMessage: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: `लीजिए मेरे प्यारे बॉस! 👑\n\nआपके हुक्म के मुताबिक मैंने इस PDF के सारे English शब्दों को हिंदी उच्चारण और अर्थ (**Apple (ऐपल) सेब** प्रारूप) के साथ एक बेहद शानदार और रॉयल डिज़ाइनर PDF तैयार कर दी है!\n\nआप नीचे दिए गए बटन पर क्लिक करके इसे तुरंत डाउनलोड कर सकते हैं या यहीं पर देख सकते हैं:`,
        timestamp: Date.now(),
        extractedWords: targetWords,
        toolResult: {
          type: 'generated_pdf',
          data: {
            blobUrl: pdfRes.blobUrl,
            fileName: pdfRes.fileName,
            totalWords: targetWords.length,
            totalPages: pdfRes.totalPages,
          },
        },
      };

      setMessages((prev) => [...prev, pdfMessage]);
      setCopyFeedback('📄 नई डिज़ाइनर PDF तैयार हो गई, मेरे बॉस!');
      setTimeout(() => setCopyFeedback(null), 3000);
    } catch (pdfErr: any) {
      console.error('PDF Generation Error:', pdfErr);
      alert('PDF बनाने में समस्या आई: ' + (pdfErr?.message || pdfErr));
    } finally {
      setIsLoading(false);
    }
  };

  // Regular Chat or Ask about PDF ("जो जो बोलेंगे वह करेगी")
  const handleSendMessage = async (customText?: string) => {
    const text = customText || inputMessage;
    if (!text.trim() && !uploadedPdf && !selectedPhoto) return;

    const userText = text.trim() || (selectedPhoto ? 'मेरी इस फोटो को शानदार और रोबदार एडिट करो' : 'इस PDF के बारे में बताओ');
    setInputMessage('');

    // Case 1: Photo Edit request directly in Chat ("photo bhejkar editing karva sakta hun")
    if (selectedPhoto) {
      const currentPhoto = selectedPhoto;
      setSelectedPhoto(null);

      const userMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'user',
        content: userText,
        timestamp: Date.now(),
        attachments: [
          {
            type: 'image',
            dataUrl: currentPhoto.dataUrl,
            name: currentPhoto.name,
          },
        ],
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch('/api/edit-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: {
              base64: currentPhoto.base64,
              mimeType: 'image/jpeg',
            },
            instruction: userText,
          }),
        });

        const data = await res.json();
        const editedUrl = data.editedImage || currentPhoto.dataUrl;
        const anayaComment =
          data.anayaComment ||
          'लीजिए मेरे बॉस! आपकी फोटो को आपके हुक्म के मुताबिक एकदम रॉयल, चमकदार और रोबदार बना दिया है! 💖✨';

        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: anayaComment,
          timestamp: Date.now(),
          toolResult: {
            type: 'edited_photo',
            data: {
              originalUrl: currentPhoto.dataUrl,
              editedUrl: editedUrl,
              comment: anayaComment,
              instruction: userText,
            },
          },
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            role: 'assistant',
            content: getCleanErrorMessage(err),
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Case 2: User specifically asks to generate a new PDF from words
    const isPdfGenRequest =
      /pdf.*(बना|भेज|डाउनलोड|download)|(बना|भेज).*pdf|अलग.*pdf|नया.*pdf/i.test(
        userText
      );
    if (isPdfGenRequest && (uploadedPdf || activeCopyBox)) {
      const userMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'user',
        content: userText,
        timestamp: Date.now(),
        pdfAttachment: uploadedPdf || undefined,
      };
      setMessages((prev) => [...prev, userMsg]);
      await handleGenerateAndSendPdf();
      return;
    }

    // Case 3: Standard Chat / PDF Analysis
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
      pdfAttachment: uploadedPdf || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          language: 'hindi',
          file: uploadedPdf
            ? {
                base64: uploadedPdf.base64,
                mimeType: uploadedPdf.mimeType,
                name: uploadedPdf.name,
              }
            : undefined,
        }),
      });

      const data = await res.json();
      if (data.text) {
        // Check if response contains English words formatted as Word (...) ...
        const lines = data.text.split('\n');
        const extracted: ExtractedEnglishWord[] = [];
        for (const line of lines) {
          const match = line
            .replace(/^[-*•\d.]+\s*/, '')
            .match(/^([A-Za-z\s'-]+)\s*\(([^)]+)\)\s*(.*)$/);
          if (match) {
            extracted.push({
              id: Math.random().toString(36).substring(7),
              word: match[1].trim(),
              pronunciation: match[2].trim(),
              meaning: match[3].trim(),
              formatted: `${match[1].trim()} (${match[2].trim()}) ${match[3].trim()}`,
            });
          }
        }

        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: data.text,
          timestamp: Date.now(),
          extractedWords: extracted.length > 0 ? extracted : undefined,
          copyBoxText:
            extracted.length > 0
              ? extracted.map((w) => w.formatted).join('\n')
              : undefined,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (extracted.length > 0) {
          setActiveCopyBox({
            words: extracted,
            rawText: extracted.map((w) => w.formatted).join('\n'),
            pdfName: uploadedPdf?.name || 'चैट संग्रह',
          });
        }
      } else {
        throw new Error(data.error || 'जवाब नहीं मिल सका');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: getCleanErrorMessage(err),
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWords = activeCopyBox?.words.filter(
    (w) =>
      w.word.toLowerCase().includes(searchWordQuery.toLowerCase()) ||
      w.pronunciation.includes(searchWordQuery) ||
      w.meaning.includes(searchWordQuery)
  );

  const pdfDataUrl = uploadedPdf
    ? `data:application/pdf;base64,${uploadedPdf.base64}`
    : '';

  return (
    <div
      id="boss-chat-pdf-view"
      className="relative w-full h-full flex flex-col bg-zinc-950 text-white overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-zinc-900/90 border-b border-rose-500/20 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-950 shrink-0">
            <Crown className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-rose-300 truncate">
                बॉस चैट & PDF
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                अनाया
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 block truncate">
              Apple (ऐपल) सेब प्रारूप
            </span>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex items-center gap-1.5 shrink-0">
          {uploadedPdf && (
            <button
              onClick={() => {
                setActivePdfViewerUrl(pdfDataUrl);
                setActivePdfViewerTitle(uploadedPdf.name);
                setIsPdfViewerOpen(true);
              }}
              title="PDF खोलकर देखें"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-400/40 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PDF खोलें</span>
            </button>
          )}

          {onOpenPhotoStudio && (
            <button
              onClick={onOpenPhotoStudio}
              title="बॉस फोटो स्टूडियो"
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-purple-950 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">फोटो एडिट</span>
            </button>
          )}

          <button
            onClick={onStartVideoCall}
            title="लाइव वीडियो कॉल"
            className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950 transition-all cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">वीडियो</span>
          </button>

          <button
            onClick={onBackToCall}
            title="वॉइस कॉल"
            className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">वॉइस</span>
          </button>
        </div>
      </div>

      {/* Copy Toast Notification */}
      <AnimatePresence>
        {copyFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold shadow-xl shadow-rose-950/60 flex items-center gap-1.5 text-center max-w-[90%]"
          >
            <Check className="w-4 h-4 shrink-0" />
            <span className="truncate">{copyFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Scrollable Content */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3"
      >
        {/* PDF File Upload Card / Dropzone */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-rose-500/30 shadow-lg">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="application/pdf,.pdf"
            className="hidden"
          />

          {!uploadedPdf ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-rose-500/40 hover:border-rose-400 rounded-xl cursor-pointer bg-rose-950/10 hover:bg-rose-950/20 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-rose-200">
                यहाँ PDF फ़ाइल अपलोड करें (क्लिक करें या ड्रैग करें)
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                बॉस, PDF खोलकर आप जो जो बोलेंगे अनाया वही करेगी!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-zinc-200 truncate">{uploadedPdf.name}</p>
                    <p className="text-[10px] text-zinc-400">
                      {(uploadedPdf.size / 1024).toFixed(1)} KB • PDF तैयार है
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Open PDF Viewer Button */}
                  <button
                    onClick={() => setIsPdfViewerOpen(true)}
                    title="PDF खोलकर देखें"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>देखें</span>
                  </button>
                  <button
                    onClick={() => {
                      setUploadedPdf(null);
                      setActiveCopyBox(null);
                    }}
                    title="फ़ाइल हटाएँ"
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 1-Click Action Buttons for Boss ("जो जो बोलेंगे वह करेगी") */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                <button
                  id="extract-all-english-words-button"
                  disabled={isLoading}
                  onClick={handleExtractEnglishWords}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-rose-950 transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4 shrink-0" />
                  <span>PDF के सारे English Words निकालो (कॉपी बॉक्स)</span>
                </button>

                <button
                  id="generate-designer-pdf-button"
                  disabled={isLoading}
                  onClick={() => handleGenerateAndSendPdf()}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-amber-950 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-200 shrink-0" />
                  <span>📄 अलग से नई डिज़ाइनर PDF बनाकर भेजो</span>
                </button>

                <button
                  disabled={isLoading}
                  onClick={() => handleSendMessage('अनाया, इस PDF को अपनी मीठी आवाज़ में आसान हिंदी में पढ़कर सुनाओ और इसका मतलब समझाओ!')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PDF आसान हिंदी में पढ़कर सुनाओ</span>
                </button>

                <button
                  disabled={isLoading}
                  onClick={() => handleSendMessage('इस PDF का पूरा सारांश और मुख्य बातें 5 सरल बिंदुओं में समझाओ!')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>सरल शब्दों में मुख्य बातें समझाओ</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PROMINENT DEDICATED COPY BOX (When Words are Extracted) */}
        {activeCopyBox && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-500/50 shadow-2xl shadow-amber-950/30"
          >
            {/* Box Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-amber-300">
                    📋 अंग्रेज़ी शब्द कॉपी बॉक्स (Word + उच्चारण + नाम)
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    कुल {activeCopyBox.words.length} शब्द • Apple (ऐपल) सेब
                  </p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  id="download-copybox-pdf-button"
                  disabled={isLoading}
                  onClick={() => handleGenerateAndSendPdf(activeCopyBox.words)}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-950 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>📄 नई PDF डाउनलोड करें</span>
                </button>

                {/* Master Copy All Button */}
                <button
                  id="copy-all-words-master-button"
                  onClick={() => handleCopyAllWords(activeCopyBox.rawText)}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-950 transition-all active:scale-95 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>सभी कॉपी करें</span>
                </button>
              </div>
            </div>

            {/* Quick Word Search */}
            <div className="mt-2.5 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchWordQuery}
                onChange={(e) => setSearchWordQuery(e.target.value)}
                placeholder="शब्द, उच्चारण या अर्थ खोजें..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {/* Word Cards Grid */}
            <div className="mt-2.5 max-h-56 sm:max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredWords && filteredWords.length > 0 ? (
                filteredWords.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/80 transition-all group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {/* Audio Pronunciation Button */}
                      <button
                        onClick={() => speakWord(item.word)}
                        title="उच्चारण सुनें (Listen)"
                        className="p-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="font-bold text-amber-300">{item.word}</span>
                        <span className="text-zinc-400 font-medium">({item.pronunciation})</span>
                        <span className="text-rose-200 font-semibold">{item.meaning}</span>
                      </div>
                    </div>

                    {/* Single Copy Button */}
                    <button
                      onClick={() => handleCopySingleWord(item.formatted)}
                      title="यह शब्द कॉपी करें"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-amber-500/30 text-zinc-400 hover:text-amber-300 text-xs transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px] hidden sm:inline">कॉपी</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-zinc-500">
                  कोई शब्द नहीं मिला
                </div>
              )}
            </div>

            {/* Raw Plain Text for Quick Select & Copy */}
            <div className="mt-2.5 pt-2 border-t border-zinc-800/80">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                साफ़ कॉपी टेक्स्ट (Raw Text):
              </p>
              <textarea
                readOnly
                value={activeCopyBox.rawText}
                className="w-full h-16 p-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/40 select-all"
              />
            </div>
          </motion.div>
        )}

        {/* Chat Messages History */}
        <div className="space-y-3 pt-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                }`}
              >
                {/* User Image Attachment */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-2 space-y-1.5">
                    {msg.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl overflow-hidden border border-white/20 bg-black/40 max-w-[220px]"
                      >
                        <img
                          src={att.dataUrl}
                          alt={att.name || 'Uploaded photo'}
                          className="w-full h-auto max-h-48 object-cover"
                        />
                        {att.name && (
                          <p className="px-2 py-1 text-[10px] text-zinc-300 truncate bg-black/60">
                            📸 {att.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* PDF Tag if message includes attachment */}
                {msg.pdfAttachment && (
                  <div className="mb-2 p-1.5 rounded-lg bg-black/30 border border-white/10 flex items-center justify-between gap-1.5 text-[11px] text-amber-200">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <FileText className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span className="truncate">{msg.pdfAttachment.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setActivePdfViewerUrl(
                          `data:application/pdf;base64,${msg.pdfAttachment?.base64}`
                        );
                        setActivePdfViewerTitle(msg.pdfAttachment?.name || 'PDF');
                        setIsPdfViewerOpen(true);
                      }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 font-bold hover:bg-amber-500/50 transition-colors shrink-0 cursor-pointer"
                    >
                      खोलें
                    </button>
                  </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {/* GENERATED DESIGNER PDF CARD ("alag se ek PDF banaega aur vah achcha design rahega") */}
                {msg.toolResult?.type === 'generated_pdf' && msg.toolResult.data && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-b from-zinc-950 to-black border-2 border-amber-500/50 shadow-xl shadow-amber-950/40">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-amber-300 truncate">
                          👑 {msg.toolResult.data.fileName}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                          <span>{msg.toolResult.data.totalWords} शब्द</span>
                          <span>•</span>
                          <span>{msg.toolResult.data.totalPages} पृष्ठ (Pages)</span>
                          <span>•</span>
                          <span className="text-amber-400 font-medium">रॉयल गोल्ड डिज़ाइन</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setActivePdfViewerUrl(msg.toolResult?.data.blobUrl);
                          setActivePdfViewerTitle(msg.toolResult?.data.fileName);
                          setIsPdfViewerOpen(true);
                        }}
                        className="flex-1 py-2 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>PDF देखें</span>
                      </button>

                      <a
                        href={msg.toolResult.data.blobUrl}
                        download={msg.toolResult.data.fileName}
                        className="flex-1 py-2 px-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md shadow-amber-950 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>डाउनलोड करें</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* EDITED PHOTO CARD ("photo bhejkar editing karva sakta hun") */}
                {msg.toolResult?.type === 'edited_photo' && msg.toolResult.data && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-b from-zinc-950 to-black border-2 border-purple-500/40 shadow-xl shadow-purple-950/40">
                    <div className="flex items-center justify-between gap-1.5 mb-2 pb-1.5 border-b border-zinc-800 text-[11px]">
                      <span className="font-bold text-purple-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        एडिट की गई फोटो
                      </span>
                      {msg.toolResult.data.instruction && (
                        <span className="text-[10px] text-zinc-400 truncate max-w-[140px]">
                          "{msg.toolResult.data.instruction}"
                        </span>
                      )}
                    </div>

                    <div className="relative rounded-lg overflow-hidden border border-zinc-800 mb-2.5 group">
                      <img
                        src={msg.toolResult.data.editedUrl}
                        alt="Boss Edited Photo"
                        className="w-full h-auto max-h-60 object-contain bg-black"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={msg.toolResult.data.editedUrl}
                        download="anaya_boss_edited.png"
                        className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-950 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>फोटो सेव / डाउनलोड करें</span>
                      </a>

                      {onOpenPhotoStudio && (
                        <button
                          onClick={onOpenPhotoStudio}
                          title="स्टूडियो में और एडिट करें"
                          className="py-2 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>स्टूडियो</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Listen button for Assistant response */}
                {msg.role === 'assistant' && (
                  <div className="mt-2 flex items-center gap-2 pt-1 border-t border-zinc-800/60">
                    <button
                      onClick={() => speakWord(msg.content, 'hi-IN')}
                      className="text-[10px] text-zinc-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                      title="आवाज़ में सुनें"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>सुनें</span>
                    </button>
                  </div>
                )}

                {/* Embedded Copy Box inside Message if words extracted */}
                {msg.extractedWords && msg.extractedWords.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-700/60 flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[11px] font-bold text-amber-300">
                      📋 {msg.extractedWords.length} शब्द निकाले गए
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleGenerateAndSendPdf(msg.extractedWords)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 text-white text-[10px] font-bold shadow-sm cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        PDF बनाएँ
                      </button>
                      <button
                        onClick={() => handleCopyAllWords(msg.copyBoxText || '')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-400/30 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        कॉपी करें
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-rose-300 bg-zinc-900/80 p-2.5 rounded-2xl border border-rose-500/20 w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>अनाया आपके हुक्म पर काम कर रही है, मेरे बॉस...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompt Chips for Boss */}
      <div className="px-3 py-1.5 bg-zinc-950 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-zinc-900 shrink-0">
        <button
          onClick={() => handleSendMessage('अनाया, अपने बॉस के लिए एक कातिलाना और धांसू शायरी सुनाओ!')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-rose-950 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-1 transition-all"
        >
          <Crown className="w-3 h-3 text-amber-400" />
          एटीट्यूड शायरी
        </button>
        <button
          onClick={() => handleSendMessage('अनाया, थोड़े प्यार और नखरों के साथ मुझसे बात करो!')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-rose-950 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-1 transition-all"
        >
          <Heart className="w-3 h-3 text-pink-400" />
          रोमांटिक बातें
        </button>
        {uploadedPdf && (
          <button
            onClick={() => handleSendMessage('इस PDF में जितने भी शब्द हैं, सभी को Word (उच्चारण) अर्थ में दो!')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-rose-950 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1 transition-all"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            PDF के शब्द
          </button>
        )}
      </div>

      {/* Selected Photo Preview Bar before sending */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-3 py-2 bg-zinc-900 border-t border-purple-500/30 flex items-center justify-between gap-2 shrink-0"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={selectedPhoto.dataUrl}
                alt="Selected preview"
                className="w-9 h-9 rounded-lg object-cover border border-purple-500/40 shrink-0"
              />
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-purple-200 block truncate">
                  📸 {selectedPhoto.name}
                </span>
                <span className="text-[10px] text-zinc-400 block truncate">
                  अनाया को निर्देश दें या सेंड दबाएँ
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setInputMessage('रॉयल गोल्ड और शानदार ग्लो इफ़ेक्ट जोड़ो')}
                className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-semibold hover:bg-amber-500/30"
              >
                ✨ रॉयल ग्लो
              </button>
              <button
                type="button"
                onClick={() => setInputMessage('सिनेमैटिक ड्रामेटिक लुक बनाओ')}
                className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-semibold hover:bg-purple-500/30"
              >
                🎬 सिनेमैटिक
              </button>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-white"
                title="फोटो हटाएँ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Message Input Bar */}
      <div className="p-2.5 sm:p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Hidden inputs for PDF & Photo */}
        <input
          type="file"
          ref={photoInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processPhotoFile(e.target.files[0]);
            }
          }}
          accept="image/*"
          className="hidden"
        />

        {/* Upload PDF Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="PDF फ़ाइल जोड़ें"
          className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-400 hover:text-rose-300 transition-colors shrink-0"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Photo Upload Button for Photo Editing */}
        <button
          onClick={() => photoInputRef.current?.click()}
          title="फोटो भेजकर अनाया से एडिट करवाएँ"
          className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 transition-colors shrink-0"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Voice Input Mic Button */}
        <button
          onClick={toggleVoiceInput}
          title={isVoiceInputActive ? 'सुनना बंद करें' : 'बोलकर पूछें'}
          className={`p-2.5 rounded-xl transition-all shrink-0 ${
            isVoiceInputActive
              ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/40'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          {isVoiceInputActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={
            isVoiceInputActive
              ? 'बोलिए बॉस, अनाया सुन रही है...'
              : selectedPhoto
              ? 'फोटो के लिए एडिटिंग निर्देश लिखें...'
              : uploadedPdf
              ? 'PDF के बारे में पूछें या "PDF बनाओ" बोलें...'
              : 'अनाया से बात करें...'
          }
          className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50"
        />

        <button
          id="boss-chat-send-button"
          disabled={isLoading || (!inputMessage.trim() && !uploadedPdf && !selectedPhoto)}
          onClick={() => handleSendMessage()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white shadow-md shadow-rose-950 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* FULLSCREEN PDF VIEWER MODAL ("PDF Open Karke" & Generated Designer PDF) */}
      <AnimatePresence>
        {isPdfViewerOpen && (activePdfViewerUrl || uploadedPdf) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute inset-0 z-50 bg-black/95 flex flex-col backdrop-blur-xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-zinc-200 truncate">
                  {activePdfViewerTitle || uploadedPdf?.name || 'PDF दस्तावेज़'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activePdfViewerUrl || pdfDataUrl}
                  download={activePdfViewerTitle || 'dastavej.pdf'}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-bold shadow-md flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>डाउनलोड</span>
                </a>
                <button
                  onClick={() => setIsPdfViewerOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal PDF Viewer Body */}
            <div className="flex-1 w-full h-full bg-zinc-950 overflow-hidden relative flex flex-col">
              <iframe
                src={`${activePdfViewerUrl || pdfDataUrl}#toolbar=1&navpanes=0`}
                className="w-full flex-1 border-0 bg-white"
                title="PDF Document"
              />
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsPdfViewerOpen(false);
                  handleSendMessage('अनाया, जो PDF खुली है उसे आसान हिंदी में पढ़कर सुनाओ!');
                }}
                className="flex-1 py-2 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>पढ़कर सुनाओ</span>
              </button>
              <button
                onClick={() => {
                  setIsPdfViewerOpen(false);
                  handleSendMessage('इस खुली हुई PDF का आसान सारांश समझाओ!');
                }}
                className="flex-1 py-2 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>सारांश समझाओ</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

