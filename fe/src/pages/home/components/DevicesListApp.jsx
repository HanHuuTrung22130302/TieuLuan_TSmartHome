import { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, Lightbulb, Filter, Flame, Activity, Thermometer, 
  Mic, AppWindow, DoorClosed, Blinds, Wind, Tv, Bell, Sun, Camera, Radar, ChevronDown, ShieldCheck,
  Zap, MapPin, Search
} from 'lucide-react';
import { getRooms } from '../../../services/api/room';
import { getDevices, controlDevice } from '../../../services/api/device';
import wsService from '../../../services/api/wsService';

export default function DevicesListApp({ onSelectDevice }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  
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

  // WebSocket connection to sync state in real-time
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

  const handleDeviceToggle = async (e, device) => {
    e.stopPropagation(); // prevent opening inspect panel when just clicking toggle
    if (device.isFake || device.state === null) return; 
    const action = !device.state; 
    try {
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, state: action } : d));
      await controlDevice(device.id, action);
    } catch (error) {
      console.error(error);
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, state: device.state } : d));
    }
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

  const filteredDevices = useMemo(() => {
    const result = devices.filter(d => 
      d.label?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Push fake items down
    return result.sort((a, b) => {
      if (a.isFake === b.isFake) return 0;
      return a.isFake ? 1 : -1;
    });
  }, [devices, searchQuery]);

  return (
    <div className="flex flex-col h-full text-white font-sans p-4 gap-4">
      {/* Search and filter header */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm thiết bị..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500" 
          />
        </div>

        <div className="flex gap-2">
          {/* Custom Room Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => { setIsRoomOpen(!isRoomOpen); setIsTypeOpen(false); }}
              className="w-full flex items-center justify-between bg-black/40 hover:bg-black/60 border border-white/5 text-slate-300 text-[10px] font-bold rounded-xl px-3 py-2.5 outline-none cursor-pointer transition-all focus:border-blue-500 text-left"
            >
              <span className="truncate">{roomFilter === 'all' ? 'Khu vực: Tất cả' : (rooms.find(r => r.id === roomFilter)?.name || 'Khu vực: Tất cả')}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${isRoomOpen ? 'rotate-180' : ''}`} />
            </button>
            {isRoomOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsRoomOpen(false)}></div>
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <button
                    onClick={() => { setRoomFilter('all'); setIsRoomOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-white/10 transition-colors cursor-pointer ${roomFilter === 'all' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300'}`}
                  >
                    Khu vực: Tất cả
                  </button>
                  {rooms.map(room => (
                    <button
                      key={room.id}
                      onClick={() => { setRoomFilter(room.id); setIsRoomOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-white/10 transition-colors cursor-pointer ${roomFilter === room.id ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300'}`}
                    >
                      {room.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Custom Type Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => { setIsTypeOpen(!isTypeOpen); setIsRoomOpen(false); }}
              className="w-full flex items-center justify-between bg-black/40 hover:bg-black/60 border border-white/5 text-slate-300 text-[10px] font-bold rounded-xl px-3 py-2.5 outline-none cursor-pointer transition-all focus:border-blue-500 text-left"
            >
              <span className="truncate">
                {typeFilter === 'all' && 'Loại: Tất cả'}
                {typeFilter === 'appliance' && 'Đồ điện & Rèm'}
                {typeFilter === 'environment' && 'Môi trường'}
                {typeFilter === 'security' && 'An ninh'}
                {typeFilter === 'safety' && 'PCCC'}
                {typeFilter === 'radar' && 'Radar'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${isTypeOpen ? 'rotate-180' : ''}`} />
            </button>
            {isTypeOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsTypeOpen(false)}></div>
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1">
                  {[
                    { val: 'all', lbl: 'Loại: Tất cả' },
                    { val: 'appliance', lbl: 'Đồ điện & Rèm' },
                    { val: 'environment', lbl: 'Môi trường' },
                    { val: 'security', lbl: 'An ninh' },
                    { val: 'safety', lbl: 'PCCC' },
                    { val: 'radar', lbl: 'Radar' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => { setTypeFilter(opt.val); setIsTypeOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-white/10 transition-colors cursor-pointer ${typeFilter === opt.val ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300'}`}
                    >
                      {opt.lbl}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Devices list scrollable container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        {filteredDevices.length > 0 ? (
          filteredDevices.map(device => {
            const Icon = getDeviceIcon(device);
            const isNull = device.state === null;
            const isOn = device.state === true;
            const isFake = device.isFake;
            const hasWarning = device.status === 'Nguy hiểm' || device.status === 'Cảnh báo';

            let cardClasses = 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08] cursor-pointer';
            let iconBg = 'bg-white/5 text-slate-400';
            
            if (isFake) {
              cardClasses = 'bg-white/5 border-white/5 opacity-40 grayscale pointer-events-none';
            } else if (hasWarning) {
              cardClasses = 'bg-rose-500/5 border-rose-500/30 hover:border-rose-500/50 cursor-pointer';
              iconBg = 'bg-rose-500/20 text-rose-400';
            } else if (isOn && !isNull) {
              cardClasses = 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer';
              iconBg = 'bg-emerald-500/20 text-emerald-400';
            } else if (isNull && !hasWarning) {
              cardClasses = 'bg-white/5 border-white/5 hover:border-white/10';
              if (device.deviceType === 'environment') iconBg = 'bg-sky-500/10 text-sky-400';
              if (device.deviceType === 'radar') iconBg = 'bg-indigo-500/10 text-indigo-400';
            }

            return (
              <div
                key={device.id}
                onClick={() => onSelectDevice(device)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${cardClasses}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl transition-colors duration-300 shrink-0 ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate leading-tight">{device.label || device.name}</h4>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{device.roomName || 'Chưa xếp phòng'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {(isNull || hasWarning) && (
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                      hasWarning ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}>
                      {device.status || 'Chỉ đọc'}
                    </span>
                  )}
                  
                  {!isNull && (
                    <button
                      onClick={(e) => handleDeviceToggle(e, device)}
                      className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-300 cursor-pointer border border-black/10 ${
                        isOn ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                        isOn ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs">
            <Filter className="w-8 h-8 mb-2 opacity-20" />
            <p>Không tìm thấy thiết bị nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
