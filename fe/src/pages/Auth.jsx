import { useState } from 'react';
import { Home, Mail, Lock, User, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {/* KHAI BÁO ANIMATION CSS TRỰC TIẾP (Không cần config thư viện) */}
      <style>
        {`
          /* Hiệu ứng lướt sóng nền (Fluid Gradient) */
          @keyframes gradientWave {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .bg-fluid-wave {
            background: linear-gradient(-45deg, #f8fafc, #e0f2fe, #cffafe, #dbeafe, #f0f9ff);
            background-size: 300% 300%;
            animation: gradientWave 12s ease-in-out infinite;
          }

          /* Hiệu ứng trôi nổi cho các đốm sáng (Blobs) */
          @keyframes floatSlow {
            0% { transform: translateY(0px) translateX(0px) scale(1); }
            33% { transform: translateY(-30px) translateX(20px) scale(1.05); }
            66% { transform: translateY(15px) translateX(-20px) scale(0.95); }
            100% { transform: translateY(0px) translateX(0px) scale(1); }
          }
          .animate-blob-1 { animation: floatSlow 10s ease-in-out infinite; }
          .animate-blob-2 { animation: floatSlow 14s ease-in-out infinite reverse; }
          .animate-blob-3 { animation: floatSlow 12s ease-in-out infinite 2s; }
        `}
      </style>

      {/* 1. CONTAINER CHA: Nền gradient động (bg-fluid-wave) */}
      <div className="min-h-screen w-full flex items-center justify-center font-sans p-4 relative overflow-hidden bg-fluid-wave">
        
        {/* 2. CÁC HIỆU ỨNG CHIỀU SÂU (Depth & Motion Blobs) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Lưới Grid pattern nhẹ để giữ chất Tech/IoT */}
          <div className="absolute inset-0 opacity-[0.04]" 
               style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          {/* Các khối màu trôi nổi mờ ảo tạo cảm giác lướt sóng */}
          <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-blue-300/40 rounded-full filter blur-[100px] animate-blob-1 opacity-70" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-cyan-300/40 rounded-full filter blur-[120px] animate-blob-2 opacity-60" />
          <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-sky-200/30 rounded-full filter blur-[100px] animate-blob-3 opacity-50" />
        </div>

        {/* 3. KHUNG CHÍNH CHỨA FORM (Thêm hiệu ứng kính - Glassmorphism nhẹ để ăn nhập với nền động) */}
        <div className="relative w-full max-w-[1000px] h-[700px] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(14,165,233,0.15)] border border-white/60 flex overflow-hidden z-10">

          {/* =========================================
              BÊN TRÁI: FORM ĐĂNG KÝ
          ========================================= */}
          <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col justify-center p-8 lg:px-12 z-10 bg-transparent">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
                <Home className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">TSmartHome</h1>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">Tạo tài khoản</h2>
            <p className="text-slate-500 mb-8 text-sm">Kết nối và tự động hóa ngôi nhà của bạn.</p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" placeholder="Nguyễn" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-xl transition-all outline-none" />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên</label>
                  <input type="text" placeholder="Văn A" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-xl transition-all outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" placeholder="email@tsmarthome.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-xl transition-all outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-xl transition-all outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nhập lại mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-xl transition-all outline-none" />
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 mt-4">
                Đăng ký ngay <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="lg:hidden mt-6 text-center text-sm text-slate-600">
              Đã có tài khoản?{' '}
              <button onClick={() => setIsLogin(true)} className="text-blue-600 font-bold hover:underline">Đăng nhập</button>
            </div>
          </div>


          {/* =========================================
              BÊN PHẢI: FORM ĐĂNG NHẬP
          ========================================= */}
          <div className={`absolute top-0 right-0 w-full lg:w-1/2 h-full flex flex-col justify-center p-8 lg:px-12 bg-white/95 transition-all duration-700 z-10 ${!isLogin && 'opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
                <Home className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">TSmartHome</h1>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">Mừng bạn trở lại</h2>
            <p className="text-slate-500 mb-10 text-sm">Đăng nhập để điều khiển ngôi nhà của bạn.</p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" placeholder="admin@tsmarthome.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-xl transition-all outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-xl transition-all outline-none" />
                </div>
                <div className="flex justify-end mt-3">
                 <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Quên mật khẩu?</Link>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 mt-6">
                Đăng nhập <ArrowRight className="w-5 h-5" />
              </button>
            </form>

             <div className="lg:hidden mt-8 text-center text-sm text-slate-600">
              Chưa có tài khoản?{' '}
              <button onClick={() => setIsLogin(false)} className="text-blue-600 font-bold hover:underline">Đăng ký ngay</button>
            </div>
          </div>


          {/* =========================================
              SLIDING OVERLAY
          ========================================= */}
          <div 
            className={`hidden lg:block absolute top-0 left-0 w-1/2 h-full z-50 bg-slate-900 transition-transform duration-1000 ease-in-out shadow-2xl
              ${isLogin ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-cyan-600/40"></div>
              <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob-1"></div>
              <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-400 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob-2"></div>

              <div 
                className={`absolute px-14 text-center text-white transition-all duration-700 delay-100
                  ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'}
                `}
              >
                <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
                <h2 className="text-4xl font-bold mb-6 leading-tight">Chưa có<br/>tài khoản?</h2>
                <p className="text-slate-200 mb-8 text-sm">
                  Bắt đầu hành trình xây dựng hệ thống nhà thông minh của riêng bạn với ESP32 ngay hôm nay.
                </p>
                <button 
                  onClick={() => setIsLogin(false)}
                  className="px-10 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-colors"
                >
                  Chuyển sang Đăng ký
                </button>
              </div>

              <div 
                className={`absolute px-14 text-center text-white transition-all duration-700 delay-100
                  ${!isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}
                `}
              >
                <Zap className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <h2 className="text-4xl font-bold mb-6 leading-tight">Đã có<br/>tài khoản?</h2>
                <p className="text-slate-200 mb-8 text-sm">
                  Chào mừng bạn quay lại. Hãy đăng nhập để tiếp tục quản lý và giám sát hệ thống của bạn.
                </p>
                <button 
                  onClick={() => setIsLogin(true)}
                  className="px-10 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-colors"
                >
                  Chuyển sang Đăng nhập
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}