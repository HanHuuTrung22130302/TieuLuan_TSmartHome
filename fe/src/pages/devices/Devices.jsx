import { Cpu, Lightbulb, Fan, Tv, Plus, Filter } from 'lucide-react';

export default function Devices() {
  const mockDevices = [
    { name: 'Đèn trần P.Khách', room: 'Phòng Khách', status: 'Bật', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { name: 'Điều hòa Daikin', room: 'Phòng Ngủ 1', status: 'Tắt', icon: Fan, color: 'text-sky-400', bg: 'bg-sky-400/10' },
    { name: 'Smart TV Samsung', room: 'Phòng Khách', status: 'Bật', icon: Tv, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Đèn Bếp', room: 'Bếp', status: 'Tắt', icon: Lightbulb, color: 'text-slate-400', bg: 'bg-white/5' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Cpu className="w-8 h-8 text-blue-500" /> Quản lý thiết bị
          </h2>
          <p className="text-slate-500 mt-2">Theo dõi và điều khiển toàn bộ 40 thiết bị trong nhà</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" /> Lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#e8f5a1] text-black font-bold rounded-xl hover:bg-[#d6e685] transition-colors">
            <Plus className="w-4 h-4" /> Thêm thiết bị
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockDevices.map((device, idx) => (
          <div key={idx} className="bg-[#121212] border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${device.bg}`}>
                <device.icon className={`w-6 h-6 ${device.color}`} />
              </div>
              <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${device.status === 'Bật' ? 'bg-[#e8f5a1] justify-end' : 'bg-slate-700 justify-start'}`}>
                <div className={`w-3.5 h-3.5 rounded-full ${device.status === 'Bật' ? 'bg-black' : 'bg-slate-400'}`}></div>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{device.room}</p>
              <h4 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{device.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}