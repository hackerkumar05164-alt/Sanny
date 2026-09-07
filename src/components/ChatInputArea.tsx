import React, { useRef, useState, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Image as ImageIcon,
  Sparkles,
  X,
  Coffee,
  BookOpen,
  Code2,
  Calendar,
} from 'lucide-react';

interface ChatInputAreaProps {
  onSendMessage: (
    text: string,
    attachments?: { type: 'image'; dataUrl: string; name?: string }[],
    category?: string
  ) => void;
  isLoading: boolean;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSendMessage,
  isLoading,
  isVoiceActive,
  onToggleVoice,
  selectedCategory,
  onSelectCategory,
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<{ type: 'image'; dataUrl: string; name?: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    { id: 'all', label: 'All-Rounder', icon: Sparkles, color: 'text-gray-300' },
    { id: 'java', label: '☕ Java Code', icon: Coffee, color: 'text-amber-400' },
    { id: 'notes', label: '🎨 Color Notes', icon: BookOpen, color: 'text-pink-400' },
    { id: 'image-enhance', label: '🖼️ Enhance Image', icon: ImageIcon, color: 'text-cyan-400' },
    { id: 'python', label: '🐍 Python', icon: Code2, color: 'text-emerald-400' },
    { id: 'routine', label: '📅 Study Plan', icon: Calendar, color: 'text-purple-400' },
  ];

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;

    onSendMessage(text.trim(), attachments.length > 0 ? attachments : undefined, selectedCategory);
    setText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAttachments((prev) => [
              ...prev,
              {
                type: 'image',
                dataUrl: event.target!.result as string,
                name: file.name,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full bg-[#212121]/95 backdrop-blur-md border-t border-[#2d2d2d] p-3 md:p-4">
      <div className="max-w-3xl mx-auto space-y-2.5">
        {/* Quick Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#333] hover:text-white border border-[#383838]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cat.color}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden border border-rose-500/40 bg-black/40 group w-20 h-20 shadow-md"
              >
                <img
                  src={att.dataUrl}
                  alt={att.name || 'Upload'}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeAttachment(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Input Box (ChatGPT Style) */}
        <div className="relative flex items-end gap-2 bg-[#2f2f2f] rounded-2xl border border-[#3f3f3f] focus-within:border-rose-500/60 focus-within:ring-1 focus-within:ring-rose-500/30 p-2 transition-all shadow-lg">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="इमेज अपलोड करें (Upload Image for Enhancement)"
            className="p-2 rounded-xl text-gray-400 hover:text-cyan-400 hover:bg-[#3d3d3d] transition-colors shrink-0 cursor-pointer"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedCategory === 'java'
                ? 'Java कोड का टॉपिक लिखें (e.g. Palindrome, Fibonacci, Matrix Multiplication)...'
                : selectedCategory === 'notes'
                ? 'किस चैप्टर के रंगीन नोट्स चाहिए? (Physics, Chem, Bio, Maths)...'
                : selectedCategory === 'image-enhance'
                ? 'इमेज अपलोड करें या प्रॉम्प्ट की मांग करें...'
                : 'अनाया से बात करें या लिखें (Study, Coding, Notes, Image Prompt)...'
            }
            rows={1}
            className="flex-1 bg-transparent text-gray-100 text-sm placeholder-gray-400 focus:outline-hidden resize-none py-2 px-1 max-h-44 leading-relaxed custom-scrollbar"
          />

          {/* Voice Mode Button */}
          <button
            onClick={onToggleVoice}
            title={isVoiceActive ? 'Voice Mode Active' : 'Start Live Voice'}
            className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              isVoiceActive
                ? 'bg-rose-500 text-white animate-pulse shadow-md'
                : 'text-gray-400 hover:text-rose-400 hover:bg-[#3d3d3d]'
            }`}
          >
            {isVoiceActive ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={(!text.trim() && attachments.length === 0) || isLoading}
            className={`p-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              text.trim() || attachments.length > 0
                ? 'bg-white text-black hover:bg-gray-200 shadow-md'
                : 'bg-[#3d3d3d] text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Footer info tip */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 px-2">
          <span>अनाया हर सवाल का जवाब लिखकर (Text) और सुंदर Markdown में देती है।</span>
          <span className="hidden sm:inline font-mono">~ Sanny</span>
        </div>
      </div>
    </div>
  );
};
