import { useState } from 'react';
import { Home, Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      
      {/* Cột trái: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* Logo & Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/30">
              <Home className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">TSmartHome</h1>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isLogin ? 'Mừng bạn trở lại' : 'Bắt đầu sử dụng'}
          </h2>
          <p className="text-slate-500 mb-8 text-sm">
            {isLogin 
              ? 'Đăng nhập để tiếp tục điều khiển ngôi nhà của bạn.' 
              : 'Tạo tài khoản để kết nối và quản lý các thiết bị IoT.'}
          </p>

          {/* Form Inputs */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Field: Họ Tên (Chỉ hiện khi Đăng ký) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
            )}

            {/* Field: Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                  placeholder="admin@tsmarthome.com"
                />
              </div>
            </div>

            {/* Field: Mật khẩu */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Quên mật khẩu?
                  </button>
                </div>
              )}
            </div>

            {/* Nút Submit */}
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/30 mt-6">
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Nút chuyển đổi Trạng thái */}
          <div className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-bold hover:underline transition-all"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>

      {/* Cột phải: Banner hình ảnh (Ẩn trên mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        {/* Lớp phủ gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
        
        {/* Vòng tròn hiệu ứng */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>

        <div className="relative z-20 text-center text-white px-12">
          <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-4xl font-bold mb-6">Điều khiển vạn vật<br/>trong tầm tay</h2>
          <p className="text-slate-300 text-lg max-w-md mx-auto">
            Hệ thống IoT tích hợp ESP32 và Web Application. Giám sát môi trường và tự động hóa ngôi nhà của bạn theo thời gian thực.
          </p>
        </div>
      </div>
      
    </div>
  );
}