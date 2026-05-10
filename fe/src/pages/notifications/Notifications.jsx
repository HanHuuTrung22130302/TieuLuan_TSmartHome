import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function Notifications() {
  const notifs = [
    { type: 'alert', title: 'Phát hiện chuyển động lạ', time: '10 phút trước', desc: 'Camera Cửa chính phát hiện có người lạ xuất hiện.', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { type: 'info', title: 'Nhiệt độ phòng khách cao', time: '1 giờ trước', desc: 'Nhiệt độ vượt mức 30°C. Đã tự động bật quạt điều hòa.', icon: Info, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { type: 'success', title: 'Đã hoàn tất dọn dẹp', time: 'Hôm qua', desc: 'Robot hút bụi đã hoàn thành lịch trình dọn dẹp phòng ngủ.', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500">
      <header className="mb-8 border-b border-white/5 pb-6">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bell className="w-8 h-8 text-yellow-500" /> Trung tâm thông báo
        </h2>
      </header>

      <div className="max-w-3xl space-y-4">
        {notifs.map((n, idx) => (
          <div key={idx} className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex gap-4 hover:bg-white/5 transition-colors cursor-pointer">
            <div className={`p-3 rounded-xl h-fit ${n.bg}`}>
              <n.icon className={`w-6 h-6 ${n.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-white text-lg">{n.title}</h4>
                <span className="text-xs font-medium text-slate-500">{n.time}</span>
              </div>
              <p className="text-slate-400 text-sm">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}