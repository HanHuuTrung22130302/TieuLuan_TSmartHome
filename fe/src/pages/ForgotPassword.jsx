import { useState, useEffect } from 'react';
import { Home, Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, KeyRound, CheckCircle, Shield, CheckCircle2, XCircle, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import authService from '../services/api/auth';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  
  // Trạng thái Loading để chặn spam click
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    otpCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBack = () => {
    if (step > 1 && step < 4 && !isLoading) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    if (password.length < 6) return "Ít nhất 6 ký tự.";
    if (!/[A-Z]/.test(password)) return "Cần ít nhất 1 chữ hoa.";
    if (!/[0-9]/.test(password)) return "Cần ít nhất 1 chữ số.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Cần ít nhất 1 ký tự đặc biệt.";
    return null; 
  };

  // =========================================
  // GIAI ĐOẠN 1: GỬI EMAIL LẤY OTP
  // =========================================
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setErrors({ email: 'Vui lòng nhập Email' });
      return;
    } else if (!validateEmail(formData.email)) {
      setErrors({ email: 'Định dạng Email không hợp lệ' });
      return;
    }

    setIsLoading(true); // BẬT LOADING
    try {
      const res = await authService.forgotPassword(formData.email);
      if (res.code === 1000) {
        showToast(res.msg, 'success');
        setStep(2);
      }
    } catch (err) {
      showToast(err.response?.data?.msg || 'Không thể gửi mã OTP', 'error');
    } finally {
      setIsLoading(false); // TẮT LOADING
    }
  };

  // =========================================
  // GIAI ĐOẠN 2: XÁC MINH OTP
  // =========================================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otpCode.trim() || formData.otpCode.length < 6) {
      setErrors({ otpCode: 'Vui lòng nhập đủ 6 số OTP' });
      return;
    }

    setIsLoading(true); // BẬT LOADING
    try {
      const res = await authService.verifyOtp({
        email: formData.email,
        otpCode: formData.otpCode
      });
      if (res.code === 1000) {
        showToast(res.msg, 'success');
        setStep(3);
      }
    } catch (err) {
      showToast(err.response?.data?.msg || 'Mã OTP không hợp lệ', 'error');
      setErrors({ otpCode: 'Mã không hợp lệ' });
    } finally {
      setIsLoading(false); // TẮT LOADING
    }
  };

  // Hàm phụ: Gửi lại mã OTP
  const handleResendOTP = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(formData.email);
      if (res.code === 1000) showToast('Đã gửi lại mã OTP mới!', 'success');
    } catch (err) {
      showToast('Không thể gửi lại mã', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================
  // GIAI ĐOẠN 3: ĐẶT LẠI MẬT KHẨU
  // =========================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else {
      const pwdErr = validatePassword(formData.newPassword);
      if (pwdErr) newErrors.newPassword = pwdErr;
    }

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true); // BẬT LOADING
    try {
      const res = await authService.resetPassword({
        email: formData.email,
        otpCode: formData.otpCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      if (res.code === 1000) {
        setStep(4);
      }
    } catch (err) {
      showToast(err.response?.data?.msg || 'Không thể đặt lại mật khẩu', 'error');
    } finally {
      setIsLoading(false); // TẮT LOADING
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

      {/* MODAL POPUP THÔNG BÁO LỖI/THÀNH CÔNG */}
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

      {/* CONTAINER CHA */}
      <div className="min-h-screen w-full flex items-center justify-center font-sans p-4 relative overflow-hidden bg-fluid-wave">
        
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-blue-300/40 rounded-full filter blur-[100px] animate-blob-1 opacity-70" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-cyan-300/40 rounded-full filter blur-[120px] animate-blob-2 opacity-60" />
          <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-sky-200/30 rounded-full filter blur-[100px] animate-blob-3 opacity-50" />
        </div>

        <div className="relative w-full max-w-[1000px] h-[700px] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(14,165,233,0.15)] border border-white/60 flex overflow-hidden z-10">

          <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col justify-center p-8 lg:px-12 z-10 bg-transparent">
            
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
                  <Home className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">TSmartHome</h1>
              </div>
              
              {step > 1 && step < 4 && (
                <button 
                  onClick={handleBack} 
                  disabled={isLoading}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isLoading ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* BƯỚC 1: NHẬP EMAIL */}
              {step === 1 && (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Quên mật khẩu?</h2>
                  <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    Đừng lo lắng! Hãy nhập email liên kết với tài khoản của bạn. Chúng tôi sẽ gửi một mã xác nhận để giúp bạn khôi phục quyền truy cập.
                  </p>

                  <form className="space-y-6" onSubmit={handleSendOTP}>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email của bạn</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                        </div>
                        <input 
                          type="email" 
                          name="email"
                          disabled={isLoading}
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="admin@tsmarthome.com" 
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${errors.email ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'} ${isLoading && 'opacity-70 cursor-not-allowed'}`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{errors.email}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg ${isLoading ? 'bg-blue-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}`}
                    >
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</>
                      ) : (
                        <>Gửi mã xác nhận <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* BƯỚC 2: NHẬP OTP */}
              {step === 2 && (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Xác thực OTP</h2>
                  <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    Chúng tôi vừa gửi một mã gồm 6 chữ số đến email <br/>
                    <span className="font-semibold text-blue-600">{formData.email}</span>. Vui lòng kiểm tra hộp thư.
                  </p>

                  <form className="space-y-6" onSubmit={handleVerifyOTP}>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã bảo mật</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <KeyRound className={`h-5 w-5 ${errors.otpCode ? 'text-red-400' : 'text-slate-400'}`} />
                        </div>
                        <input 
                          type="text" 
                          name="otpCode"
                          maxLength="6"
                          disabled={isLoading}
                          value={formData.otpCode}
                          onChange={handleChange}
                          placeholder="••••••" 
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl transition-all outline-none text-center text-xl tracking-[0.5em] font-bold focus:bg-white ${errors.otpCode ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'} ${isLoading && 'opacity-70 cursor-not-allowed'}`}
                        />
                      </div>
                      {errors.otpCode && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1 text-center">{errors.otpCode}</p>}
                      
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <span className="text-slate-500">Chưa nhận được mã?</span>
                        <button 
                          type="button" 
                          onClick={handleResendOTP} 
                          disabled={isLoading}
                          className={`font-semibold transition-colors ${isLoading ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}
                        >
                          {isLoading ? 'Đang gửi...' : 'Gửi lại mã'}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg ${isLoading ? 'bg-blue-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}`}
                    >
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Đang kiểm tra...</>
                      ) : (
                        <>Xác nhận mã <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* BƯỚC 3: MẬT KHẨU MỚI */}
              {step === 3 && (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Tạo mật khẩu mới</h2>
                  <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    Mật khẩu mới của bạn phải khác với các mật khẩu đã sử dụng trước đây để đảm bảo an toàn.
                  </p>

                  <form className="space-y-5" onSubmit={handleResetPassword}>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu mới</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className={`h-5 w-5 ${errors.newPassword ? 'text-red-400' : 'text-slate-400'}`} />
                        </div>
                        <input type="password" name="newPassword" disabled={isLoading} value={formData.newPassword} onChange={handleChange} placeholder="••••••••" className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${errors.newPassword ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'} ${isLoading && 'opacity-70 cursor-not-allowed'}`} />
                      </div>
                      {errors.newPassword && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{errors.newPassword}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nhập lại mật khẩu mới</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <ShieldCheck className={`h-5 w-5 ${errors.confirmPassword ? 'text-red-400' : 'text-slate-400'}`} />
                        </div>
                        <input type="password" name="confirmPassword" disabled={isLoading} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 rounded-xl transition-all outline-none focus:bg-white ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-transparent focus:border-blue-600'} ${isLoading && 'opacity-70 cursor-not-allowed'}`} />
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{errors.confirmPassword}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg mt-4 ${isLoading ? 'bg-blue-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}`}
                    >
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Đang lưu...</>
                      ) : (
                        <>Lưu mật khẩu mới <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* BƯỚC 4: THÀNH CÔNG */}
              {step === 4 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 shadow-inner">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Khôi phục thành công!</h2>
                  <p className="text-slate-500 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                    Mật khẩu của bạn đã được cập nhật. Ngay bây giờ, bạn có thể sử dụng mật khẩu mới để đăng nhập vào hệ thống.
                  </p>
                  
                  <Link to="/" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/30">
                    Quay lại Đăng nhập
                  </Link>
                </div>
              )}

            </div>

            {step === 1 && (
              <div className="lg:hidden mt-8 text-center text-sm text-slate-600">
                Nhớ ra mật khẩu?{' '}
                <Link to="/" className="text-blue-600 font-bold hover:underline">Quay lại Đăng nhập</Link>
              </div>
            )}
          </div>

          <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full z-0 bg-slate-900 overflow-hidden shadow-2xl">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-cyan-600/40"></div>
              <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob-1"></div>
              <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-400 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob-2"></div>

              <div className="absolute px-14 text-center text-white z-10">
                <Shield className="w-20 h-20 mx-auto mb-8 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                <h2 className="text-4xl font-bold mb-6 leading-tight">Bảo mật tuyệt đối<br/>cho ngôi nhà bạn</h2>
                <p className="text-slate-200 mb-8 text-sm max-w-sm mx-auto">
                  Quy trình khôi phục mật khẩu mã hóa đa lớp đảm bảo chỉ có bạn mới có quyền can thiệp vào hệ thống IoT TSmartHome.
                </p>
                
                {step === 1 && (
                  <div className="mt-12">
                    <p className="text-slate-300 text-sm mb-4">Bạn đã nhớ ra mật khẩu?</p>
                    <Link to="/" className="inline-block px-10 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-colors">
                      Quay lại Đăng nhập
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}