import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, LayoutDashboard, Settings, LogOut, Map, Cpu, Bell, ShieldCheck,
  Mic, MicOff, Send, RefreshCw, AlertTriangle, CheckCircle2, MessageSquare, Menu, X, Clock,
  Mail, Phone, MapPin, Check, Camera, User, Edit2, Lock, Globe, Key, Trash2,
  Users, Terminal
} from 'lucide-react';
import { sendAssistantChat } from '../services/api/assistant';
import { getMyHomes } from '../services/api/home';
import { getUserProfile, updateUserProfile, generateTelegramCode, disconnectTelegram } from '../services/api/profile';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [profileTab, setProfileTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    region: '',
    avatarUrl: '',
    telegramChatId: '',
    telegramUsername: ''
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [telegramLinkCode, setTelegramLinkCode] = useState(null);
  const [telegramCodeTimer, setTelegramCodeTimer] = useState(0);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Countdown timer hook for code expiry
  useEffect(() => {
    if (telegramCodeTimer <= 0) return;
    const interval = setInterval(() => {
      setTelegramCodeTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [telegramCodeTimer]);

  const formatCodeTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Polling for Telegram link status
  useEffect(() => {
    let intervalId = null;
    if (showProfileModal && profileTab === 'telegram' && telegramLinkCode && telegramCodeTimer > 0 && !profileForm.telegramChatId) {
      intervalId = setInterval(async () => {
        try {
          const res = await getUserProfile();
          if (res && res.code === 1000 && res.data && res.data.telegramChatId) {
            setProfileForm(prev => ({
              ...prev,
              telegramChatId: res.data.telegramChatId,
              telegramUsername: res.data.telegramUsername || ''
            }));
            setTelegramLinkCode(null);
            setTelegramCodeTimer(0);
            setToast({ show: true, message: 'Kết nối Telegram thành công!', type: 'success' });
            fetchProfile();
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra kết nối Telegram:", error);
        }
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showProfileModal, profileTab, telegramLinkCode, telegramCodeTimer, profileForm.telegramChatId]);

  const getDisplayAvatar = (url) => {
    if (!url) return "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(url)}`;
  };

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await getMyHomes();
        if (res && res.code === 1000 && res.data && res.data.length > 0) {
          const defaultHomeId = res.data[0].id;
          const currentActive = localStorage.getItem('activeHomeId') || sessionStorage.getItem('activeHomeId');
          if (!currentActive) {
            localStorage.setItem('activeHomeId', defaultHomeId);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách ngôi nhà:", err);
      }
    };
    fetchHomes();

    const fetchProfileSilent = async () => {
      try {
        const res = await getUserProfile();
        if (res && res.code === 1000 && res.data) {
          const fullName = `${res.data.lastName} ${res.data.firstName}`.trim();
          const displayAvatar = getDisplayAvatar(res.data.avatarUrl);
          localStorage.setItem('fullName', fullName);
          localStorage.setItem('avatarUrl', displayAvatar);
          window.dispatchEvent(new CustomEvent('tsmarthome_profile_updated'));
        }
      } catch (err) {
        console.error("Lỗi khi đồng bộ profile:", err);
      }
    };
    fetchProfileSilent();

    const handleOpenProfile = () => setShowProfileModal(true);
    window.addEventListener('tsmarthome_open_profile', handleOpenProfile);
    return () => {
      window.removeEventListener('tsmarthome_open_profile', handleOpenProfile);
    };
  }, []);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await getUserProfile();
      if (res && res.code === 1000 && res.data) {
        setProfileForm({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
          phoneNumber: res.data.phoneNumber || '',
          region: res.data.region || '',
          avatarUrl: res.data.avatarUrl || '',
          telegramChatId: res.data.telegramChatId || '',
          telegramUsername: res.data.telegramUsername || ''
        });
        
        const fullName = `${res.data.lastName} ${res.data.firstName}`.trim();
        const displayAvatar = getDisplayAvatar(res.data.avatarUrl);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('avatarUrl', displayAvatar);
        window.dispatchEvent(new CustomEvent('tsmarthome_profile_updated'));
      }
    } catch (err) {
      console.error("Lỗi khi tải hồ sơ người dùng:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (showProfileModal) {
      fetchProfile();
      setIsEditingProfile(false);
      setIsChangingPassword(false);
      setTelegramLinkCode(null);
      setTelegramCodeTimer(0);
    }
  }, [showProfileModal]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa rõ';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setToast({ show: true, message: 'Vui lòng điền đầy đủ các trường!', type: 'error' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ show: true, message: 'Mật khẩu mới không trùng khớp!', type: 'error' });
      return;
    }
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      setToast({ show: true, message: 'Đổi mật khẩu thành công!', type: 'success' });
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 1000);
  };

  const handleGenerateTelegramCode = async () => {
    setIsGeneratingCode(true);
    try {
      const res = await generateTelegramCode();
      if (res && res.code === 1000 && res.data) {
        setTelegramLinkCode(res.data.code);
        // Calculate remaining seconds based on expiresAt
        const expiresTime = new Date(res.data.expiresAt).getTime();
        const nowTime = new Date().getTime();
        const remainingSecs = Math.max(0, Math.floor((expiresTime - nowTime) / 1000));
        setTelegramCodeTimer(remainingSecs > 0 ? remainingSecs : 600); // 10 minutes fallback
        setToast({ show: true, message: 'Đã tạo mã liên kết thành công!', type: 'success' });
      }
    } catch (error) {
      console.error("Lỗi tạo mã liên kết:", error);
      setToast({ show: true, message: 'Tạo mã liên kết thất bại!', type: 'error' });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    setSavingProfile(true);
    try {
      const res = await disconnectTelegram();
      if (res && res.code === 1000) {
        setProfileForm(prev => ({
          ...prev,
          telegramChatId: '',
          telegramUsername: ''
        }));
        setTelegramLinkCode(null);
        setTelegramCodeTimer(0);
        setToast({ show: true, message: 'Hủy kết nối Telegram thành công!', type: 'success' });
        fetchProfile();
      }
    } catch (err) {
      console.error("Lỗi hủy kết nối:", err);
      setToast({ show: true, message: 'Hủy kết nối thất bại!', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSyncTelegram = async () => {
    setSavingProfile(true);
    try {
      await fetchProfile();
      setToast({ show: true, message: 'Đã đồng bộ thông tin kết nối!', type: 'success' });
    } catch (err) {
      setToast({ show: true, message: 'Đồng bộ thất bại!', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await updateUserProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phoneNumber: profileForm.phoneNumber,
        region: profileForm.region,
        avatarUrl: profileForm.avatarUrl,
        telegramChatId: profileForm.telegramChatId
      });
      if (res && res.code === 1000 && res.data) {
        setToast({ show: true, message: 'Cập nhật hồ sơ thành công!', type: 'success' });
        
        const fullName = `${res.data.lastName} ${res.data.firstName}`.trim();
        const displayAvatar = getDisplayAvatar(res.data.avatarUrl);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('avatarUrl', displayAvatar);
        window.dispatchEvent(new CustomEvent('tsmarthome_profile_updated'));
        
        setIsEditingProfile(false);
        fetchProfile();
      }
    } catch (err) {
      console.error("Lỗi cập nhật hồ sơ:", err);
      setToast({ show: true, message: err.response?.data?.msg || 'Cập nhật hồ sơ thất bại!', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const userRole = localStorage.getItem('role') || sessionStorage.getItem('role') || 'USER';
  const isAdmin = userRole?.toUpperCase() === 'ADMIN';

  const menuItems = isAdmin ? [
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Quản lý User' },
    { path: '/admin/homes', icon: <Home className="w-5 h-5" />, label: 'Quản lý Home' },
    { path: '/admin/devices', icon: <Cpu className="w-5 h-5" />, label: 'Quản lý Thiết bị' },
    { path: '/admin/logs', icon: <Terminal className="w-5 h-5" />, label: 'Quản lý Log' },
    { path: '/admin/firmware', icon: <Settings className="w-5 h-5" />, label: 'Nạp Firmware' },
  ] : [
    { path: '/home', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan' },
    { path: '/map', icon: <Map className="w-5 h-5" />, label: 'Bản đồ không gian 2D' },
    { path: '/map3d', icon: <Map className="w-5 h-5" />, label: 'Bản đồ không gian 3D' },
    { path: '/devices', icon: <Cpu className="w-5 h-5" />, label: 'Quản lý thiết bị' },
    { path: '/notifications', icon: <Bell className="w-5 h-5" />, label: 'Lịch sử hoạt động' },
    { path: '/security', icon: <ShieldCheck className="w-5 h-5" />, label: 'Camera & An ninh' },
    { path: '/schedules', icon: <Clock className="w-5 h-5" />, label: 'Kịch bản tự động' },
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
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Khởi tạo Web Speech API nhận diện giọng nói (Speech-to-Text)
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
        // Tự động dừng nhận diện sau 2.2 giây im lặng
        silenceTimerRef.current = setTimeout(() => {
          rec.stop();
        }, 2200);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);
  const handleLogout = () => {
    const keysToRemove = ['token', 'refreshToken', 'userId', 'fullName', 'email', 'activeHomeId', 'role'];
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
    localStorage.removeItem('activeHomeId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('activeHomeId');
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
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${isActive
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
        {!isAdmin && (
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setShowProfileModal(true);
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-left outline-none"
          >
            <Settings className="w-5 h-5" />
            Cài đặt
          </button>
        )}

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
        {!isAdmin && (
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
        )}
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

      {/* POPUP HỒ SƠ CÁ NHÂN & CẤU HÌNH TELEGRAM */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setShowProfileModal(false)} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          {/* Modal Container */}
          <div className="relative w-full max-w-5xl h-[680px] bg-[#F8FAFC] text-slate-800 rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-[#E2E8F0] overflow-hidden flex flex-col transition-all transform scale-100 duration-300 animate-in fade-in-0 zoom-in-95">
            
            {/* FIXED HEADER */}
            <div className="shrink-0 h-[70px] border-b border-[#E2E8F0] bg-white flex items-center justify-between px-6 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-[#2563EB]">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cài đặt hệ thống</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Quản lý hồ sơ cá nhân và cấu hình kết nối dịch vụ</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BODY CONTAINER */}
            <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
              
              {/* LEFT SIDEBAR (25%) */}
              <div className="w-full md:w-64 border-r border-[#E2E8F0] bg-white p-4 flex flex-col justify-between shrink-0">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileTab('profile');
                      setIsEditingProfile(false);
                      setIsChangingPassword(false);
                    }}
                    className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left outline-none ${
                      profileTab === 'profile'
                        ? 'bg-blue-50 text-[#2563EB]'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {profileTab === 'profile' && (
                      <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#2563EB] rounded-r"></span>
                    )}
                    <User className={`w-4 h-4 ${profileTab === 'profile' ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                    Thông tin cá nhân
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileTab('telegram');
                      setIsEditingProfile(false);
                      setIsChangingPassword(false);
                    }}
                    className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left outline-none ${
                      profileTab === 'telegram'
                        ? 'bg-blue-50 text-[#2563EB]'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {profileTab === 'telegram' && (
                      <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#2563EB] rounded-r"></span>
                    )}
                    <Send className={`w-4 h-4 ${profileTab === 'telegram' ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                    Tích hợp Telegram
                  </button>
                </div>

                {/* Connection Status Card at Sidebar Bottom */}
                <div className="hidden md:block bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái kết nối</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${profileForm.telegramChatId ? 'bg-[#10B981] animate-pulse' : 'bg-amber-400'}`}></span>
                    <span className="text-xs font-bold text-slate-700">
                      {profileForm.telegramChatId ? 'Telegram hoạt động' : 'Chưa liên kết'}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT CONTENT (75%) */}
              <div className="flex-1 bg-[#F8FAFC] p-8 overflow-y-auto">
                {loadingProfile ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin" />
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Đang tải hồ sơ...</p>
                  </div>
                ) : (
                  <div className="h-full">
                    
                    {/* TAB 1: THÔNG TIN CÁ NHÂN */}
                    {profileTab === 'profile' && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        
                        {/* VIEW MODE */}
                        {!isEditingProfile && !isChangingPassword && (
                          <div className="space-y-6">
                            {/* Centered Avatar Section */}
                            <div className="flex flex-col items-center bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/10 shadow-md bg-slate-50 shrink-0">
                                <img 
                                  src={getDisplayAvatar(profileForm.avatarUrl)} 
                                  alt="avatar" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                disabled
                                className="mt-3 px-4 py-1.5 bg-slate-50 text-slate-400 text-xs font-bold rounded-full border border-slate-200/60 cursor-not-allowed"
                              >
                                Thay đổi ảnh đại diện
                              </button>
                            </div>

                            {/* Info Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center gap-1 hover:border-slate-200/60 transition-all duration-200">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Họ và tên</span>
                                <span className="text-sm text-slate-800 font-bold mt-0.5">
                                  {`${profileForm.lastName} ${profileForm.firstName}`.trim() || 'Chưa cập nhật'}
                                </span>
                              </div>

                              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center gap-1 hover:border-slate-200/60 transition-all duration-200">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email (Tài khoản)</span>
                                <span className="text-sm text-slate-800 font-bold mt-0.5">{profileForm.email}</span>
                              </div>

                              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center gap-1 hover:border-slate-200/60 transition-all duration-200">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số điện thoại</span>
                                <span className="text-sm text-slate-800 font-bold mt-0.5">{profileForm.phoneNumber || 'Chưa thiết lập'}</span>
                              </div>

                              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center gap-1 hover:border-slate-200/60 transition-all duration-200">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vai trò</span>
                                <div className="mt-0.5">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#10B981] border border-emerald-100 max-w-fit">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Chủ nhà
                                  </span>
                                </div>
                              </div>

                              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center gap-1 hover:border-slate-200/60 transition-all duration-200">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngày tạo tài khoản</span>
                                <span className="text-sm text-slate-800 font-bold mt-0.5">{formatDate(profileForm.createdAt)}</span>
                              </div>

                              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center gap-1 hover:border-slate-200/60 transition-all duration-200">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Khu vực / Quốc gia</span>
                                <span className="text-sm text-slate-800 font-bold mt-0.5">{profileForm.region || 'Việt Nam'}</span>
                              </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E2E8F0]">
                              <button 
                                type="button"
                                onClick={() => setIsEditingProfile(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-[#2563EB] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#2563EB] shadow-sm transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Chỉnh sửa thông tin
                              </button>
                              <button 
                                type="button"
                                onClick={() => setIsChangingPassword(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                Đổi mật khẩu
                              </button>
                            </div>
                          </div>
                        )}

                        {/* EDIT PROFILE MODE */}
                        {isEditingProfile && (
                          <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                <User className="w-4 h-4 text-[#2563EB]" />
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Thông tin tài khoản</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ</label>
                                  <input 
                                    type="text" 
                                    value={profileForm.lastName || ''} 
                                    onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                                    required
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tên</label>
                                  <input 
                                    type="text" 
                                    value={profileForm.firstName || ''} 
                                    onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                                    required
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                                  <input 
                                    type="text" 
                                    value={profileForm.phoneNumber || ''} 
                                    onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                                    placeholder="Nhập SĐT..."
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Khu vực / Quốc gia</label>
                                  <input 
                                    type="text" 
                                    value={profileForm.region || ''} 
                                    onChange={(e) => setProfileForm({...profileForm, region: e.target.value})}
                                    placeholder="Ví dụ: Việt Nam"
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Avatar URL (hoặc Dicebear Seed)</label>
                                <input 
                                  type="text" 
                                  value={profileForm.avatarUrl || ''} 
                                  onChange={(e) => setProfileForm({...profileForm, avatarUrl: e.target.value})}
                                  placeholder="Nhập link ảnh hoặc seed avatar" 
                                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Gợi ý: Nhập tên của bạn để tự sinh avatar.</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E2E8F0]">
                              <button 
                                type="button"
                                onClick={() => { setIsEditingProfile(false); fetchProfile(); }}
                                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer"
                              >
                                Hủy
                              </button>
                              <button 
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/15 transition-all cursor-pointer"
                              >
                                {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                Lưu thay đổi
                              </button>
                            </div>
                          </form>
                        )}

                        {/* CHANGE PASSWORD MODE */}
                        {isChangingPassword && (
                          <form onSubmit={handleChangePasswordSubmit} className="space-y-6">
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                <Key className="w-4 h-4 text-[#2563EB]" />
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Đổi mật khẩu tài khoản</span>
                              </div>

                              <div className="space-y-3.5">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu hiện tại</label>
                                  <input 
                                    type="password" 
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                    required
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu mới</label>
                                  <input 
                                    type="password" 
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    required
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Xác nhận mật khẩu mới</label>
                                  <input 
                                    type="password" 
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    required
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E2E8F0]">
                              <button 
                                type="button"
                                onClick={() => setIsChangingPassword(false)}
                                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer"
                              >
                                Hủy
                              </button>
                              <button 
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/15 transition-all cursor-pointer"
                              >
                                {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                                Cập nhật mật khẩu
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}

                    {/* TAB 2: TÍCH HỢP TELEGRAM */}
                    {profileTab === 'telegram' && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm mb-2">
                          {/* Telegram large Logo */}
                          <div className="shrink-0">
                            <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#29B6F6]" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.89 1.2-5.33 3.52-.5.35-.96.52-1.37.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.87-1.69 6.45-2.8 7.74-3.35 3.69-1.57 4.45-1.84 4.95-1.85.11 0 .36.03.52.16.14.11.18.26.19.37 0 .07.01.21 0 .33z" />
                            </svg>
                          </div>

                          {/* Connection details */}
                          <div className="flex-1 w-full text-center md:text-left">
                            <h4 className="text-base font-bold text-slate-800">Liên kết Telegram Bot</h4>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Bot dịch vụ: @MYTSMARTHOME_BOT</p>
                            
                            <div className="mt-4 flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                              <span className="text-xs font-bold text-slate-500">Trạng thái:</span>
                              {profileForm.telegramChatId ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#10B981] border border-emerald-100">
                                  <Check className="w-3.5 h-3.5" />
                                  Đã kết nối thành công
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                  Chưa liên kết
                                </span>
                              )}
                            </div>

                            {profileForm.telegramChatId && (
                              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 justify-center md:justify-start text-xs text-slate-500 font-medium">
                                <span>Telegram Chat ID: <strong className="text-slate-700 font-bold">{profileForm.telegramChatId}</strong></span>
                                <span>Username: <strong className="text-slate-700 font-bold">@{profileForm.telegramUsername || 'Chưa rõ'}</strong></span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Telegram Connect Form */}
                        {!profileForm.telegramChatId ? (
                          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                            {telegramLinkCode ? (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                  <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Đang chờ liên kết từ Telegram Bot</span>
                                </div>

                                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã liên kết của bạn</p>
                                  <div className="flex items-center justify-center gap-3">
                                    <span className="text-2xl font-mono font-black text-slate-800 tracking-wider bg-white border border-slate-200 px-4 py-1.5 rounded-xl shadow-sm">
                                      {telegramLinkCode}
                                    </span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(`/link ${telegramLinkCode}`);
                                        setToast({ show: true, message: 'Đã sao chép lệnh liên kết!', type: 'success' });
                                      }}
                                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-100 rounded-xl bg-white transition-all cursor-pointer"
                                      title="Sao chép lệnh"
                                    >
                                      <Send className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {telegramCodeTimer > 0 ? (
                                    <p className="text-[11px] text-slate-500 font-medium">
                                      Mã sẽ hết hạn sau: <strong className="text-rose-500 font-mono font-bold">{formatCodeTimer(telegramCodeTimer)}</strong>
                                    </p>
                                  ) : (
                                    <p className="text-[11px] text-rose-500 font-bold">Mã xác thực đã hết hạn. Vui lòng tạo mã mới.</p>
                                  )}
                                </div>

                                <div className="text-xs text-slate-600 font-medium leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-50/80">
                                  <p className="font-bold text-slate-800 mb-1">Hướng dẫn nhanh:</p>
                                  <ol className="list-decimal pl-4 space-y-1">
                                    <li>Nhấp vào nút <strong>Mở Telegram Bot</strong> dưới đây.</li>
                                    <li>Nhấn nút <strong>Start</strong> trên Telegram (hoặc gửi tin nhắn: <code className="bg-white border border-slate-200 px-1 py-0.5 rounded text-blue-600 font-mono">/start {telegramLinkCode}</code>) để kết nối tự động.</li>
                                    <li>Hệ thống web sẽ tự động nhận diện và cập nhật trạng thái khi liên kết thành công.</li>
                                  </ol>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                  <a
                                    href={`https://t.me/MYTSMARTHOME_BOT?start=${telegramLinkCode}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/15 transition-all cursor-pointer"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    Mở Telegram Bot
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTelegramLinkCode(null);
                                      setTelegramCodeTimer(0);
                                    }}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer"
                                  >
                                    Hủy tạo mã
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="py-4 space-y-4">
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                  Tích hợp Telegram Bot giúp bạn nhận ngay các cảnh báo khẩn cấp từ hệ thống nhà thông minh TSmartHome (phát hiện người, cảnh báo cháy, khí gas rò rỉ...) trực tiếp trên ứng dụng Telegram mà không cần mở trình duyệt.
                                </p>
                                <div>
                                  <button
                                    type="button"
                                    onClick={handleGenerateTelegramCode}
                                    disabled={isGeneratingCode}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/15 transition-all cursor-pointer"
                                  >
                                    {isGeneratingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                                    Tạo mã liên kết Telegram
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-3">
                            <button
                              type="button"
                              onClick={handleSyncTelegram}
                              disabled={savingProfile}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 transition-all cursor-pointer shadow-sm"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Đồng bộ lại
                            </button>
                            <button
                              type="button"
                              onClick={handleDisconnectTelegram}
                              disabled={savingProfile}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider rounded-xl border border-rose-200 transition-all cursor-pointer shadow-sm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Hủy liên kết
                            </button>
                          </div>
                        )}

                        {/* Guide steps */}
                        <div className="space-y-4">
                          <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Các bước thực hiện kết nối</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Step 1 */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-3.5">
                              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">1</div>
                              <div>
                                <h6 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Tạo mã xác thực</h6>
                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Click chọn <strong>Tạo mã liên kết Telegram</strong> trên trang web để tạo mã bảo mật ngẫu nhiên có hiệu lực trong 10 phút.</p>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-3.5">
                              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">2</div>
                              <div>
                                <h6 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Mở Telegram Bot</h6>
                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Tìm kiếm bot dịch vụ <span className="text-[#2563EB] font-bold">@MYTSMARTHOME_BOT</span> trên Telegram hoặc nhấn nút mở trực tiếp.</p>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-3.5">
                              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">3</div>
                              <div>
                                <h6 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Kích hoạt lệnh liên kết</h6>
                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Gửi tin nhắn kích hoạt theo cú pháp: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono text-[10px]">/link TSM-XXXXXX</code> hoặc bấm Start.</p>
                              </div>
                            </div>

                            {/* Step 4 */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-3.5">
                              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">4</div>
                              <div>
                                <h6 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Hoàn tất kết nối</h6>
                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Hệ thống sẽ đồng bộ thông tin ngay khi nhận được lệnh và hiển thị trạng thái kết nối thành công.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TOAST THÔNG BÁO HỒ SƠ */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 shadow-xl animate-in slide-in-from-top-5 duration-300">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          )}
          <span className="text-xs font-bold text-slate-800">{toast.message}</span>
        </div>
      )}

    </div>
  );
}