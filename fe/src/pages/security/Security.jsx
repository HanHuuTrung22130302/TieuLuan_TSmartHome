import { useState } from 'react';
import { 
  ShieldCheck, Lock, Unlock, Camera, Activity, Radar, 
  Video, AlertTriangle, Power, ShieldAlert, Wifi, Maximize, DoorClosed
} from 'lucide-react';

export default function Security() {
  // Trạng thái khóa cửa
  const [isLocked, setIsLocked] = useState(true);
  
  // Trạng thái hệ thống an ninh (Armed / Disarmed)
  const [systemArmed, setSystemArmed] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
      
      {/* ================= HEADER ================= */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShieldCheck className={`w-8 h-8 ${systemArmed ? 'text-emerald-500' : 'text-slate-500'}`} /> 
            Giám sát Bảo mật
          </h2>
          <p className="text-slate-500 mt-2">
            Hệ thống đang được bảo vệ ở mức <strong className={systemArmed ? 'text-emerald-500' : 'text-slate-400'}>{systemArmed ? 'CAO NHẤT' : 'Ngoại tuyến'}</strong>
          </p>
        </div>
      </header>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* === CỘT TRÁI: LIVE CAMERA & CẢM BIẾN (Chiếm 2/3) === */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* MÀN HÌNH CAMERA ESP32-S3 */}
          <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative group h-[400px] md:h-[500px]">
            {/* Hiển thị Stream từ ESP32-S3 Cam 
              Sử dụng thẻ img vì ESP32 thường stream MJPEG
            */}
            <img 
              src="http://171.227.82.185:81/stream" 
              alt="ESP32-S3 Live Stream" 
              className="w-full h-full object-cover bg-black"
              onError={(e) => {
                // Đổi nền nếu camera offline
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Thông báo Mất kết nối (Chỉ hiện khi lỗi thẻ img) */}
            <div className="absolute inset-0 flex-col items-center justify-center bg-slate-900 hidden">
              <Wifi className="w-12 h-12 text-slate-600 mb-4 opacity-50" />
              <p className="text-slate-400 font-bold">Camera đang ngoại tuyến hoặc không thể kết nối.</p>
            </div>

            {/* Lớp phủ Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
            
            {/* UI HUD trên Camera */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                <span className="text-xs font-bold tracking-widest uppercase text-white">LIVE REC</span>
              </div>
              <button className="bg-black/50 backdrop-blur-md p-2.5 rounded-xl border border-white/10 hover:bg-white/20 transition-colors text-white">
                <Maximize className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-6 left-6">
              <h3 className="text-xl font-bold text-white mb-1">Cửa chính (ESP32-S3)</h3>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <Video className="w-3.5 h-3.5" /> 1600x1200 • 30 FPS • MJPEG
              </p>
            </div>
          </div>

          {/* KHU VỰC CẢM BIẾN CHUYỂN ĐỘNG / RADAR */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Radar className="w-5 h-5 text-indigo-400" /> Hệ thống dò tìm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Radar Hành Lang */}
              <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 hover:border-indigo-500/30 transition-colors cursor-pointer group relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl">
                    <Radar className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded uppercase">Phát hiện</span>
                </div>
                <div className="relative z-10">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Radar LD2410</p>
                  <h4 className="text-lg font-bold text-white">Hành Lang</h4>
                  <p className="text-xs font-medium text-amber-400 mt-2 bg-amber-500/10 inline-block px-2 py-1 rounded-md">Vật thể cách 3.2m</p>
                </div>
              </div>

              {/* Radar Phòng Khách */}
              <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 hover:border-indigo-500/30 transition-colors cursor-pointer group relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl">
                    <Radar className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded uppercase">Trống</span>
                </div>
                <div className="relative z-10">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Radar LD2410</p>
                  <h4 className="text-lg font-bold text-white">Phòng Khách</h4>
                  <p className="text-xs font-medium text-slate-500 mt-2">Không có người</p>
                </div>
              </div>

              {/* PIR Cửa Chính */}
              <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 hover:border-rose-500/30 transition-colors cursor-pointer group relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-rose-500/10 rounded-2xl">
                    <Activity className="w-6 h-6 text-rose-400" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded uppercase">Trống</span>
                </div>
                <div className="relative z-10">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">PIR Sensor</p>
                  <h4 className="text-lg font-bold text-white">Cửa Chính</h4>
                  <p className="text-xs font-medium text-slate-500 mt-2">Đang theo dõi...</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: ĐIỀU KHIỂN BẢO MẬT (Chiếm 1/3) === */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* TỔNG QUAN HỆ THỐNG */}
          <div className={`border p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 ${systemArmed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-900 border-white/10'}`}>
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-colors ${systemArmed ? 'bg-emerald-500/20' : 'bg-slate-500/10'}`}></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all shadow-xl ${systemArmed ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-700'}`}>
                {systemArmed ? <ShieldCheck className="w-10 h-10 text-black" /> : <ShieldAlert className="w-10 h-10 text-white" />}
              </div>
              <h3 className={`text-2xl font-black mb-2 ${systemArmed ? 'text-emerald-400' : 'text-slate-300'}`}>
                {systemArmed ? 'ĐÃ KÍCH HOẠT' : 'ĐÃ TẮT BẢO VỆ'}
              </h3>
              <p className="text-sm text-slate-400 px-4">
                {systemArmed 
                  ? 'Còi báo động và thông báo đẩy sẽ tự động kích hoạt nếu phát hiện đột nhập.' 
                  : 'Chế độ bảo vệ đang tắt. Chỉ ghi hình và ghi nhận dữ liệu.'}
              </p>
            </div>

            <div className="relative z-10 mt-2">
              <button 
                onClick={() => setSystemArmed(!systemArmed)}
                className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
                  systemArmed 
                    ? 'bg-black/40 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 border border-transparent' 
                    : 'bg-[#e8f5a1] text-black hover:bg-[#d6e685] shadow-[0_0_15px_rgba(232,245,161,0.2)]'
                }`}
              >
                {systemArmed ? 'Tắt Hệ Thống' : 'Kích hoạt ngay'}
              </button>
            </div>
          </div>

          {/* ĐIỀU KHIỂN CỬA CHÍNH */}
          <div className="bg-[#121212] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl flex flex-col h-full relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <DoorClosed className="w-5 h-5 text-blue-400" /> Smart Lock Cửa chính
            </h3>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 my-8">
              <button 
                onClick={() => setIsLocked(!isLocked)}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-2xl border-4 outline-none ${
                  isLocked 
                    ? 'bg-blue-600 border-blue-500 shadow-blue-600/40 text-white' 
                    : 'bg-rose-500 border-rose-400 shadow-rose-500/40 text-white'
                }`}
              >
                {isLocked ? <Lock className="w-10 h-10" /> : <Unlock className="w-10 h-10 animate-bounce" />}
                <span className="font-bold uppercase tracking-widest text-xs">
                  {isLocked ? 'Đã khóa' : 'Đang mở'}
                </span>
              </button>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-4 mt-auto relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái vật lý</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Cửa đang ĐÓNG</span>
              </div>
              <p className="text-[10px] text-slate-500">Reed Switch xác nhận cánh cửa đã khép kín vào khung.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}