import { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, Lightbulb, Filter, Flame, Activity, Thermometer, 
  Mic, AppWindow, DoorClosed, Blinds, Wind, Tv, Bell, Sun, Camera, Radar, ChevronDown, ShieldCheck
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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms();
        if (res && res.code === 1000) {
          setRooms(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchDeviceList = async () => {
      try {
        const params = {};
        if (typeFilter !== 'all') params.deviceType = typeFilter;
        if (roomFilter !== 'all') params.roomId = roomFilter;
        if (stateFilter !== 'all') params.state = stateFilter === 'true';

        const res = await getDevices(params);
        if (res && res.code === 1000) {
          setDevices(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDeviceList();
  }, [typeFilter, roomFilter, stateFilter]);

  useEffect(() => {
    wsService.connect((rawData) => {
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
      wsService.disconnect();
    };
  }, []);

  const handleDeviceClick = async (device) => {
    if (device.isFake || device.state === null) return; 
    const action = !device.state; 
    try {
      await controlDevice(device.id, action);
    } catch (error) {
      console.error("Lỗi điều khiển thiết bị:", error);
    }
  };

  const renderDeviceStatus = (device) => {
    const isNull = device.state === null;
    const isOn = device.state === true;
    const hasWarning = device.status === 'Nguy hiểm' || device.status === 'Cảnh báo';

    let badgeColor = 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    if (hasWarning) badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    else if (device.status === 'Bình thường' || device.status === 'An toàn' || device.status === 'Yên tĩnh') badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

    return (
      <div className="flex items-center gap-2">
        {(isNull || hasWarning) && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeColor} uppercase tracking-wider`}>
            {device.status || 'Không rõ'}
          </span>
        )}
        
        {!isNull && (
          <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${isOn ? 'bg-[#e8f5a1] justify-end shadow-[0_0_10px_rgba(232,245,161,0.2)]' : 'bg-slate-700 justify-start'}`}>
            <div className={`w-3.5 h-3.5 rounded-full transition-transform ${isOn ? 'bg-black' : 'bg-slate-400'}`}></div>
          </div>
        )}
      </div>
    );
  };

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

  const getIconColor = (device) => {
    if (device.status === 'Nguy hiểm' || device.status === 'Cảnh báo') return 'text-rose-400 bg-rose-400/10';
    if (device.state === true) return 'text-yellow-400 bg-yellow-400/10';
    
    switch(device.deviceType) {
      case 'appliance': return 'text-blue-400 bg-blue-400/10';
      case 'environment': return 'text-sky-400 bg-sky-400/10';
      case 'security': return 'text-emerald-400 bg-emerald-400/10';
      case 'safety': return 'text-amber-400 bg-amber-400/10';
      case 'radar': return 'text-indigo-400 bg-indigo-400/10';
      default: return 'text-slate-400 bg-white/5';
    }
  };

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
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Cpu className="w-8 h-8 text-blue-500" /> Quản lý thiết bị
            </h2>
            <p className="text-slate-500 mt-2">Đang hiển thị {devices.length} thiết bị trong hệ thống</p>
          </div>
        </div>
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
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

          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:flex-none">
              <select 
                value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}
                className="w-full xl:w-48 appearance-none bg-[#121212] border border-white/10 text-slate-200 text-sm font-bold rounded-2xl pl-4 pr-10 py-2.5 outline-none cursor-pointer hover:border-white/20 focus:border-blue-500 transition-colors"
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
                className="w-full xl:w-48 appearance-none bg-[#121212] border border-white/10 text-slate-200 text-sm font-bold rounded-2xl pl-4 pr-10 py-2.5 outline-none cursor-pointer hover:border-white/20 focus:border-blue-500 transition-colors"
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

      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {devices.map((device) => {
            const Icon = getDeviceIcon(device);
            const iconColors = getIconColor(device);
            
            return (
              <div 
                key={device.id} 
                onClick={() => handleDeviceClick(device)}
                className={`bg-[#121212] border border-white/5 p-5 rounded-3xl transition-colors flex flex-col justify-between min-h-[140px] ${
                  device.isFake 
                    ? 'opacity-40 grayscale pointer-events-none' 
                    : device.state === null
                      ? 'hover:border-white/10 hover:bg-white/[0.02]' 
                      : 'hover:border-white/10 hover:bg-white/[0.02] cursor-pointer group'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${iconColors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {renderDeviceStatus(device)}
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{device.roomName || 'Chưa xếp phòng'}</p>
                  <h4 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1" title={device.label || device.name}>
                    {device.label || device.name}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl text-slate-500 bg-[#121212]/50">
          <Filter className="w-12 h-12 mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy thiết bị</h3>
          <p className="text-sm">Thử thay đổi bộ lọc để xem kết quả khác.</p>
          <button 
            onClick={() => { setTypeFilter('all'); setRoomFilter('all'); setStateFilter('all'); }}
            className="mt-6 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}