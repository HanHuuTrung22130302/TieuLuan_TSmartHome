import { ShieldCheck, Lock, Camera, Activity, Unlock } from 'lucide-react';

export default function Security() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-500" /> Giám sát Bảo mật
        </h2>
        <p className="text-slate-500 mt-2">Hệ thống đang được bảo vệ ở mức cao nhất</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-400">An Toàn</h3>
            <p className="text-sm text-emerald-400/70">Không có rủi ro</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/5 rounded-2xl"><Lock className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Cửa chính</p>
              <h4 className="text-lg font-bold">Đã Khóa</h4>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20">Mở</button>
        </div>

        <div className="bg-[#121212] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/5 rounded-2xl"><Camera className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Camera AI</p>
              <h4 className="text-lg font-bold text-emerald-400">Đang ghi hình</h4>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}