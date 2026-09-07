import React, { useState } from 'react';
import {
  Coffee,
  Copy,
  Check,
  Play,
  Terminal,
  FileCode,
  Sparkles,
  X,
  BookOpen,
  Send,
} from 'lucide-react';
import { JavaCodeData } from '../types';

interface JavaStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: JavaCodeData | null;
}

export const JavaStudioModal: React.FC<JavaStudioModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [topic, setTopic] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'pseudo' | 'explain' | 'mobile'>('code');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTermux, setCopiedTermux] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentData, setCurrentData] = useState<JavaCodeData>(
    initialData || {
      title: 'Palindrome & String Check in Java',
      pseudoCode: `// 1. उपयोगकर्ता से स्ट्रिंग इनपुट लें (Scanner)
// 2. उल्टे क्रम में अक्षरों को लूप चलाकर जोड़ें (Reverse String)
// 3. यदि मूल स्ट्रिंग और उल्टी स्ट्रिंग समान हों तो "Palindrome" प्रिंट करें
// 4. अन्यथा "Not Palindrome" प्रिंट करें`,
      javaCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("स्ट्रिंग या संख्या दर्ज करें: ");
        String original = scanner.nextLine();
        
        String reversed = "";
        for (int i = original.length() - 1; i >= 0; i--) {
            reversed += original.charAt(i);
        }
        
        if (original.equalsIgnoreCase(reversed)) {
            System.out.println("✅ '" + original + "' एक Palindrome है!");
        } else {
            System.out.println("❌ '" + original + "' Palindrome नहीं है।");
        }
        
        System.out.println("Program by ~ Sanny");
        scanner.close();
    }
}`,
      explanationHinglish: `1. 'Scanner' क्लास का उपयोग करके हम सन्नी का इनपुट लेते हैं।
2. 'for' लूप को उल्टे से (length - 1 से 0 तक) चलाकर एक नया 'reversed' स्ट्रिंग बनाते हैं।
3. 'equalsIgnoreCase()' मेथड से दोनों स्ट्रिंग्स की तुलना करते हैं चाहे कैपिटल हो या स्मॉल।
4. 'Main' क्लास सिंगल-फाइल में मोबाइल पर आसानी से बिना किसी एरर के कंपाइल हो जाती है।`,
      sampleInputOutput: `Input:
radar

Output:
स्ट्रिंग या संख्या दर्ज करें: radar
✅ 'radar' एक Palindrome है!
Program by ~ Sanny`,
      mobileRunTip: `📱 Termux में ऐसे चलाएं:
1. nano Main.java (कोड पेस्ट करें और Ctrl+O दबाकर सेव करें)
2. javac Main.java (कंपाइल)
3. java Main (रन करें)
👉 या Jvdroid / OnlineGDB मोबाइल ब्राउज़र में डायरेक्ट 'Run ▶' दबाएं!`,
      authorSignature: '~ Sanny',
    }
  );

  if (!isOpen) return null;

  const quickJavaTopics = [
    'Palindrome Checker',
    'Fibonacci Series',
    'Bubble Sort Array',
    'Prime Number Check',
    'Matrix Multiplication',
    'Student Class & Object (OOPs)',
  ];

  const handleGenerateCustom = async (selectedTopic: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-java', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedTopic }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentData(data);
        setActiveTab('code');
      }
    } catch (e) {
      console.warn('Java generation error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentData.javaCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyTermux = () => {
    const cmd = `cat << 'EOF' > Main.java\n${currentData.javaCode}\nEOF\njavac Main.java && java Main`;
    navigator.clipboard.writeText(cmd);
    setCopiedTermux(true);
    setTimeout(() => setCopiedTermux(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#181818] rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#2d2d2d] bg-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>अनाया की Mobile Java Source Code Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Single File Compilable
                </span>
              </h2>
              <p className="text-xs text-gray-400">{currentData.title} • Clean & Tested</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Topic Selector Bar */}
        <div className="p-3 bg-[#1e1e1e] border-b border-[#282828] space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="नया Java टॉपिक लिखें (e.g. Binary Search, Armstrong Number)..."
              className="flex-1 bg-[#141414] border border-[#333] rounded-xl px-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-hidden focus:border-amber-500"
            />
            <button
              onClick={() => topic && handleGenerateCustom(topic)}
              disabled={!topic || loading}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>कोड बनाएं</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <span className="text-gray-500 whitespace-nowrap">पॉपुलर:</span>
            {quickJavaTopics.map((item) => (
              <button
                key={item}
                onClick={() => handleGenerateCustom(item)}
                className="px-2 py-0.5 rounded-lg bg-[#282828] hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-[#383838]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Tabs */}
        <div className="flex items-center px-4 bg-[#141414] border-b border-[#252525] text-xs">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'code'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Java Source Code</span>
          </button>

          <button
            onClick={() => setActiveTab('pseudo')}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'pseudo'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pseudo-Code Logic</span>
          </button>

          <button
            onClick={() => setActiveTab('explain')}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'explain'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hinglish समझाइश</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'mobile'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Mobile Runner (Termux/Jvdroid)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span>Main.java (Compiled Single File)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyTermux}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2a2a2a] text-gray-300 hover:text-white transition-colors"
                  >
                    {copiedTermux ? <Check className="w-3 h-3 text-emerald-400" /> : <Terminal className="w-3 h-3" />}
                    <span>{copiedTermux ? 'Copied Termux Cmd!' : 'Termux 1-Click Run'}</span>
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-[#101010] border border-[#2b2b2b] text-emerald-300 font-mono leading-relaxed overflow-x-auto select-all">
                <code>{currentData.javaCode}</code>
              </pre>

              {/* Sample Input / Output Card */}
              <div className="p-3 rounded-xl bg-[#1c1c1c] border border-[#2c2c2c] space-y-1 font-mono text-[11px]">
                <span className="text-gray-400 block font-sans font-semibold">Sample Input & Expected Output:</span>
                <pre className="text-gray-300 whitespace-pre-wrap">{currentData.sampleInputOutput}</pre>
              </div>
            </div>
          )}

          {activeTab === 'pseudo' && (
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2d2d2d] space-y-2">
              <span className="font-semibold text-amber-300 text-sm block">स्टेप-बाय-स्टेप Pseudo-Code लॉजिक:</span>
              <pre className="text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                {currentData.pseudoCode}
              </pre>
            </div>
          )}

          {activeTab === 'explain' && (
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2d2d2d] space-y-3 leading-relaxed">
              <span className="font-semibold text-pink-300 text-sm block">अनाया की आसान Hinglish समझाइश:</span>
              <div className="text-gray-200 whitespace-pre-wrap">{currentData.explanationHinglish}</div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2d2d2d] space-y-3">
              <span className="font-semibold text-cyan-300 text-sm block">मोबाइल पर Java चलाने का तरीका:</span>
              <div className="text-gray-200 whitespace-pre-wrap">{currentData.mobileRunTip}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-between text-xs">
          <span className="text-amber-400 font-mono font-semibold">
            {currentData.authorSignature || '~ Sanny'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#333] hover:bg-[#444] text-gray-200 font-medium transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
