import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import {
  Thermometer, Camera, DoorClosed, Activity, Flame,
  Lightbulb, Shield, Wind, Map, Maximize, ZoomIn, ZoomOut,
  Mic, AppWindow, Tv, Sun, Bell, Blinds, History, Clock,
  MousePointer2, Droplets, Radar, Video, Wifi, RefreshCw, Power, AlertTriangle, CheckCircle2, Cpu
} from 'lucide-react';

import { getMapDevices, getCameraStreams } from '../../services/api/map';
import { controlDevice, getDeviceHistory, getDeviceAlerts } from '../../services/api/device';
import wsService from '../../services/api/wsService';

// ================= CẤU HÌNH LƯỚI 3D CHUẨN THEO VỊ TRÍ 3 SENSOR TRUNG TÂM =================
// - Mic nằm ở Z: 4.79 làm mốc kết thúc Hàng 1
// - PIR Khách/Bếp nằm ở Z: 3.18 làm mốc phân định giữa Hàng 1 và Hàng 2
// - MQ-135 nằm ở X: -0.77, Z: 1.14 làm mốc căn biên trái cho khối bếp
const RADAR_BLOCKS_3D = [
  // Hàng 1 (livingroom_sensor_radar) -> rowOffset = 0 (Bao quanh khu vực Mic Z: 4.79)
  { id: 5, position: [-3.2, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 4, position: [-2.0, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 3, position: [-0.8, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 2, position: [0.4, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 1, position: [1.6, 0.02, 4.3], args: [1.2, 0.9] },

  // Hàng 2 (livingroom_sensor_radar2) -> rowOffset = 5 (Trục xoay quanh PIR Khách/Bếp Z: 3.18)
  { id: 10, position: [-3.2, 0.02, 3.18], args: [1.2, 1.1] },
  { id: 9, position: [-2.0, 0.02, 3.18], args: [1.2, 1.1] },
  { id: 8, position: [-0.8, 0.02, 3.18], args: [1.2, 1.1] }, // Trùng trục X của MQ-135 và sát PIR
  { id: 7, position: [0.4, 0.02, 3.18], args: [1.2, 1.1] },
  { id: 6, position: [1.6, 0.02, 3.18], args: [1.2, 1.1] },

  // Hàng 3 (livingroom_sensor_radar3) -> rowOffset = 10 (Trục tiến về phía bếp MQ-135 Z: 1.14)
  { id: 15, position: [-3.2, 0.02, 1.5], args: [1.2, 1.4] },
  { id: 14, position: [-2.0, 0.02, 1.5], args: [1.2, 1.4] },
  { id: 13, position: [-0.8, 0.02, 1.5], args: [1.2, 1.4] }, // Đè vị trí chất lượng không khí bếp
  { id: 12, position: [0.4, 0.02, 1.5], args: [1.2, 1.4] },
  { id: 11, position: [1.6, 0.02, 1.5], args: [1.2, 1.4] },
];

const HALLWAY_RADAR_BLOCKS_3D = [
  { id: 'hallway_1', position: [0.14, 0.02, -2.28], args: [1.2, 1.8] },
  { id: 'hallway_2', position: [0.06, 0.02, -1.25], args: [1.4, 1.8] }
];

const getBlockIdFromRadar = (radarName, distanceStr, valueStr) => {
  const d = parseFloat(distanceStr || valueStr);
  if (isNaN(d)) return null;

  if (radarName === 'hallway_sensor_radar') {
    if (d > 0 && d < 4) return 'hallway_1';
    if (d > 4 && d < 8) return 'hallway_2';
    return null;
  }

  const blockMatch = valueStr?.match(/Block (\d+)/i);
  if (blockMatch) return parseInt(blockMatch[1]);

  let rowOffset = 0;
  if (radarName === 'livingroom_sensor_radar') rowOffset = 0;
  else if (radarName === 'livingroom_sensor_radar2') rowOffset = 5;
  else if (radarName === 'livingroom_sensor_radar3') rowOffset = 10;
  else return null;

  let col = 0;
  if (d > 14.0) return null;
  else if (d < 14.0 && d >= 11.5) col = 1;
  else if (d < 11.5 && d >= 9.0) col = 2;
  else if (d < 9.0 && d >= 6.0) col = 3;
  else if (d < 6.0 && d >= 3.0) col = 4;
  else if (d < 3.0 && d >= 0.0) col = 5;
  else return null;

  return rowOffset + col;
};

function HouseModel() {
  const { scene } = useGLTF('/web.glb');
  return <primitive object={scene} />;
}

export default function SmartHomeMap3D() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [mapDevices, setMapDevices] = useState([]);
  const [cameras, setCameras] = useState([]);

  // State Panel điều khiển
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [activeCameraId, setActiveCameraId] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [cameraKey, setCameraKey] = useState(Date.now());

  // State Dữ liệu Tab & Filter Lịch sử
  const [timeFilter, setTimeFilter] = useState('1D');
  const [dataFilter, setDataFilter] = useState('history');
  const [deviceHistory, setDeviceHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [deviceAlerts, setDeviceAlerts] = useState([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  // States Quản lý Đám mây Radar Targets
  const [radarTargets, setRadarTargets] = useState({});
  const radarTimersRef = useRef({});

  const showRadarTarget = (radarName, blockId) => {
    if (!radarName || !blockId) return;
    if (radarTimersRef.current[radarName]) clearTimeout(radarTimersRef.current[radarName]);
    setRadarTargets(prev => ({ ...prev, [radarName]: blockId }));

    radarTimersRef.current[radarName] = setTimeout(() => {
      setRadarTargets(prev => { const next = { ...prev }; delete next[radarName]; return next; });
      delete radarTimersRef.current[radarName];
    }, 3000);
  };

  const clearRadarTarget = (radarName) => {
    if (!radarName) return;
    if (radarTimersRef.current[radarName]) {
      clearTimeout(radarTimersRef.current[radarName]);
      delete radarTimersRef.current[radarName];
    }
    setRadarTargets(prev => { const next = { ...prev }; delete next[radarName]; return next; });
  };

  // Fetch API Ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mapRes, camRes] = await Promise.all([getMapDevices(), getCameraStreams()]);
        if (mapRes && mapRes.code === 1000) {
          setMapDevices(mapRes.data.filter(d => d.pos3dX !== null && d.pos3dY !== null));
        }
        if (camRes && camRes.code === 1000) {
          setCameras(camRes.data);
          if (camRes.data.length > 0) setActiveCameraId(camRes.data[0].deviceId);
        }
      } catch (error) { console.error("Lỗi API 3D:", error); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(radarTimersRef.current).forEach(timer => clearTimeout(timer));
      radarTimersRef.current = {};
    };
  }, []);

  // Đồng bộ WebSocket
  useEffect(() => {
    const stompClient = wsService.connect((rawData) => {
      const { deviceId, status, value, distance } = rawData;
      setMapDevices(prev =>
        prev.map(d => {
          if (d.name === deviceId) {
            const updatedDevice = {
              ...d,
              state: rawData.state !== undefined ? rawData.state : d.state,
              status: status !== undefined ? status : d.status
            };

            if (selectedSensor && selectedSensor.id === updatedDevice.id) {
              setSelectedSensor(updatedDevice);
            }

            if (updatedDevice.deviceType === 'radar') {
              const blockId = getBlockIdFromRadar(updatedDevice.name, distance, value);
              if ((status === 'Cảnh báo' || status === 'Phát hiện') && blockId) {
                showRadarTarget(updatedDevice.name, blockId);
              } else {
                clearRadarTarget(updatedDevice.name);
              }
            }
            return updatedDevice;
          }
          return d;
        })
      );
    });
    return () => wsService.disconnect(stompClient);
  }, [selectedSensor]);

  // AJAX Fetch Lịch sử/Cảnh báo dựa trên Tab điều khiển
  useEffect(() => {
    if (selectedSensor && !selectedSensor.isFake) {
      if (dataFilter === 'history') fetchHistory(selectedSensor.id, timeFilter);
      else if (dataFilter === 'alert') fetchAlerts(selectedSensor.id, timeFilter);
    }
  }, [selectedSensor?.id, dataFilter, timeFilter]);

  const fetchHistory = async (deviceId, filterObj) => {
    setIsLoadingHistory(true);
    try {
      const queryParam = filterObj === '3D' ? '3d' : '';
      const res = await getDeviceHistory(deviceId, queryParam);
      if (res && res.code === 1000) setDeviceHistory(res.data);
    } catch { setDeviceHistory([]); } finally { setIsLoadingHistory(false); }
  };

  const fetchAlerts = async (deviceId, filterObj) => {
    setIsLoadingAlerts(true);
    try {
      const queryParam = filterObj === '3D' ? '3d' : '';
      const res = await getDeviceAlerts(deviceId, queryParam);
      if (res && res.code === 1000) setDeviceAlerts(res.data);
    } catch { setDeviceAlerts([]); } finally { setIsLoadingAlerts(false); }
  };

  const handleTabClick = (tabId) => setDataFilter(tabId);

  const handleToggleSwitch = async () => {
    if (!selectedSensor || selectedSensor.isFake || selectedSensor.state === null) return;
    const action = !selectedSensor.state;
    try {
      setMapDevices(prev => prev.map(d => d.id === selectedSensor.id ? { ...d, state: action } : d));
      setSelectedSensor(prev => ({ ...prev, state: action }));
      await controlDevice(selectedSensor.id, action);
      if (dataFilter === 'history') fetchHistory(selectedSensor.id, timeFilter);
    } catch {
      setMapDevices(prev => prev.map(d => d.id === selectedSensor.id ? { ...d, state: !action } : d));
      setSelectedSensor(prev => ({ ...prev, state: !action }));
    }
  };

  const handleMarkerClick = (sensor) => {
    setSelectedSensor(sensor);
    if (!sensor.isFake) {
      const isEnvOrSafety = sensor.deviceType === 'environment' || sensor.deviceType === 'safety';
      if (isHistoryOnlyDevice(sensor)) setDataFilter('history');
      else setDataFilter(isEnvOrSafety ? 'alert' : 'history');
    }
    if (cameras.some(c => c.deviceId === sensor.id)) {
      setActiveCameraId(sensor.id);
      setCameraError(false);
      setCameraKey(Date.now());
    }
  };

  const isHistoryOnlyDevice = (device) => {
    if (!device) return false;
    const name = (device.name || '').toLowerCase();
    const label = (device.label || '').toLowerCase();
    return (device.deviceType === 'appliance' || name.includes('light') || name.includes('curtain') || label.includes('đèn') || label.includes('rèm'));
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} - ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const getTypeColor = (device) => {
    if (device.isFake) return 'bg-slate-800/40 text-slate-500 border-slate-700/50';

    switch (device.deviceType) {
      case 'environment': return 'bg-sky-500 shadow-sky-500/50 border-white/60';
      case 'security': return 'bg-rose-500 shadow-rose-500/50 border-white/60';
      case 'safety': return 'bg-amber-500 shadow-amber-500/50 border-white/60';
      case 'appliance': return 'bg-violet-500 shadow-violet-500/50 border-white/60';
      case 'radar': return 'bg-indigo-500 shadow-indigo-500/50 border-white/60';
      default: return 'bg-slate-500 shadow-slate-500/50 border-white/60';
    }
  };

  const getDeviceIcon = (device) => {
    const nameStr = (device.label || device.name || '').toLowerCase();
    const type = device.deviceType;
    if (nameStr.includes('radar')) return Radar; if (nameStr.includes('pir') || nameStr.includes('chuyển động')) return Activity;
    if (nameStr.includes('dht') || nameStr.includes('nhiệt') || nameStr.includes('ẩm')) return Thermometer; if (nameStr.includes('mq') || nameStr.includes('khí')) return Wind;
    if (nameStr.includes('audio') || nameStr.includes('âm thanh')) return Mic; if (nameStr.includes('camera')) return Camera;
    if (nameStr.includes('door') || nameStr.includes('cửa')) return DoorClosed; if (nameStr.includes('rèm') || nameStr.includes('blind')) return Blinds;
    if (nameStr.includes('tv')) return Tv; if (nameStr.includes('còi') || nameStr.includes('buzzer')) return Bell;
    if (nameStr.includes('sáng') || nameStr.includes('sun')) return Sun; if (nameStr.includes('window') || nameStr.includes('sổ')) return AppWindow;
    if (type === 'safety') return Flame; if (type === 'appliance') return Lightbulb; if (type === 'environment') return Wind; return Cpu;
  };

  const filteredSensors = mapDevices.filter(s => activeFilter === 'all' || s.deviceType === activeFilter);
  const activeCameraObj = cameras.find(c => c.deviceId === activeCameraId);
  const activeCameraMeta = mapDevices.find(d => d.id === activeCameraId);
  const hasToggleSwitch = selectedSensor && selectedSensor.state !== null && selectedSensor.deviceType !== 'environment';
  const isDeviceOn = selectedSensor && selectedSensor.state === true;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">

      {/* HUD THÔNG SỐ MÔI TRƯỜNG CHUNG */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-4 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2.5 px-6 rounded-full flex items-center gap-3 shadow-2xl">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <div className="flex items-baseline gap-1"><p className="text-sm font-black text-white leading-none">25</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">°C</p></div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2.5 px-6 rounded-full flex items-center gap-3 shadow-2xl">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div className="flex items-baseline gap-1"><p className="text-sm font-black text-white leading-none">55</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">%</p></div>
        </div>
      </div>

      {/* KHU VỰC TRÁI: TABS BỘ LỌC */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-4 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-white text-sm font-bold tracking-wide uppercase">Digital Twin 3D</span>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col gap-1 w-44">
          {[{ id: 'all', label: 'Tất cả thiết bị' }, { id: 'security', label: 'An ninh' }, { id: 'environment', label: 'Môi trường' }, { id: 'appliance', label: 'Đồ điện / Rèm' }, { id: 'safety', label: 'PCCC' }, { id: 'radar', label: 'Radar' }].map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-left ${activeFilter === f.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* KHU VỰC PHẢI: SIDEBAR ĐIỀU KHIỂN */}
      <aside className="absolute top-6 right-6 bottom-6 w-[380px] z-30 flex flex-col gap-4 animate-in slide-in-from-right duration-700 pointer-events-auto">
        {/* CAMERA SCREEN */}
        {activeCameraId && (
          <div className="shrink-0 h-56 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            {!cameraError && activeCameraObj?.streamUrl ? (
              <img key={cameraKey} src={activeCameraObj.streamUrl} alt="Camera" className="w-full h-full object-cover bg-black scale-105" onError={() => setCameraError(true)} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
                <Wifi className="w-10 h-10 text-slate-600 mb-3 opacity-50" />
                <p className="text-slate-400 text-xs font-bold mb-4">Camera ngoại tuyến.</p>
                <button onClick={() => { setCameraError(false); setCameraKey(Date.now()); }} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg"><RefreshCw className="w-3 h-3 inline mr-1" /> Reload</button>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/10"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div><span className="text-[10px] font-bold text-white tracking-widest uppercase">LIVE</span></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8"><h3 className="text-sm font-bold text-white mb-0.5">{activeCameraMeta?.label || 'Camera'}</h3><p className="text-[10px] text-slate-400 font-mono"><Video className="w-3 h-3 inline mr-1" />{activeCameraMeta?.roomName || 'Hệ thống'}</p></div>
          </div>
        )}

        {!selectedSensor ? (
          <div className="flex-1 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10"><MousePointer2 className="w-8 h-8 text-blue-500 animate-bounce" /></div>
            <h3 className="text-xl font-black text-white mb-3">Chưa chọn thiết bị</h3><p className="text-slate-400 text-sm leading-relaxed">Click vào một module trên bản đồ 3D để xem thông tin.</p>
          </div>
        ) : selectedSensor.isFake ? (
          <div className="flex-1 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className={`p-4 rounded-3xl ${getTypeColor(selectedSensor)} shadow-xl mb-6`}>{(() => { const DynIcon = getDeviceIcon(selectedSensor); return <DynIcon className="w-8 h-8 text-white" />; })()}</div>
            <h3 className="text-xl font-black text-white leading-tight mb-2 truncate px-4">{selectedSensor.label || selectedSensor.name}</h3>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-tighter mb-8"><Map className="w-3.5 h-3.5 text-blue-500" /> {selectedSensor.roomName}</div>
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10"><Clock className="w-8 h-8 text-amber-500 opacity-80" /></div>
            <h3 className="text-4xl font-black text-white tracking-widest mb-3 opacity-20">COMING<br />SOON</h3>
          </div>
        ) : (
          <>
            {/* PANEL TRÊN: THÔNG TIN RÚT GỌN THIẾT BỊ THẬT */}
            <div className="shrink-0 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-3xl ${getTypeColor(selectedSensor)} shadow-xl`}>{(() => { const DynIcon = getDeviceIcon(selectedSensor); return <DynIcon className="w-8 h-8 text-white" />; })()}</div>
                  <div><span className="text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider text-blue-400 border-blue-400/30 bg-blue-400/10">LIVE DEVICE</span>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-tighter mt-1.5"><Map className="w-3.5 h-3.5 text-blue-500" /> {selectedSensor.roomName}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white leading-tight truncate pr-4">{selectedSensor.label || selectedSensor.name}</h3>
                {hasToggleSwitch && (
                  <button onClick={handleToggleSwitch} className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 border border-black/20 ${isDeviceOn ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isDeviceOn ? 'translate-x-6' : ''}`}></div></button>
                )}
              </div>
            </div>

            {/* PANEL DƯỚI: DATA BÁO CÁO AJAX */}
            <div className="flex-1 min-h-0 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-4 shrink-0"><h4 className="text-white font-bold text-lg flex items-center gap-2"><History className="w-5 h-5 text-blue-400" /> Dữ liệu & Báo cáo</h4></div>
              <div className="flex flex-col gap-3 mb-6 shrink-0">
                <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
                  {isHistoryOnlyDevice(selectedSensor) ? (
                    <button onClick={() => handleTabClick('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'history' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Clock className="w-3.5 h-3.5" /> Lịch sử HĐ</button>
                  ) : (selectedSensor.deviceType === 'environment' || selectedSensor.deviceType === 'safety') ? (
                    <button onClick={() => handleTabClick('alert')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'alert' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Bell className="w-3.5 h-3.5" /> Lịch sử Cảnh báo</button>
                  ) : (
                    <>
                      <button onClick={() => handleTabClick('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'history' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Clock className="w-3.5 h-3.5" /> Lịch sử HĐ</button>
                      <button onClick={() => handleTabClick('alert')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'alert' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Bell className="w-3.5 h-3.5" /> Cảnh báo</button>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {['1D', '3D'].map(t => <button key={t} onClick={() => setTimeFilter(t)} className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-colors ${timeFilter === t ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/5 bg-transparent text-slate-500 hover:border-white/20'}`}>{t === '1D' ? 'Hôm nay' : '3 Ngày'}</button>)}
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {dataFilter === 'history' ? (
                  isLoadingHistory ? <div className="text-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto" /></div> : deviceHistory.length > 0 ? (
                    <div className="space-y-2 pr-1">
                      {deviceHistory.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5"><div className={`p-2 rounded-xl shrink-0 ${item.state ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}><Power className="w-4 h-4" /></div><div className="flex-1"><p className="text-sm font-bold text-white leading-tight">{item.action}</p><p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{formatTime(item.createdAt)}</p></div></div>
                      ))}
                    </div>
                  ) : <div className="text-center py-8 text-sm text-slate-500">Không có lịch sử hoạt động</div>
                ) : (
                  isLoadingAlerts ? <div className="text-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto" /></div> : deviceAlerts.length > 0 ? (
                    <div className="space-y-2 pr-1">
                      {deviceAlerts.map(item => {
                        const isDanger = item.status === 'Nguy hiểm' || item.status === 'Cảnh báo';
                        return (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5"><div className={`p-2 rounded-xl shrink-0 ${isDanger ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>{isDanger ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}</div><div className="flex-1 min-w-0"><p className="text-sm font-bold text-white leading-tight truncate">{item.value}</p><p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{formatTime(item.createdAt)}</p></div></div>
                        )
                      })}
                    </div>
                  ) : <div className="text-center py-8 text-sm text-slate-500">Hệ thống an toàn</div>
                )}
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ================= CANVAS MÔ HÌNH 3D NẰM Ở LỚP DƯỚI ================= */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Environment preset="city" />
          <Suspense fallback={<Html center><div className="text-white font-bold animate-pulse">Đang tải mô hình...</div></Html>}>
            <group scale={1.3} rotation={[0, Math.PI, 0]} position={[0, 0, 0]}>
              <HouseModel />

              {/* LƯỚI 15 Ô QUÉT RADAR PHÒNG KHÁCH KHÔNG GIAN 3D */}
              {RADAR_BLOCKS_3D.map(block => {
                const isActive = Object.values(radarTargets).includes(block.id);
                return (
                  <mesh key={`block-3d-${block.id}`} position={block.position} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={block.args} />
                    <meshBasicMaterial color={isActive ? "#f43f5e" : "#6366f1"} transparent opacity={isActive ? 0.4 : 0.02} depthWrite={false} />
                  </mesh>
                )
              })}

              {/* LƯỚI 2 Ô QUÉT RADAR HÀNH LANG KHÔNG GIAN 3D */}
              {HALLWAY_RADAR_BLOCKS_3D.map(block => {
                const isActive = Object.values(radarTargets).includes(block.id);
                return (
                  <mesh key={`block-hw-3d-${block.id}`} position={block.position} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={block.args} />
                    <meshBasicMaterial color={isActive ? "#f43f5e" : "#6366f1"} transparent opacity={isActive ? 0.4 : 0.02} depthWrite={false} />
                  </mesh>
                )
              })}

              {/* RENDER CÁC ĐIỂM MARKERS TRONG KHÔNG GIAN 3D */}
              {filteredSensors.map((sensor) => {
                const MarkerIcon = getDeviceIcon(sensor);
                const isSelected = selectedSensor?.id === sensor.id;
                const hasWarning = sensor.status === 'Nguy hiểm' || sensor.status === 'Cảnh báo';
                const colorClass = getTypeColor(sensor);

                return (
                  <Html key={sensor.id} position={[sensor.pos3dX, sensor.pos3dY || 1.2, sensor.pos3dZ]} center zIndexRange={[100, 0]}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMarkerClick(sensor); }}
                      className={`relative group cursor-pointer transition-all duration-300 outline-none ${sensor.isFake ? 'opacity-50 grayscale hover:grayscale-0' : 'hover:scale-150'} ${isSelected ? 'scale-150 z-20' : ''}`}
                    >
                      {hasWarning && !sensor.isFake && (
                        <div className="absolute inset-0 rounded-full animate-ping opacity-60 bg-rose-500"></div>
                      )}

                      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white shadow-xl border-2 transition-all ${isSelected ? 'border-white ring-4 ring-white/30' : ''} ${hasWarning && !sensor.isFake ? 'bg-rose-600 border-white/60' : colorClass}`}>
                        <MarkerIcon className="w-4 h-4 drop-shadow-md" />
                      </div>

                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900/95 backdrop-blur text-white text-xs font-bold rounded-lg transition-opacity whitespace-nowrap border border-slate-700 shadow-2xl pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {sensor.label || sensor.name}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-t border-l border-slate-700 rotate-45"></div>
                      </div>
                    </button>
                  </Html>
                );
              })}
            </group>
            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
          </Suspense>
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} maxDistance={40} />
        </Canvas>
      </div>
    </div>
  );
}