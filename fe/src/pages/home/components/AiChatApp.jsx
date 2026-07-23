import { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, RefreshCw, MessageSquare, Bot, User, Clock, HelpCircle, Cpu, Layers 
} from 'lucide-react';
import { sendAssistantChat, getAssistantHistory } from '../../../services/api/assistant';

export default function AiChatApp() {
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatLogs, setChatLogs] = useState([]);
  
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const chatContainerRef = useRef(null);

  // Load chat history from localStorage or API on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getAssistantHistory(0);
        if (response && response.code === 1000) {
          const newData = Array.isArray(response.data) ? response.data : response.data.content || [];
          setChatLogs(newData.reverse()); // Show chronologically
        } else {
          // Fallback to local storage
          const localHistory = JSON.parse(localStorage.getItem('tsmarthome_chat_history') || '[]');
          setChatLogs(localHistory.reverse());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  // Auto scroll to bottom when chat logs update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLogs]);

  // Speech Recognition Speech-to-Text Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.lang = 'vi-VN';
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        finalTranscriptRef.current = '';
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        setTimeout(() => {
          const recognizedText = finalTranscriptRef.current.trim();
          if (recognizedText) {
            handleSendChat(recognizedText);
          }
        }, 100);
      };

      rec.onresult = (event) => {
        let interimTranscript = '';
        let localFinal = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            localFinal += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        finalTranscriptRef.current += localFinal;
        const currentText = finalTranscriptRef.current + interimTranscript;
        setChatInput(currentText);

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        // Auto-stop after 2.2s silence
        silenceTimerRef.current = setTimeout(() => {
          rec.stop();
        }, 2200);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt không hỗ trợ Voice Speech API.");
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  const handleSendChat = async (textToSend) => {
    const message = textToSend || chatInput;
    if (!message.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setChatInput('');

    // Append user message instantly
    const userLog = { 
      id: 'u-' + Date.now(), 
      message: message, 
      isAssistant: false, 
      createdAt: new Date().toISOString() 
    };
    setChatLogs(prev => [...prev, userLog]);

    try {
      const response = await sendAssistantChat(message);
      if (response && response.code === 1000) {
        const replyText = response.data.reply;
        
        const aiLog = { 
          id: 'a-' + Date.now(), 
          message: replyText, 
          isAssistant: true, 
          actionType: response.data.actionType || 'CONTROL_DEVICE', 
          createdAt: new Date().toISOString() 
        };

        // Update logs list
        setChatLogs(prev => [...prev, aiLog]);

        // Dispatch system event to notify other modules
        window.dispatchEvent(new CustomEvent('tsmarthome_new_chat', { detail: { user: userLog, ai: aiLog } }));

        // Sync local storage
        const localHistory = JSON.parse(localStorage.getItem('tsmarthome_chat_history') || '[]');
        localStorage.setItem('tsmarthome_chat_history', JSON.stringify([aiLog, userLog, ...localHistory].slice(0, 50)));
      }
    } catch (error) {
      console.error("Lỗi tương tác trợ lý:", error);
      const errLog = { 
        id: 'e-' + Date.now(), 
        message: "Kết nối máy chủ Gemini thất bại.", 
        isAssistant: true, 
        createdAt: new Date().toISOString() 
      };
      setChatLogs(prev => [...prev, errLog]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const formatChatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getActionIcon = (actionType) => {
    if (actionType === 'CONTROL_DEVICE') return <Cpu className="w-3.5 h-3.5 text-emerald-400" title="Điều khiển thiết bị" />;
    if (actionType === 'BULK_CONTROL') return <Layers className="w-3.5 h-3.5 text-violet-400" title="Kịch bản nhóm" />;
    return <HelpCircle className="w-3.5 h-3.5 text-amber-400" title="Hỏi đáp" />;
  };

  return (
    <div className="flex flex-col h-full text-white font-sans overflow-hidden">
      {/* Messages stream panel */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
      >
        {chatLogs.length > 0 ? (
          chatLogs.map(log => {
            const isBot = log.isAssistant;
            return (
              <div 
                key={log.id} 
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                  isBot ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-white/10 border-white/15 text-slate-300'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message bubble */}
                <div className="flex flex-col gap-1">
                  <div className={`p-3 rounded-2xl text-xs font-semibold shadow-md ${
                    isBot 
                      ? 'bg-slate-800/80 border border-white/5 text-slate-100 rounded-tl-none' 
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{log.message}</p>
                  </div>
                  
                  <div className={`flex items-center gap-1.5 text-[8px] text-slate-500 font-bold uppercase tracking-wider px-1 ${
                    isBot ? 'justify-start' : 'justify-end'
                  }`}>
                    <Clock className="w-2.5 h-2.5" />
                    <span>{formatChatTime(log.createdAt)}</span>
                    {isBot && log.actionType && (
                      <>
                        <span>•</span>
                        {getActionIcon(log.actionType)}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-3">
            <MessageSquare className="w-12 h-12 text-slate-700 opacity-30 animate-pulse" />
            <p className="max-w-[200px] text-center">Chào bạn! Tôi là Trợ lý AI. Bạn hãy bấm vào nút ghi âm hoặc gõ lệnh để tôi giúp điều khiển nhà nhé!</p>
          </div>
        )}
      </div>

      {/* Inputs floating area inside window bottom */}
      <div className="p-3 border-t border-white/5 bg-slate-950/40 shrink-0">
        <div className="bg-slate-900 border border-white/10 p-1.5 rounded-full flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-full transition-all shrink-0 border relative outline-none cursor-pointer ${
              isListening 
                ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse' 
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/5'
            }`}
          >
            {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            {isListening && <span className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-50"></span>}
          </button>

          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            placeholder={isListening ? "Đang ghi âm giọng nói..." : "Ra lệnh cho trợ lý ảo..."}
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 font-bold outline-none px-2"
          />

          <button
            onClick={() => handleSendChat()}
            disabled={!chatInput.trim() || isAiLoading}
            className={`p-2.5 rounded-full transition-all shrink-0 cursor-pointer ${
              chatInput.trim() && !isAiLoading 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md' 
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            {isAiLoading ? <RefreshCw className="w-4.5 h-4.5 animate-spin text-blue-400" /> : <Send className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
