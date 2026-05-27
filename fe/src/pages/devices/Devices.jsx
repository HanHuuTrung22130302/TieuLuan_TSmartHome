import { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, Lightbulb, Filter, Flame, Activity, Thermometer, 
  Mic, AppWindow, DoorClosed, Blinds, Wind, Tv, Bell, Sun, Camera, Radar, ChevronDown, ShieldCheck,
  Zap, MapPin
} from 'lucide-react';
import { getRooms } from '../../services/api/room';
import { getDevices, controlDevice } from '../../services/api/device';
import wsService from '../../services/api/wsService';

export default function Devices() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);

  // Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms();
        if (res && res.code === 1000) setRooms(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  // Fetch Devices
  useEffect(() => {
    const fetchDeviceList = async () => {
      try {
        const params = {};
        if (typeFilter !== 'all') params.deviceType = typeFilter;
        if (roomFilter !== 'all') params.roomId = roomFilter;
        if (stateFilter !== 'all') params.state = stateFilter === 'true';

        const res = await getDevices(params);
        if (res && res.code === 1000) setDevices(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDeviceList();
  }, [typeFilter, roomFilter, stateFilter]);

  // Áp dụng chuẩn logic kết nối/ngắt kết nối WebSocket của trang
  useEffect(() => {
    const stompClient = wsService.connect((rawData) => {
      setDevices(prevDevices => 
        prevDevices.map(device => {
          if (device.name === rawData.deviceId) {
            return { 
              ...device, 
              state: rawData.state !== undefined ? rawData.state : device.state,
              status: rawData.status !== undefined ? rawData.status : device.status
            };
          }
          return device;
        })
      );
    });

    return () => {
      wsService.disconnect(stompClient);
    };
  }, []);

  // SẮP XẾP THIẾT BỊ: isFake = false lên đầu, isFake = true xuống cuối
  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => {
      if (a.isFake === b.isFake) return 0;
      return a.isFake ? 1 : -1; // Đẩy phần tử true xuống dưới
    });
  }, [devices]);

  // Điều khiển
  const handleDeviceClick = async (device) => {
    if (device.isFake || device.state === null) return; 
    const action = !device.state; 
    try {
      // Optimistic UI Update (Đổi màu ngay lập tức cho mượt, nếu API lỗi sẽ bị đè lại bởi WS)
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, state: action } : d));
      await controlDevice(device.id, action);
    } catch (error) {
      console.error("Lỗi điều khiển thiết bị:", error);
      // Revert nếu lỗi
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, state: device.state } : d));
    }
  };

  // Map Icons
  const getDeviceIcon = (device) => {
    const nameStr = (device.label || device.name || '').toLowerCase();
    const type = device.deviceType;

    if (nameStr.includes('radar')) return Radar;
    if (nameStr.includes('pir') || nameStr.includes('chuyển động')) return Activity;
    if (nameStr.includes('dht') || nameStr.includes('nhiệt') || nameStr.includes('ẩm')) return Thermometer;
    if (nameStr.includes('mq') || nameStr.includes('khí')) return Wind;
    if (nameStr.includes('audio') || nameStr.includes('âm thanh')) return Mic;
    if (nameStr.includes('camera')) return Camera;
    if (nameStr.includes('door') || nameStr.includes('cửa')) return DoorClosed;
    if (nameStr.includes('rèm') || nameStr.includes('blind')) return Blinds;
    if (nameStr.includes('tv')) return Tv;
    if (nameStr.includes('còi') || nameStr.includes('buzzer')) return Bell;
    if (nameStr.includes('sáng') || nameStr.includes('sun')) return Sun;

    if (type === 'safety') return Flame;
    if (type === 'appliance') return Lightbulb;
    if (type === 'environment') return Wind;
    if (type === 'security') return ShieldCheck;

    return Cpu;
  };

  const typeTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'appliance', label: 'Đồ điện & Rèm' },
    { id: 'environment', label: 'Môi trường' },
    { id: 'security', label: 'An ninh' },
    { id: 'safety', label: 'PCCC' },
    { id: 'radar', label: 'Radar' },
  ];

  // Thống kê nhanh số lượng Đang bật
  const activeCount = useMemo(() => devices.filter(d => d.state === true).length, [devices]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      {/* ================= HEADER ================= */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Cpu className="w-8 h-8 text-blue-500" /> Trung tâm Điều khiển
            </h2>
            <p className="text-slate-500 mt-2">Đang giám sát <strong className="text-white">{devices.length}</strong> thiết bị. Có <strong className="text-emerald-400">{activeCount}</strong> module đang hoạt động.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl">
            <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Real-time Sync</span>
          </div>
        </div>
        
        {/* ================= CONTROL PANEL LỌC ================= */}
        <div className="bg-[#121212] border border-white/5 p-3 rounded-[2rem] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shadow-2xl relative overflow-hidden">
          
          {/* Blur effect */}
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex bg-black/40 p-1.5 rounded-2xl overflow-x-auto w-full xl:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 border border-white/5">
            {typeTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  typeFilter === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto relative z-10">
            <div className="relative flex-1 xl:flex-none">
              <select 
                value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}
                className="w-full xl:w-48 appearance-none bg-black/40 border border-white/5 text-slate-200 text-sm font-bold rounded-2xl pl-4 pr-10 py-3 outline-none cursor-pointer hover:border-white/20 focus:border-blue-500 transition-colors"
              >
                <option value="all">Mọi Khu vực</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative flex-1 xl:flex-none">
              <select 
                value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
                className="w-full xl:w-48 appearance-none bg-black/40 border border-white/5 text-slate-200 text-sm font-bold rounded-2xl pl-4 pr-10 py-3 outline-none cursor-pointer hover:border-white/20 focus:border-blue-500 transition-colors"
              >
                <option value="all">Mọi Trạng thái</option>
                <option value="true">Đang Bật</option>
                <option value="false">Đang Tắt</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* ================= LƯỚI THIẾT BỊ (Đã dùng mảng sortedDevices) ================= */}
      {sortedDevices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {sortedDevices.map((device) => {
            const Icon = getDeviceIcon(device);
            const isNull = device.state === null;
            const isOn = device.state === true;
            const isFake = device.isFake;
            const hasWarning = device.status === 'Nguy hiểm' || device.status === 'Cảnh báo';

            // Xử lý Dynamic Style cho từng thẻ Card
            let cardClasses = 'bg-[#121212] border-white/5 hover:border-white/10 hover:bg-white/[0.02] cursor-pointer';
            let iconBg = 'bg-white/5 text-slate-400';
            
            if (isFake) {
              cardClasses = 'bg-[#121212] border-white/5 opacity-40 grayscale pointer-events-none';
            } else if (hasWarning) {
              cardClasses = 'bg-rose-500/5 border-rose-500/30 hover:border-rose-500/50 cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.1)]';
              iconBg = 'bg-rose-500/20 text-rose-400';
            } else if (isOn && !isNull) {
              cardClasses = 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.05)]';
              iconBg = 'bg-emerald-500/20 text-emerald-400';
            } else if (isNull && !hasWarning) {
              cardClasses = 'bg-[#121212] border-white/5 hover:border-white/10 hover:bg-white/[0.02]';
              if (device.deviceType === 'environment') iconBg = 'bg-sky-500/10 text-sky-400';
              if (device.deviceType === 'radar') iconBg = 'bg-indigo-500/10 text-indigo-400';
            }
            
            return (
              <div 
                key={device.id} 
                onClick={() => handleDeviceClick(device)}
                className={`relative border p-6 rounded-[2rem] transition-all duration-300 flex flex-col justify-between min-h-[160px] group overflow-hidden ${cardClasses}`}
              >
                {/* Lớp nền mờ chéo cho thẻ (Tạo độ sâu) */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className={`p-3.5 rounded-2xl transition-colors duration-300 ${iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Khu vực Trạng thái góc phải */}
                  <div className="flex items-center gap-2">
                    {/* Badge Văn bản (Nguy hiểm/Sensor) */}
                    {(isNull || hasWarning) && (
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${
                        hasWarning ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }`}>
                        {device.status || 'Chỉ đọc'}
                      </span>
                    )}
                    
                    {/* Nút Gạt Toggle (Chuẩn iOS) */}
                    {!isNull && (
                      <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${
                        isOn ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                          isOn ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{device.roomName || 'Chưa xếp phòng'}</p>
                  </div>
                  <h4 className="text-lg font-bold text-white transition-colors line-clamp-1" title={device.label || device.name}>
                    {device.label || device.name}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] text-slate-500 bg-[#121212]/50 shadow-inner">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Filter className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy thiết bị</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-sm text-center">Các bộ lọc hiện tại của bạn không khớp với bất kỳ module nào trong hệ thống.</p>
          <button 
            onClick={() => { setTypeFilter('all'); setRoomFilter('all'); setStateFilter('all'); }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-900/20"
          >
            Xóa toàn bộ bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}