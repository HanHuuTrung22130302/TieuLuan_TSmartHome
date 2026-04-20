import { useState, useEffect } from 'react';
import { Home, Mail, Lock, User, ArrowRight, Zap, ShieldCheck, CheckCircle2, XCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/api/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // State quản lý Modal Popup (Chỉ dùng cho kết quả API)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // TÁCH RIÊNG DỮ LIỆU ĐĂNG NHẬP VÀ ĐĂNG KÝ
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false });
  const [registerData, setRegisterData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

  // TÁCH RIÊNG TRẠNG THÁI LỖI
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  const toggleForm = (loginState) => {
    setIsLogin(loginState);
    setLoginErrors({});
    setRegisterErrors({});
  };

  // Hàm xử lý nhập liệu Đăng nhập
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (loginErrors[name]) setLoginErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Hàm xử lý nhập liệu Đăng ký
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (registerErrors[name]) setRegisterErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    if (password.length < 6) return "Ít nhất 6 ký tự.";
    if (!/[A-Z]/.test(password)) return "Cần ít nhất 1 chữ hoa.";
    if (!/[0-9]/.test(password)) return "Cần ít nhất 1 chữ số.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Cần ít nhất 1 ký tự đặc biệt.";
    return null; 
  };

  // ==========================================
  // XỬ LÝ SUBMIT: ĐĂNG NHẬP
  // ==========================================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!loginData.email.trim()) errors.email = 'Vui lòng nhập Email';
    else if (!validateEmail(loginData.email)) errors.email = 'Định dạng Email không hợp lệ';

    if (!loginData.password) errors.password = 'Vui lòng nhập Mật khẩu';

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    try {
      const res = await authService.login(loginData);
      if (res.code === 1000) {
        const storage = loginData.rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', res.data.token);
        storage.setItem('refreshToken', res.data.refreshToken);
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.msg || 'Đã có lỗi kết nối đến máy chủ.', 'error');
    }
  };

  // ==========================================
  // XỬ LÝ SUBMIT: ĐĂNG KÝ
  // ==========================================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!registerData.firstName.trim()) errors.firstName = 'Vui lòng nhập Họ';
    if (!registerData.lastName.trim()) errors.lastName = 'Vui lòng nhập Tên';
    
    if (!registerData.email.trim()) errors.email = 'Vui lòng nhập Email';
    else if (!validateEmail(registerData.email)) errors.email = 'Định dạng Email không hợp lệ';

    if (!registerData.password) errors.password = 'Vui lòng nhập Mật khẩu';
    else {
      const pwdErr = validatePassword(registerData.password);
      if (pwdErr) errors.password = pwdErr;
    }

    if (!registerData.confirmPassword) errors.confirmPassword = 'Vui lòng xác nhận lại Mật khẩu';
    else if (registerData.password !== registerData.confirmPassword) errors.confirmPassword = 'Mật khẩu nhập lại không khớp';

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    try {
      const res = await authService.register(registerData);
      if (res.code === 1000) {
        showToast('Đăng ký thành công! Đang chuyển hướng...', 'success');
        setTimeout(() => toggleForm(true), 2000);
      }
    } catch (err) {
      showToast(err.response?.data?.msg || 'Đã có lỗi kết nối đến máy chủ.', 'error');
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientWave { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .bg-fluid-wave { background: linear-gradient(-45deg, #f8fafc, #e0f2fe, #cffafe, #dbeafe, #f0f9ff); background-size: 300% 300%; animation: gradientWave 12s ease-in-out infinite; }
          @keyframes floatSlow { 0% { transform: translateY(0px) translateX(0px) scale(1); } 33% { transform: translateY(-30px) translateX(20px) scale(1.05); } 66% { transform: translateY(15px) translateX(-20px) scale(0.95); } 100% { transform: translateY(0px) translateX(0px) scale(1); } }
          .animate-blob-1 { animation: floatSlow 10s ease-in-out infinite; }
          .animate-blob-2 { animation: floatSlow 14s ease-in-out infinite reverse; }
          .animate-blob-3 { animation: floatSlow 12s ease-in-out infinite 2s; }
          @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes popupZoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .animate-overlay { animation: overlayFadeIn 0.3s ease-out forwards; }
          .animate-popup { animation: popupZoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}
      </style>

      {/* MODAL POPUP (Cho API Error / Success) */}
      {toast.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-overlay p-4">
          <div className="relative flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-2xl animate-popup w-full max-w-sm text-center border border-slate-100">
            <button onClick={() => setToast({...toast, show: false})} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className={`p-4 rounded-full ${toast.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{toast.type === 'success' ? 'Thành công!' : 'Có lỗi xảy ra'}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen w-full flex items-center justify-center font-sans p-4 relative overflow-hidden bg-fluid-wave">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-blue-300/40 rounded-full filter blur-[100px] animate-blob-1 opacity-70" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-cyan-300/40 rounded-full filter blur-[120px] animate-blob-2 opacity-60" />
          <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-sky-200/30 rounded-full filter blur-[100px] animate-blob-3 opacity-50" />
        </div>

        <div className="relative w-full max-w-[1000px] h-[720px] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(14,165,233,0.15)] border border-white/60 flex overflow-hidden z-10">

          {/* =========================================
              BÊN TRÁI: FORM ĐĂNG KÝ
          ========================================= */}
          <div className={`absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col justify-center p-8 lg:px-12 z-10 bg-transparent transition-all duration-700 ${isLogin ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
                <Home className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">TSmartHome</h1>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">Tạo tài khoản</h2>
            <p className="text-slate-500 mb-6 text-sm">Kết nối và tự động hóa ngôi nhà của bạn.</p>

            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${registerErrors.firstName ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                    <input type="text" name="firstName" value={registerData.firstName} onChange={handleRegisterChange} placeholder="Nguyễn" className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${registerErrors.firstName ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'}`} />
                  </div>
                  {registerErrors.firstName && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{registerErrors.firstName}</p>}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên</label>
                  <input type="text" name="lastName" value={registerData.lastName} onChange={handleRegisterChange} placeholder="Văn A" className={`w-full px-4 py-2.5 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${registerErrors.lastName ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'}`} />
                  {registerErrors.lastName && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{registerErrors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail className={`h-5 w-5 ${registerErrors.email ? 'text-red-400' : 'text-slate-400'}`} /></div>
                  <input type="email" name="email" autoComplete="email" value={registerData.email} onChange={handleRegisterChange} placeholder="email@tsmarthome.com" className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${registerErrors.email ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'}`} />
                </div>
                {registerErrors.email && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{registerErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className={`h-5 w-5 ${registerErrors.password ? 'text-red-400' : 'text-slate-400'}`} /></div>
                  <input type="password" name="password" autoComplete="new-password" value={registerData.password} onChange={handleRegisterChange} placeholder="••••••••" className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${registerErrors.password ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'}`} />
                </div>
                {registerErrors.password && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{registerErrors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nhập lại mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><ShieldCheck className={`h-5 w-5 ${registerErrors.confirmPassword ? 'text-red-400' : 'text-slate-400'}`} /></div>
                  <input type="password" name="confirmPassword" autoComplete="new-password" value={registerData.confirmPassword} onChange={handleRegisterChange} placeholder="••••••••" className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${registerErrors.confirmPassword ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'}`} />
                </div>
                {registerErrors.confirmPassword && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{registerErrors.confirmPassword}</p>}
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 mt-4">
                Đăng ký ngay <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="lg:hidden mt-6 text-center text-sm text-slate-600">
              Đã có tài khoản? <button onClick={() => toggleForm(true)} className="text-blue-600 font-bold hover:underline">Đăng nhập</button>
            </div>
          </div>


          {/* =========================================
              BÊN PHẢI: FORM ĐĂNG NHẬP
          ========================================= */}
          <div className={`absolute top-0 right-0 w-full lg:w-1/2 h-full flex flex-col justify-center p-8 lg:px-12 bg-white/95 transition-all duration-700 z-10 ${!isLogin ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
                <Home className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">TSmartHome</h1>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">Mừng bạn trở lại</h2>
            <p className="text-slate-500 mb-8 text-sm">Đăng nhập để điều khiển ngôi nhà của bạn.</p>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail className={`h-5 w-5 ${loginErrors.email ? 'text-red-400' : 'text-slate-400'}`} /></div>
                  <input type="email" name="email" autoComplete="email" value={loginData.email} onChange={handleLoginChange} placeholder="admin@tsmarthome.com" className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${loginErrors.email ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'}`} />
                </div>
                {loginErrors.email && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{loginErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className={`h-5 w-5 ${loginErrors.password ? 'text-red-400' : 'text-slate-400'}`} /></div>
                  <input type="password" name="password" autoComplete="current-password" value={loginData.password} onChange={handleLoginChange} placeholder="••••••••" className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${loginErrors.password ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'}`} />
                </div>
                {loginErrors.password && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{loginErrors.password}</p>}
                
                <div className="flex justify-between items-center mt-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name="rememberMe" checked={loginData.rememberMe} onChange={handleLoginChange} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 outline-none" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Ghi nhớ đăng nhập</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Quên mật khẩu?</Link>
                </div>
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 mt-6">
                Đăng nhập <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="lg:hidden mt-8 text-center text-sm text-slate-600">
              Chưa có tài khoản? <button onClick={() => toggleForm(false)} className="text-blue-600 font-bold hover:underline">Đăng ký ngay</button>
            </div>
          </div>


          {/* =========================================
              SLIDING OVERLAY
          ========================================= */}
          <div className={`hidden lg:block absolute top-0 left-0 w-1/2 h-full z-50 bg-slate-900 transition-transform duration-1000 ease-in-out shadow-2xl ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-cyan-600/40"></div>
              <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob-1"></div>
              <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-400 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob-2"></div>

              <div className={`absolute px-14 text-center text-white transition-all duration-700 delay-100 ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'}`}>
                <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
                <h2 className="text-4xl font-bold mb-6 leading-tight">Chưa có<br/>tài khoản?</h2>
                <p className="text-slate-200 mb-8 text-sm">Bắt đầu hành trình xây dựng hệ thống nhà thông minh của riêng bạn với ESP32 ngay hôm nay.</p>
                <button onClick={() => toggleForm(false)} className="px-10 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-colors">Chuyển sang Đăng ký</button>
              </div>

              <div className={`absolute px-14 text-center text-white transition-all duration-700 delay-100 ${!isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}>
                <Zap className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <h2 className="text-4xl font-bold mb-6 leading-tight">Đã có<br/>tài khoản?</h2>
                <p className="text-slate-200 mb-8 text-sm">Chào mừng bạn quay lại. Hãy đăng nhập để tiếp tục quản lý và giám sát hệ thống của bạn.</p>
                <button onClick={() => toggleForm(true)} className="px-10 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-colors">Chuyển sang Đăng nhập</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}