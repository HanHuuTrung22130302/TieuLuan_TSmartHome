import { useState, useEffect } from 'react';
import { 
  User, Send, RefreshCw, Check, Trash2, Edit2, Lock, Key, ShieldCheck, Clock, X, Settings
} from 'lucide-react';
import { getUserProfile, updateUserProfile, generateTelegramCode, disconnectTelegram } from '../../../services/api/profile';

export default function SettingsApp() {
  const [profileTab, setProfileTab] = useState('profile');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
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

  useEffect(() => {
    fetchProfile();
  }, []);

  // Countdown timer hook for code expiry
  useEffect(() => {
    if (telegramCodeTimer <= 0) return;
    const interval = setInterval(() => {
      setTelegramCodeTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [telegramCodeTimer]);

  // Polling for Telegram link status
  useEffect(() => {
    let intervalId = null;
    if (profileTab === 'telegram' && telegramLinkCode && telegramCodeTimer > 0 && !profileForm.telegramChatId) {
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
            showToast('success', 'Kết nối Telegram thành công!');
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra kết nối Telegram:", error);
        }
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [profileTab, telegramLinkCode, telegramCodeTimer, profileForm.telegramChatId]);

  const showToast = (type, message) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const getDisplayAvatar = (url) => {
    if (!url) return "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(url)}`;
  };

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
          telegramUsername: res.data.telegramUsername || '',
          createdAt: res.data.createdAt
        });
        
        // Sync back to local storage
        const fullName = `${res.data.lastName} ${res.data.firstName}`.trim();
        const displayAvatar = getDisplayAvatar(res.data.avatarUrl);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('avatarUrl', displayAvatar);
        window.dispatchEvent(new CustomEvent('tsmarthome_profile_updated'));
      }
    } catch (err) {
      console.error("Lỗi khi tải hồ sơ người dùng:", err);
      showToast('error', 'Tải hồ sơ người dùng thất bại.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('error', 'Vui lòng điền đầy đủ các trường!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'Mật khẩu mới không trùng khớp!');
      return;
    }
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      showToast('success', 'Đổi mật khẩu thành công!');
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
        const expiresTime = new Date(res.data.expiresAt).getTime();
        const nowTime = new Date().getTime();
        const remainingSecs = Math.max(0, Math.floor((expiresTime - nowTime) / 1000));
        setTelegramCodeTimer(remainingSecs > 0 ? remainingSecs : 600);
        showToast('success', 'Đã tạo mã liên kết thành công!');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Tạo mã liên kết thất bại!');
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
        showToast('success', 'Hủy kết nối Telegram thành công!');
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Hủy kết nối thất bại!');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSyncTelegram = async () => {
    setSavingProfile(true);
    try {
      await fetchProfile();
      showToast('success', 'Đã đồng bộ thông tin kết nối!');
    } catch (err) {
      showToast('error', 'Đồng bộ thất bại!');
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
        showToast('success', 'Cập nhật hồ sơ thành công!');
        const fullName = `${res.data.lastName} ${res.data.firstName}`.trim();
        const displayAvatar = getDisplayAvatar(res.data.avatarUrl);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('avatarUrl', displayAvatar);
        window.dispatchEvent(new CustomEvent('tsmarthome_profile_updated'));
        setIsEditingProfile(false);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      showToast('error', err.response?.data?.msg || 'Cập nhật hồ sơ thất bại!');
    } finally {
      setSavingProfile(false);
    }
  };

  const formatCodeTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa rõ';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full text-slate-800 font-sans relative overflow-hidden bg-slate-50">
      
      {/* Settings internal Toast */}
      {toast.show && (
        <div className="absolute top-3 right-3 z-50 flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-top-3 duration-300">
          <span className="text-xs font-bold text-slate-700">{toast.message}</span>
        </div>
      )}

      {/* Internal Navigation Sidebar */}
      <div className="w-full md:w-52 border-r border-[#E2E8F0] bg-white p-3.5 flex flex-col justify-between shrink-0">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              setProfileTab('profile');
              setIsEditingProfile(false);
              setIsChangingPassword(false);
            }}
            className={`w-full relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all text-left cursor-pointer ${
              profileTab === 'profile' ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {profileTab === 'profile' && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-[#2563EB] rounded-r"></span>}
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
            className={`w-full relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all text-left cursor-pointer ${
              profileTab === 'telegram' ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {profileTab === 'telegram' && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-[#2563EB] rounded-r"></span>}
            <Send className={`w-4 h-4 ${profileTab === 'telegram' ? 'text-[#2563EB]' : 'text-slate-400'}`} />
            Tích hợp Telegram
          </button>
        </div>

        <div className="hidden md:block bg-slate-50 border border-slate-100 p-3 rounded-xl text-[9px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Trạng thái Bot</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${profileForm.telegramChatId ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="font-bold text-slate-700">{profileForm.telegramChatId ? 'Telegram Hoạt động' : 'Chưa liên kết'}</span>
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 bg-[#F8FAFC] p-6 overflow-y-auto min-h-0">
        {loadingProfile ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="w-7 h-7 text-[#2563EB] animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Đang tải hồ sơ...</p>
          </div>
        ) : (
          <div className="h-full text-slate-700">
            
            {/* PROFILE DETAILS TAB */}
            {profileTab === 'profile' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {!isEditingProfile && !isChangingPassword ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200/80 shadow bg-slate-50 shrink-0">
                        <img src={getDisplayAvatar(profileForm.avatarUrl)} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <h4 className="mt-2 text-sm font-bold text-slate-800">{`${profileForm.lastName} ${profileForm.firstName}`}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{profileForm.email}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Họ và tên</span>
                        <span className="font-bold text-slate-800 mt-0.5">{`${profileForm.lastName} ${profileForm.firstName}`.trim() || 'Chưa đặt'}</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Số điện thoại</span>
                        <span className="font-bold text-slate-800 mt-0.5">{profileForm.phoneNumber || 'Chưa đặt'}</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Khu vực / Quốc gia</span>
                        <span className="font-bold text-slate-800 mt-0.5">{profileForm.region || 'Việt Nam'}</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Ngày đăng ký</span>
                        <span className="font-bold text-slate-800 mt-0.5">{formatDate(profileForm.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                      <button onClick={() => setIsEditingProfile(true)} className="px-4 py-2 bg-white hover:bg-slate-50 text-[#2563EB] font-bold text-[10px] uppercase tracking-wider rounded-xl border border-[#2563EB] shadow-sm cursor-pointer transition-colors">
                        <Edit2 className="w-3.5 h-3.5 inline mr-1" /> Sửa thông tin
                      </button>
                      <button onClick={() => setIsChangingPassword(true)} className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-colors">
                        <Lock className="w-3.5 h-3.5 inline mr-1" /> Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                ) : isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Họ</label>
                          <input type="text" value={profileForm.lastName} onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2563EB] focus:bg-white" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tên</label>
                          <input type="text" value={profileForm.firstName} onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2563EB] focus:bg-white" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Số điện thoại</label>
                          <input type="text" value={profileForm.phoneNumber} onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2563EB] focus:bg-white" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Khu vực</label>
                          <input type="text" value={profileForm.region} onChange={(e) => setProfileForm({...profileForm, region: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2563EB] focus:bg-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avatar Seed / URL</label>
                        <input type="text" value={profileForm.avatarUrl} onChange={(e) => setProfileForm({...profileForm, avatarUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2563EB] focus:bg-white" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">Hủy</button>
                      <button type="submit" disabled={savingProfile} className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1 cursor-pointer">
                        {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Lưu
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3.5">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mật khẩu cũ</label>
                        <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2563EB] focus:bg-white" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mật khẩu mới</label>
                        <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2563EB] focus:bg-white" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Xác nhận mật khẩu</label>
                        <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2563EB] focus:bg-white" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setIsChangingPassword(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">Hủy</button>
                      <button type="submit" disabled={savingProfile} className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1 cursor-pointer">
                        {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                        Đổi
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TELEGRAM BOT INTEGRATION TAB */}
            {profileTab === 'telegram' && (
              <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#29B6F6] shrink-0" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.89 1.2-5.33 3.52-.5.35-.96.52-1.37.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.87-1.69 6.45-2.8 7.74-3.35 3.69-1.57 4.45-1.84 4.95-1.85.11 0 .36.03.52.16.14.11.18.26.19.37 0 .07.01.21 0 .33z" />
                  </svg>
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h4 className="font-bold text-slate-800">Cấu hình Telegram Bot cảnh báo</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Bot: @MYTSMARTHOME_BOT</p>
                    {profileForm.telegramChatId ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 mt-2">
                        <Check className="w-3 h-3" /> Đã liên kết tài khoản
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 mt-2">
                        Chưa liên kết
                      </span>
                    )}
                  </div>
                </div>

                {!profileForm.telegramChatId ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
                    {telegramLinkCode ? (
                      <div className="space-y-3.5">
                        <div className="text-center py-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Mã kết nối của bạn</p>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xl font-mono font-black text-slate-800 tracking-wider bg-white border border-slate-200 px-3.5 py-1 rounded-xl shadow-sm">
                              {telegramLinkCode}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`/link {telegramLinkCode}`);
                                showToast('success', 'Đã sao chép lệnh!');
                              }}
                              className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 cursor-pointer"
                              title="Sao chép"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Mã hết hạn trong: <strong className="text-rose-500 font-mono font-bold">{formatCodeTimer(telegramCodeTimer)}</strong>
                          </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-slate-600 leading-normal">
                          <p className="font-bold text-slate-800 mb-1">Hướng dẫn nhanh:</p>
                          <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                            <li>Nhấp <a href={`https://t.me/MYTSMARTHOME_BOT?start=${telegramLinkCode}`} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">Mở Telegram Bot</a>.</li>
                            <li>Gửi tin nhắn: <code className="bg-white border px-1 py-0.5 rounded font-mono">/start {telegramLinkCode}</code>.</li>
                            <li>Web sẽ tự động cập nhật trạng thái khi liên kết thành công.</li>
                          </ol>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setTelegramLinkCode(null); setTelegramCodeTimer(0); }} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 cursor-pointer">Hủy bỏ</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-slate-500 leading-relaxed text-[11px]">
                          Tích hợp Telegram Bot giúp nhận ngay thông báo cảnh báo khẩn cấp từ hệ thống PCCC, rò rỉ gas, đột nhập trực tiếp trên ứng dụng Telegram di động.
                        </p>
                        <button type="button" onClick={handleGenerateTelegramCode} disabled={isGeneratingCode} className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer">
                          {isGeneratingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                          Tạo mã liên kết Bot
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex gap-2">
                    <button type="button" onClick={handleSyncTelegram} disabled={savingProfile} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold flex items-center gap-1 cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" /> Đồng bộ
                    </button>
                    <button type="button" onClick={handleDisconnectTelegram} disabled={savingProfile} className="px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold flex items-center gap-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" /> Hủy liên kết
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
