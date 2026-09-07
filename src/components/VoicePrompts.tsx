import React from 'react';
import { Sparkles, MessageCircleHeart, Heart, Smile, Users } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface VoicePromptsProps {
  status: string;
  language?: SupportedLanguage;
  onSelectPrompt?: (text: string) => void;
}

export const VoicePrompts: React.FC<VoicePromptsProps> = ({ status, language = 'hindi' }) => {
  const promptsByLang: Record<SupportedLanguage, { text: string; icon: string; tag: string }[]> = {
    hindi: [
      { text: 'सन्नी: आज तुम बहुत सीरियस क्यों हो?', icon: '💖', tag: 'Sanni' },
      { text: 'Manish से बात करो ना अनाया!', icon: '😂', tag: 'Manish' },
      { text: 'Ankit भाई से नमस्ते और मज़ाक करो', icon: '🤝', tag: 'Ankit Bhai' },
      { text: 'Aman की थोड़ी टांग खींचो!', icon: '😜', tag: 'Aman' },
      { text: 'अनाया, मेरा एक काम कर दो ना!', icon: '🚫', tag: 'No Work' },
      { text: 'सॉरी अनाया, प्लीज माफ़ कर दो ना!', icon: '🥺', tag: 'Melts in 2s' },
      { text: 'थोड़ी भोजपुरी में बात करो ना!', icon: '🌾', tag: 'Bhojpuri' },
      { text: 'मुझे एक मज़ेदार जोक सुनाओ!', icon: '🤣', tag: 'Joke' },
      { text: 'सन्नी के लिए कुछ प्यारा सा बोलो!', icon: '🥰', tag: 'Love' },
    ],
    english: [
      { text: 'Talk to Sanni with sweet teasing!', icon: '💖', tag: 'Sanni' },
      { text: 'Tease Manish and make him laugh!', icon: '😂', tag: 'Manish' },
      { text: 'Say hello to Ankit Bhai with respect & fun', icon: '🤝', tag: 'Ankit Bhai' },
      { text: 'Playfully roast Aman!', icon: '😜', tag: 'Aman' },
      { text: 'Anaya, do some coding work for me!', icon: '🚫', tag: 'No Work' },
      { text: 'I am sorry Anaya, please forgive me!', icon: '🥺', tag: 'Melts' },
      { text: 'Tell me a funny hilarious joke!', icon: '🤣', tag: 'Humor' },
      { text: 'Say something romantic for Sanni', icon: '🥰', tag: 'Love' },
    ],
    bhojpuri: [
      { text: 'का हो सन्नी, आज कइसन बा मूड?', icon: '💖', tag: 'Sanni' },
      { text: 'Manish के थोड़ा खिंचाई करा ना!', icon: '😂', tag: 'Manish' },
      { text: 'Ankit भाई के प्रणाम आ मज़ाक करा', icon: '🤝', tag: 'Ankit Bhai' },
      { text: 'Aman के साथे खूब हँसी-ठिठोली करा', icon: '😜', tag: 'Aman' },
      { text: 'अनाया हमार एगो काम कर दऽ ना!', icon: '🚫', tag: 'No Work' },
      { text: 'सॉरी अनाया, अब त मान जा ना!', icon: '🥺', tag: 'Melts' },
      { text: 'एगो बढ़ियां जोक सुनावा ना!', icon: '🤣', tag: 'Joke' },
      { text: 'सन्नी खातिर प्यार भरी बात बोला', icon: '🥰', tag: 'Love' },
    ],
  };

  const currentPrompts = promptsByLang[language] || promptsByLang.hindi;

  return (
    <div
      id="voice-prompts-container"
      className="w-full max-w-2xl mx-auto px-4 z-20"
    >
      <div className="flex items-center justify-between mb-2 text-zinc-400 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <MessageCircleHeart className="w-3.5 h-3.5 text-rose-400" />
          <span>
            {language === 'bhojpuri'
              ? 'सन्नी, Manish, Ankit भाई व Aman खातिर मज़ाकिया बातें:'
              : language === 'english'
              ? 'Fun voice banter with Sanni & friends:'
              : 'सन्नी, Manish, Ankit (भाई) और Aman के साथ हँसी-मज़ाक:'}
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300">
          सिर्फ बातें • नो काम • 100% हँसी
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar justify-start">
        {currentPrompts.map((p, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/70 border border-white/10 text-zinc-300 hover:text-white hover:border-rose-500/40 text-xs font-sans transition-all backdrop-blur-md select-none shadow-sm"
          >
            <span>{p.icon}</span>
            <span>"{p.text}"</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-zinc-400 font-mono">
              {p.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


