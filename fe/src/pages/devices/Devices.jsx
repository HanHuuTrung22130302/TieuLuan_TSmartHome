import { useState, useMemo } from 'react';
import { 
  Cpu, Lightbulb, Filter, Flame, Activity, Thermometer, 
  Mic, AppWindow, DoorClosed, Blinds, Wind, Tv, Bell, Sun, Camera, Radar, ChevronDown 
} from 'lucide-react';

// BỘ TỪ ĐIỂN MAP ICON TỪ CHUỖI SQL SANG COMPONENT LUCIDE
const IconMap = {
  Flame, Activity, Thermometer, Mic, AppWindow, DoorClosed, 
  Blinds, Lightbulb, Wind, Tv, Bell, Sun, Camera, Radar, Cpu
};

// DỮ LIỆU MOCK ĐƯỢC CONVERT TỪ FILE devices.sql CỦA BẠN
const MOCK_DEVICES = [
  { id: 'dac599eb', name: 'Cảm biến Lửa', room: 'Bếp', type: 'safety', status: 'Bật', iconStr: 'Flame' },
  { id: '46a4586a', name: 'PIR Khách/Bếp', room: 'Phòng Khách', type: 'security', status: 'Tắt', iconStr: 'Activity' },
  { id: '85703520', name: 'DHT22 (Nhiệt/Ẩm)', room: 'Phòng Khách', type: 'environment', status: 'Bình thường', iconStr: 'Thermometer' },
  { id: '3f989385', name: 'Cảm biến Âm thanh & Mic', room: 'Phòng Khách', type: 'environment', status: 'Yên tĩnh', iconStr: 'Mic' },
  { id: '4030d658', name: 'Cửa sổ PN3', room: 'Phòng Ngủ 3', type: 'security', status: 'Tắt', iconStr: 'AppWindow' },
  { id: '5de4ae98', name: 'Cửa Ban công 1', room: 'Ban Công 1', type: 'security', status: 'Tắt', iconStr: 'DoorClosed' },
  { id: 'ab2ac091', name: 'Cửa Ban công 2', room: 'Ban Công 2', type: 'security', status: 'Tắt', iconStr: 'DoorClosed' },
  { id: '31818f10', name: 'Cửa chính & Smart Lock', room: 'Cửa chính', type: 'security', status: 'Tắt', iconStr: 'DoorClosed' },
  { id: '848b5c7d', name: 'PIR Hành lang', room: 'Hành Lang', type: 'security', status: 'Bật', iconStr: 'Activity' },
  { id: 'fd2c3fc1', name: 'Lửa PN1', room: 'Phòng Ngủ 1', type: 'safety', status: 'Tắt', iconStr: 'Flame' },
  { id: 'dc377953', name: 'Lửa PN2', room: 'Phòng Ngủ 2', type: 'safety', status: 'Tắt', iconStr: 'Flame' },
  { id: 'f042772a', name: 'Rèm Ban công 1', room: 'Ban Công 1', type: 'appliance', status: 'Tắt', iconStr: 'Blinds' },
  { id: 'a72608c3', name: 'Cửa sổ PN1', room: 'Phòng Ngủ 1', type: 'security', status: 'Tắt', iconStr: 'AppWindow' },
  { id: '39b3c159', name: 'Cửa sổ PN2', room: 'Phòng Ngủ 2', type: 'security', status: 'Tắt', iconStr: 'AppWindow' },
  { id: '83a5181a', name: 'Đèn PN2', room: 'Phòng Ngủ 2', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: '3c15c7e9', name: 'Đèn PN3', room: 'Phòng Ngủ 3', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: 'a173ec87', name: 'Lửa PN3', room: 'Phòng Ngủ 3', type: 'safety', status: 'Bật', iconStr: 'Flame' },
  { id: 'ade0f56b', name: 'Đèn Ban công 1', room: 'Ban Công 1', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: '6ec9e2af', name: 'Đèn bếp', room: 'Bếp', type: 'appliance', status: 'Bật', iconStr: 'Lightbulb' },
  { id: '0f5debb9', name: 'Đèn hành lang', room: 'Hành Lang', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: 'd1a7b0a8', name: 'Đèn Ban công 2', room: 'Ban Công 2', type: 'appliance', status: 'Bật', iconStr: 'Lightbulb' },
  { id: 'd3993ff1', name: 'Radar Phòng Khách', room: 'Phòng Khách', type: 'radar', status: 'Cảnh báo', iconStr: 'Radar' },
  { id: '07f9dbb5', name: 'PIR Cửa chính', room: 'Cửa chính', type: 'security', status: 'Cảnh báo', iconStr: 'Activity' },
  { id: '06368676', name: 'Radar Hành lang', room: 'Hành Lang', type: 'radar', status: 'Cảnh báo', iconStr: 'Radar' },
  { id: '30b029d5', name: 'Đèn WC 1', room: 'WC 1', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: 'd2696994', name: 'Đèn WC 2', room: 'WC 2', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: '5ee15e16', name: 'Đèn trần trước', room: 'Phòng Khách', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: '85ab57a7', name: 'Đèn trần sau', room: 'Phòng Khách', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: 'f657efd1', name: 'Đèn trần P.Khách', room: 'Phòng Khách', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: '10818cf6', name: 'Đèn WC 3', room: 'WC 3', type: 'appliance', status: 'Bật', iconStr: 'Lightbulb' },
  { id: '509f4409', name: 'Đèn phòng ăn', room: 'Phòng Khách', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: '2b1fa08c', name: 'Khí MQ-135', room: 'Bếp', type: 'environment', status: 'Nguy hiểm', iconStr: 'Wind' },
  { id: '2a3b450a', name: 'Cảm biến TV', room: 'Toàn hệ thống', type: 'appliance', status: 'Tắt', iconStr: 'Tv' },
  { id: '275407fa', name: 'Còi Buzzer', room: 'Toàn hệ thống', type: 'safety', status: 'Tắt', iconStr: 'Bell' },
  { id: '00b5447f', name: 'Đèn PN1', room: 'Phòng Ngủ 1', type: 'appliance', status: 'Tắt', iconStr: 'Lightbulb' },
  { id: '440ba046', name: 'Cảm biến Ánh sáng', room: 'Toàn hệ thống', type: 'environment', status: 'Tối', iconStr: 'Sun' },
  { id: 'fae67229', name: 'Camera AI Toàn Cảnh', room: 'Toàn hệ thống', type: 'security', status: 'Bật', iconStr: 'Camera' },
  { id: '3352793e', name: 'Camera ESP32-S3', room: 'Cửa chính', type: 'security', status: 'Bật', iconStr: 'Camera' },
];

export default function Devices() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const uniqueRooms = useMemo(() => {
    return [...new Set(MOCK_DEVICES.map(device => device.room))].sort();
  }, []);

  const filteredDevices = useMemo(() => {
    return MOCK_DEVICES.filter(device => {
      const matchType = typeFilter === 'all' || device.type === typeFilter;
      const matchRoom = roomFilter === 'all' || device.room === roomFilter;
      const matchStatus = statusFilter === 'all' || device.status === statusFilter;
      return matchType && matchRoom && matchStatus;
    });
  }, [typeFilter, roomFilter, statusFilter]);

  const renderDeviceStatus = (status) => {
    if (status === 'Bật' || status === 'Tắt') {
      const isOn = status === 'Bật';
      return (
        <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${isOn ? 'bg-[#e8f5a1] justify-end shadow-[0_0_10px_rgba(232,245,161,0.2)]' : 'bg-slate-700 justify-start'}`}>
          <div className={`w-3.5 h-3.5 rounded-full transition-transform ${isOn ? 'bg-black' : 'bg-slate-400'}`}></div>
        </div>
      );
    }
    
    let badgeColor = 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    if (status === 'Nguy hiểm' || status === 'Cảnh báo') badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    else if (status === 'Bình thường' || status === 'An toàn') badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeColor} uppercase tracking-wider`}>
        {status}
      </span>
    );
  };

  const getIconColor = (type, status) => {
    if (status === 'Nguy hiểm' || status === 'Cảnh báo') return 'text-rose-400 bg-rose-400/10';
    if (status === 'Bật') return 'text-yellow-400 bg-yellow-400/10';
    
    switch(type) {
      case 'appliance': return 'text-blue-400 bg-blue-400/10';
      case 'environment': return 'text-sky-400 bg-sky-400/10';
      case 'security': return 'text-emerald-400 bg-emerald-400/10';
      case 'safety': return 'text-amber-400 bg-amber-400/10';
      case 'radar': return 'text-indigo-400 bg-indigo-400/10';
      default: return 'text-slate-400 bg-white/5';
    }
  };

  // Mảng định nghĩa các Tab Loại thiết bị
  const typeTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'appliance', label: 'Đồ điện & Rèm' },
    { id: 'environment', label: 'Môi trường' },
    { id: 'security', label: 'An ninh' },
    { id: 'safety', label: 'PCCC' },
    { id: 'radar', label: 'Radar' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
      <header className="mb-8">
        
        {/* ================= DÒNG 1: TIÊU ĐỀ ================= */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Cpu className="w-8 h-8 text-blue-500" /> Quản lý thiết bị
            </h2>
            <p className="text-slate-500 mt-2">Đang hiển thị {filteredDevices.length} / {MOCK_DEVICES.length} thiết bị</p>
          </div>
        </div>
        
        {/* ================= DÒNG 2: BỘ LỌC HIỆN ĐẠI ================= */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          
          {/* Tabs cuộn ngang cho Loại thiết bị */}
          <div className="flex bg-white/5 p-1 rounded-2xl overflow-x-auto w-full xl:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {typeTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  typeFilter === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cụm Dropdown cho Phòng và Trạng thái */}
          <div className="flex items-center gap-3 w-full xl:w-auto">
            {/* Lọc theo Phòng */}
            <div className="relative flex-1 xl:flex-none">
              <select 
                value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}
                className="w-full xl:w-48 appearance-none bg-[#121212] border border-white/10 text-slate-200 text-sm font-bold rounded-2xl pl-4 pr-10 py-2.5 outline-none cursor-pointer hover:border-white/20 focus:border-blue-500 transition-colors"
              >
                <option value="all">Mọi Khu vực</option>
                {uniqueRooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {/* Lọc theo Trạng thái */}
            <div className="relative flex-1 xl:flex-none">
              <select 
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full xl:w-48 appearance-none bg-[#121212] border border-white/10 text-slate-200 text-sm font-bold rounded-2xl pl-4 pr-10 py-2.5 outline-none cursor-pointer hover:border-white/20 focus:border-blue-500 transition-colors"
              >
                <option value="all">Mọi Trạng thái</option>
                <option value="Bật">Đang Bật</option>
                <option value="Tắt">Đang Tắt</option>
                <option value="Cảnh báo">Cảnh báo / Nguy hiểm</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

        </div>
      </header>

      {/* DANH SÁCH THIẾT BỊ LƯỚI */}
      {filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDevices.map((device) => {
            const Icon = IconMap[device.iconStr] || Cpu;
            const iconColors = getIconColor(device.type, device.status);
            
            return (
              <div key={device.id} className="bg-[#121212] border border-white/5 p-5 rounded-3xl hover:border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer group flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${iconColors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {renderDeviceStatus(device.status)}
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{device.room}</p>
                  <h4 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1" title={device.name}>
                    {device.name}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State khi Lọc không có kết quả */
        <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl text-slate-500 bg-[#121212]/50">
          <Filter className="w-12 h-12 mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy thiết bị</h3>
          <p className="text-sm">Thử thay đổi bộ lọc để xem kết quả khác.</p>
          <button 
            onClick={() => { setTypeFilter('all'); setRoomFilter('all'); setStatusFilter('all'); }}
            className="mt-6 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

    </div>
  );
}