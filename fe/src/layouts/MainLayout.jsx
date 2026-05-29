import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, LayoutDashboard, Settings, LogOut, Map, Cpu, Bell, ShieldCheck,
  Mic, MicOff, Send, RefreshCw, AlertTriangle, CheckCircle2, MessageSquare, Menu, X
} from 'lucide-react';
import { sendAssistantChat } from '../services/api/assistant';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/home', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan' },
    { path: '/map', icon: <Map className="w-5 h-5" />, label: 'Bản đồ không gian 2D' },
    { path: '/map3d', icon: <Map className="w-5 h-5" />, label: 'Bản đồ không gian 3D' },
    { path: '/devices', icon: <Cpu className="w-5 h-5" />, label: 'Quản lý thiết bị' },
    { path: '/notifications', icon: <Bell className="w-5 h-5" />, label: 'Lịch sử hoạt động' },
    { path: '/security', icon: <ShieldCheck className="w-5 h-5" />, label: 'Camera & An ninh' },
    { path: '/assistant-history', icon: <MessageSquare className="w-5 h-5" />, label: 'Lịch sử trò chuyện' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ================= STATES & LOGIC TRỢ LÝ AI ĐA TRANG =================
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiReply, setAiReply] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const recognitionRef = useRef(null);

  // Khởi tạo Web Speech API nhận diện giọng nói (Speech-to-Text)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'vi-VN';
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setChatInput(speechToText);
        handleSendChat(speechToText);
      };
      recognitionRef.current = rec;
    }
  }, []);
  const handleLogout = () => {
  const keysToRemove = ['token', 'refreshToken', 'userId', 'fullName', 'email'];
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  navigate('/');
};

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ Voice Speech API.");
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
    try {
      const response = await sendAssistantChat(message);
      if (response && response.code === 1000) {
        const replyText = response.data.reply;
        setAiReply(replyText);

        const newLogUser = { id: 'u-' + Date.now(), message: message, isAssistant: false, actionType: 'USER_REQUEST', createdAt: new Date().toISOString() };
        const newLogAI = { id: 'a-' + Date.now(), message: replyText, isAssistant: true, actionType: response.data.actionType || 'CONTROL_DEVICE', createdAt: new Date().toISOString() };
        
        window.dispatchEvent(new CustomEvent('tsmarthome_new_chat', { detail: { user: newLogUser, ai: newLogAI } }));
        // --------------------------------------------------------------------------------

        const localHistory = JSON.parse(localStorage.getItem('tsmarthome_chat_history') || '[]');
        localStorage.setItem('tsmarthome_chat_history', JSON.stringify([newLogAI, newLogUser, ...localHistory].slice(0, 50)));

        setTimeout(() => setAiReply(''), 4500);
      }
    } catch (error) {
      console.error("Lỗi tương tác trợ lý:", error);
      setAiReply("Kết nối máy chủ Gemini thất bại.");
      setTimeout(() => setAiReply(''), 3000);
    } finally {
      setIsAiLoading(false);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    navigate('/');
  };

  const SidebarContent = () => (
    // Thêm h-full và flex-col để cấu trúc linh hoạt
    <div className="flex flex-col justify-between h-full w-full bg-slate-900 border-r border-white/5 font-sans text-slate-300 overflow-hidden">
      {/* Bọc vùng menu trong một khối có thể cuộn độc lập nếu màn hình điện thoại quá ngắn */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-12">
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-600/40">
              <Home className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-black text-white tracking-wider uppercase">TSmartHome</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white md:hidden transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-500/30' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Vùng nút Đăng xuất dưới đáy cố định */}
      <div className="p-4 border-t border-white/5 space-y-1.5 shrink-0 bg-slate-950/40 sticky bottom-0">
        <Link 
          to="/settings" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
        >
          <Settings className="w-5 h-5" />
          Cài đặt
        </Link>
        
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            setShowLogoutModal(true);
          }}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-left"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* HEADER ĐIỆN THOẠI */}
      <header className="h-16 w-full bg-slate-900 border-b border-white/5 flex items-center justify-between px-4 shrink-0 md:hidden z-30">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Home className="text-white w-4 h-4" />
          </div>
          <span className="text-sm font-black tracking-widest text-white uppercase">TSmartHome</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:text-white active:scale-95 transition-all text-slate-300"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* SIDEBAR CỐ ĐỊNH PC */}
      <aside className="w-64 hidden md:flex h-full shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* NGĂN KÉO DI ĐỘNG DRAWER (Đã nâng lên z-50 để đè lên thanh Mic chat) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-300">
          <div onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative w-64 h-full animate-in slide-in-from-left duration-300 shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* KHÔNG GIAN LÀM VIỆC CHÍNH */}
      <main className="flex-1 h-full overflow-y-auto relative bg-[#0a0a0a]">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/5 to-transparent -z-10 pointer-events-none"></div>
        <Outlet />

        {/* HUD CHAT AI GEMINI */}
        <div className="fixed bottom-6 left-1/2 md:left-[calc(50%+128px)] -translate-x-1/2 z-40 flex flex-col items-center gap-2.5 w-[calc(100vw-3rem)] max-w-lg pointer-events-auto">
          {aiReply && (
            <div className="bg-slate-900/95 border border-blue-500/30 text-blue-100 text-xs font-semibold px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-full text-center backdrop-blur-md relative">
              <p className="leading-relaxed">{aiReply}</p>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-b border-r border-blue-500/30 rotate-45"></div>
            </div>
          )}

          <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <button 
              onClick={toggleListening}
              className={`p-2.5 rounded-full transition-all shrink-0 border relative outline-none ${isListening ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/5'}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening && <span className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-50"></span>}
            </button>

            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder={isListening ? "Đang ghi âm giọng nói..." : "Ra lệnh cho trợ lý ảo..."}
              className="flex-1 bg-transparent border-none text-white placeholder-slate-500 text-xs font-bold outline-none px-2"
            />

            <button 
              onClick={() => handleSendChat()}
              disabled={!chatInput.trim() || isAiLoading}
              className={`p-2.5 rounded-full transition-all shrink-0 outline-none ${chatInput.trim() && !isAiLoading ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}
            >
              {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin text-blue-400" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>

      {/* POPUP CONFIRM DIALOG XÁC NHẬN ĐĂNG XUẤT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div onClick={() => setShowLogoutModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          <div className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-[0_0_50px_rgba(244,63,94,0.15)] text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Xác nhận đăng xuất</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị <span className="text-blue-400 font-bold">TSmartHome</span> không?</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all outline-none border border-white/5">Hủy bỏ</button>
              <button onClick={confirmLogout} className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-all outline-none shadow-lg">Đăng xuất</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}