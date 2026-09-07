import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Coffee,
  Code2,
  Image as ImageIcon,
  Layers,
  Calendar,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onOpenTool?: (type: string, data?: any) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onOpenTool }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content.replace(/[#*`_~]/g, ''));
    utterance.lang = 'hi-IN';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`py-4 px-4 md:px-6 w-full flex justify-center transition-colors ${
        isUser ? 'bg-transparent' : 'bg-[#1e1e1e]/60 border-y border-[#282828]'
      }`}
    >
      <div className="w-full max-w-3xl flex gap-3.5 md:gap-4 items-start">
        {/* Avatar */}
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm mt-0.5">
            स
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md ring-2 ring-rose-500/30 mt-0.5">
            अ
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Role */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-semibold text-gray-200">
              {isUser ? 'सन्नी (Sanni)' : 'अनाया (Anaya)'}
            </span>
            <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
              {!isUser && (
                <button
                  onClick={handleSpeak}
                  title="बोलकर सुनाओ (Read aloud)"
                  className="p-1 rounded hover:bg-[#2c2c2c] text-gray-400 hover:text-white transition-colors"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
              <button
                onClick={handleCopy}
                title="कॉपी करें (Copy text)"
                className="p-1 rounded hover:bg-[#2c2c2c] text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 my-2">
              {message.attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border border-gray-700 max-w-xs shadow-md group"
                >
                  <img
                    src={att.dataUrl}
                    alt={att.name || 'Attachment'}
                    className="max-h-48 w-auto object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs p-1 text-[10px] text-gray-200 truncate">
                    {att.name || 'Uploaded Image'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message Markdown */}
          <div className="text-[14.5px] leading-relaxed text-gray-200 markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold text-rose-300 mt-4 mb-2 flex items-center gap-1.5">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold text-pink-300 mt-3 mb-1.5 flex items-center gap-1.5">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold text-indigo-300 mt-2.5 mb-1">{children}</h3>
                ),
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-300">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-rose-500/60 pl-3 py-1 my-2 bg-rose-500/10 rounded-r-lg text-rose-200 italic">
                    {children}
                  </blockquote>
                ),
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeText = String(children).replace(/\n$/, '');

                  if (inline) {
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded bg-[#2b2b2b] text-pink-300 text-xs font-mono border border-[#3b3b3b]"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="my-3 rounded-xl overflow-hidden border border-[#333333] bg-[#141414] shadow-sm">
                      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#202020] text-xs text-gray-400 font-mono border-b border-[#2d2d2d]">
                        <span>{match ? match[1] : 'code'}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(codeText);
                          }}
                          className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre className="p-3.5 text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed">
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Interactive Tool Actions */}
          {message.toolResult && (
            <div className="mt-3 pt-2 border-t border-[#2e2e2e] flex flex-wrap gap-2">
              {message.toolResult.type === 'notes' && (
                <button
                  onClick={() => onOpenTool?.('notes', message.toolResult?.data)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-medium hover:bg-pink-500/30 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>रंगीन नोट्स देखें (~ Sanny)</span>
                </button>
              )}

              {message.toolResult.type === 'java' && (
                <button
                  onClick={() => onOpenTool?.('java', message.toolResult?.data)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium hover:bg-amber-500/30 transition-colors"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Java Mobile Studio खोलें (~ Sanny)</span>
                </button>
              )}

              {message.toolResult.type === 'imagePrompt' && (
                <button
                  onClick={() => onOpenTool?.('imagePrompt', message.toolResult?.data)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>4K AI Image Prompt बॉक्स</span>
                </button>
              )}

              {message.toolResult.type === 'python' && (
                <button
                  onClick={() => onOpenTool?.('python', message.toolResult?.data)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Python Mobile Guide</span>
                </button>
              )}

              {message.toolResult.type === 'routine' && (
                <button
                  onClick={() => onOpenTool?.('routine', message.toolResult?.data)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium hover:bg-purple-500/30 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>स्टडी रूटीन टाइमटेबल</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
