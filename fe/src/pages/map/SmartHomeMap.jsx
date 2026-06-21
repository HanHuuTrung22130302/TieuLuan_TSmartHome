import { useState, useEffect, useRef } from 'react';
import {
  Thermometer, Camera, DoorClosed, Activity, Flame,
  Lightbulb, Shield, Wind, Map, Maximize, ZoomIn, ZoomOut,
  Mic, AppWindow, Tv, Sun, Bell, Blinds, History, Clock,
  MousePointer2, Droplets, Radar, Video, Wifi, RefreshCw, Power, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { getMapDevices, getCameraStreams } from '../../services/api/map';
import { controlDevice, getDeviceHistory, getDeviceAlerts } from '../../services/api/device';
import wsService from '../../services/api/wsService';

// ================= CẤU HÌNH 15 BLOCK RADAR KHÁCH & 2 BLOCK HÀNH LANG (Tính theo %) =================
const RADAR_BLOCKS = [
  // Hàng 1 (Radar 1) - Y: 60.62 -> 70.17
  { id: 1, left: 35.40, top: 79.72, width: 5.95, height: 9.55 },
  { id: 2, left: 41.35, top: 79.72, width: 5.95, height: 9.55 },
  { id: 3, left: 47.27, top: 76.55, width: 5.56, height: 11.26 },
  { id: 4, left: 52.83, top: 76.55, width: 5.56, height: 11.26 },
  { id: 5, left: 58.39, top: 76.55, width: 5.69, height: 11.26 },

  // Hàng 2 (Radar 2) - Y: 70.17 -> 79.72
  { id: 6, left: 35.40, top: 70.17, width: 5.95, height: 9.55 },
  { id: 7, left: 41.35, top: 70.17, width: 5.95, height: 9.55 },
  { id: 8, left: 47.27, top: 65.29, width: 5.56, height: 11.26 },
  { id: 9, left: 52.83, top: 65.29, width: 5.56, height: 11.26 },
  { id: 10, left: 58.39, top: 65.29, width: 5.69, height: 11.26 },

  // Hàng 3 (Radar 3) - Y: 79.72 -> 89.28
  { id: 11, left: 35.40, top: 60.62, width: 5.95, height: 9.55 },
  { id: 12, left: 41.35, top: 60.62, width: 5.95, height: 9.55 },
  { id: 13, left: 47.27, top: 54.03, width: 5.56, height: 11.26 },
  { id: 14, left: 52.83, top: 54.03, width: 5.56, height: 11.26 },
  { id: 15, left: 58.39, top: 54.03, width: 5.69, height: 11.26 },
];

const HALLWAY_RADAR_BLOCKS = [
  { id: 'hallway_1', label: 'H1', left: 48.78, top: 22.56, width: 4.25, height: 12.57, clipPath: 'polygon(20.94% 96.10%, 92.00% 100%, 100% 0%, 0% 1.99%)' },
  { id: 'hallway_2', label: 'H2', left: 44.25, top: 35.74, width: 7.00, height: 15.85, clipPath: 'polygon(0% 0.76%, 6.86% 100%, 87.29% 98.49%, 100% 0%)' }
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

export default function SmartHomeMap() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [mapDevices, setMapDevices] = useState([]);
  const [cameras, setCameras] = useState([]);

  // State Panel điều khiển
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [activeCameraId, setActiveCameraId] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [cameraKey, setCameraKey] = useState(Date.now());

  // State Dữ liệu Tab & Filter
  const [timeFilter, setTimeFilter] = useState('1D');
  const [dataFilter, setDataFilter] = useState('history');

  const [deviceHistory, setDeviceHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [deviceAlerts, setDeviceAlerts] = useState([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  // States Radar Targets
  const [radarTargets, setRadarTargets] = useState({});
  const radarTimersRef = useRef({});

  const showRadarTarget = (radarName, blockId) => {
    if (!radarName || !blockId) return;
    if (radarTimersRef.current[radarName]) clearTimeout(radarTimersRef.current[radarName]);

    setRadarTargets(prev => ({ ...prev, [radarName]: blockId }));

    radarTimersRef.current[radarName] = setTimeout(() => {
      setRadarTargets(prev => {
        const next = { ...prev };
        delete next[radarName];
        return next;
      });
      delete radarTimersRef.current[radarName];
    }, 3000);
  };

  const clearRadarTarget = (radarName) => {
    if (!radarName) return;
    if (radarTimersRef.current[radarName]) {
      clearTimeout(radarTimersRef.current[radarName]);
      delete radarTimersRef.current[radarName];
    }
    setRadarTargets(prev => {
      const next = { ...prev };
      delete next[radarName];
      return next;
    });
  };

  // Fetch Dữ liệu Thiết bị từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mapRes, camRes] = await Promise.all([
          getMapDevices(),
          getCameraStreams()
        ]);

        if (mapRes && mapRes.code === 1000) {
          const valid2DDevices = mapRes.data.filter(d => d.pos2dX !== null && d.pos2dY !== null);
          setMapDevices(valid2DDevices);
        }

        if (camRes && camRes.code === 1000) {
          setCameras(camRes.data);
          if (camRes.data.length > 0) {
            setActiveCameraId(camRes.data[0].deviceId);
          }
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu map:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(radarTimersRef.current).forEach(timer => clearTimeout(timer));
      radarTimersRef.current = {};
    };
  }, []);

  // Lắng nghe WebSocket đồng bộ trạng thái
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

    return () => {
      wsService.disconnect(stompClient);
    };
  }, [selectedSensor]);

  // Lắng nghe thay đổi ID thiết bị để gọi API lịch sử tương ứng
  useEffect(() => {
    if (selectedSensor && !selectedSensor.isFake) {
      if (dataFilter === 'history') {
        fetchHistory(selectedSensor.id, timeFilter);
      } else if (dataFilter === 'alert') {
        fetchAlerts(selectedSensor.id, timeFilter);
      }
    }
  }, [selectedSensor?.id, dataFilter, timeFilter]);

  const fetchHistory = async (deviceId, filterObj) => {
    setIsLoadingHistory(true);
    try {
      const queryParam = filterObj === '3D' ? '3d' : '';
      const res = await getDeviceHistory(deviceId, queryParam);
      if (res && res.code === 1000) setDeviceHistory(res.data);
    } catch {
      setDeviceHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchAlerts = async (deviceId, filterObj) => {
    setIsLoadingAlerts(true);
    try {
      const queryParam = filterObj === '3D' ? '3d' : '';
      const res = await getDeviceAlerts(deviceId, queryParam);
      if (res && res.code === 1000) setDeviceAlerts(res.data);
    } catch {
      setDeviceAlerts([]);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const handleTabClick = (tabId) => {
    setDataFilter(tabId);
  };

  const filteredSensors = mapDevices.filter(s => activeFilter === 'all' || s.deviceType === activeFilter);

  const isHistoryOnlyDevice = (device) => {
    if (!device) return false;
    const name = (device.name || '').toLowerCase();
    const label = (device.label || '').toLowerCase();
    return (
      device.deviceType === 'appliance' ||
      name.includes('light') ||
      name.includes('curtain') ||
      label.includes('đèn') ||
      label.includes('rèm')
    );
  };

  const handleDeviceClick = (e, sensor) => {
    e.stopPropagation();
    setSelectedSensor(sensor);

    if (!sensor.isFake) {
      const isEnvOrSafety = sensor.deviceType === 'environment' || sensor.deviceType === 'safety';
      if (isHistoryOnlyDevice(sensor)) {
        setDataFilter('history');
      } else {
        setDataFilter(isEnvOrSafety ? 'alert' : 'history');
      }
    }

    if (cameras.some(c => c.deviceId === sensor.id)) {
      setActiveCameraId(sensor.id);
      setCameraError(false);
      setCameraKey(Date.now());
    }
  };

  const handleToggleSwitch = async () => {
    if (!selectedSensor || selectedSensor.isFake || selectedSensor.state === null) return;

    const action = !selectedSensor.state;
    try {
      setMapDevices(prev => prev.map(d => d.id === selectedSensor.id ? { ...d, state: action } : d));
      setSelectedSensor(prev => ({ ...prev, state: action }));

      await controlDevice(selectedSensor.id, action);

      if (dataFilter === 'history') {
        fetchHistory(selectedSensor.id, timeFilter);
      }
    } catch (error) {
      console.error("Lỗi điều khiển map:", error);
      setMapDevices(prev => prev.map(d => d.id === selectedSensor.id ? { ...d, state: !action } : d));
      setSelectedSensor(prev => ({ ...prev, state: !action }));
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    const day = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    return `${time} - ${day}`;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'environment': return 'bg-sky-500 shadow-sky-500/50';
      case 'security': return 'bg-rose-500 shadow-rose-500/50';
      case 'safety': return 'bg-amber-500 shadow-amber-500/50';
      case 'appliance': return 'bg-violet-500 shadow-violet-500/50';
      case 'radar': return 'bg-indigo-500 shadow-indigo-500/50';
      default: return 'bg-slate-500 shadow-slate-500/50';
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
    if (nameStr.includes('window') || nameStr.includes('sổ')) return AppWindow;

    if (type === 'safety') return Flame;
    if (type === 'appliance') return Lightbulb;
    if (type === 'environment') return Wind;
    return Cpu;
  };

  const activeCameraObj = cameras.find(c => c.deviceId === activeCameraId);
  const activeCameraMeta = mapDevices.find(d => d.id === activeCameraId);

  const hasToggleSwitch = selectedSensor && selectedSensor.state !== null && selectedSensor.deviceType !== 'environment';
  const isDeviceOn = selectedSensor && selectedSensor.state === true;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">

      {/* KHUNG HUD */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-4 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2.5 px-6 rounded-full flex items-center gap-3 shadow-2xl">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <div className="flex items-baseline gap-1">
            <p className="text-sm font-black text-white leading-none">25</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">°C</p>
          </div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2.5 px-6 rounded-full flex items-center gap-3 shadow-2xl">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div className="flex items-baseline gap-1">
            <p className="text-sm font-black text-white leading-none">55</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">%</p>
          </div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2.5 px-6 rounded-full flex items-center gap-3 shadow-2xl">
          <Wind className="w-4 h-4 text-emerald-400" />
          <div className="flex items-baseline gap-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AQI</p>
            <p className="text-sm font-black text-emerald-400 leading-none">TỐT</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{ backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      {/* BẢN ĐỒ 2D */}
      <div className="absolute inset-0 z-10">
        <TransformWrapper centerOnInit={false} initialScale={1} initialPositionX={-50} initialPositionY={50} minScale={0.3} maxScale={5} wheel={{ step: 0.001, smoothStep: 1 }} pinch={{ step: 1 }} limitToBounds={false}>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute bottom-8 left-[40%] -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
                <button onClick={() => zoomOut()} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><ZoomOut className="w-5 h-5" /></button>
                <button onClick={() => resetTransform()} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><Maximize className="w-5 h-5" /></button>
                <button onClick={() => zoomIn()} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><ZoomIn className="w-5 h-5" /></button>
              </div>

              <TransformComponent wrapperClass="!w-screen !h-screen" contentClass="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                <div className="relative inline-block max-w-[90vw] max-h-[90vh]">
                  <img src="/apartment_map.png" alt="Bản đồ căn hộ" className="max-w-full max-h-[90vh] w-auto h-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] pointer-events-none" />

                  {/* KHUNG LƯỚI 15 BLOCK CỦA RADAR PHÒNG KHÁCH & 2 BLOCK HÀNH LANG */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    {RADAR_BLOCKS.map(block => {
                      const isActive = Object.values(radarTargets).includes(block.id);
                      return (
                        <div
                          key={`block-${block.id}`}
                          className={`absolute border transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-rose-500/40 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] z-20 backdrop-blur-[1px]' : 'bg-indigo-500/5 border-indigo-500/10 z-0'}`}
                          style={{ left: `${block.left}%`, top: `${block.top}%`, width: `${block.width}%`, height: `${block.height}%` }}
                        >
                          {isActive && <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>}
                        </div>
                      )
                    })}
                    {HALLWAY_RADAR_BLOCKS.map(block => {
                      const isActive = Object.values(radarTargets).includes(block.id);
                      return (
                        <div
                          key={`block-${block.id}`}
                          className={`absolute border transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-rose-500/40 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] z-20 backdrop-blur-[1px]' : 'bg-indigo-500/5 border-indigo-500/10 z-0'}`}
                          style={{ left: `${block.left}%`, top: `${block.top}%`, width: `${block.width}%`, height: `${block.height}%`, clipPath: block.clipPath }}
                        >
                          {isActive && <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>}
                        </div>
                      );
                    })}
                  </div>

                  {filteredSensors.map((sensor) => {
                    const Icon = getDeviceIcon(sensor);
                    const isSelected = selectedSensor?.id === sensor.id;
                    const hasWarning = sensor.status === 'Nguy hiểm' || sensor.status === 'Cảnh báo';

                    return (
                      <button
                        key={sensor.id}
                        onClick={(e) => handleDeviceClick(e, sensor)}
                        style={{ left: `${sensor.pos2dX}%`, top: `${sensor.pos2dY}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 group hover:scale-150 hover:z-20 ${sensor.isFake ? 'opacity-60 grayscale hover:grayscale-0' : ''}`}
                      >
                        {hasWarning && (
                          <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-rose-500"></div>
                        )}

                        <div className={`relative flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-white shadow-2xl border-2 ${isSelected ? 'border-white ring-4 ring-white/30' : 'border-white/60'} ${hasWarning ? 'bg-rose-600' : getTypeColor(sensor.deviceType)}`}>
                          <Icon className="w-3 h-3 md:w-4 md:h-4 drop-shadow-md" />
                        </div>

                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 rounded bg-slate-900/90 backdrop-blur-sm text-[10px] text-white font-bold tracking-tight transition-opacity whitespace-nowrap border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none">
                          {sensor.label || sensor.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* BỘ LỌC CÁC MODULE TRÊN MAP */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-4 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-white text-sm font-bold tracking-wide uppercase">2D Floorplan</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col gap-1 w-44">
          {[
            { id: 'all', label: 'Tất cả thiết bị' },
            { id: 'security', label: 'An ninh' },
            { id: 'environment', label: 'Môi trường' },
            { id: 'appliance', label: 'Đồ điện / Rèm' },
            { id: 'safety', label: 'PCCC' },
            { id: 'radar', label: 'Radar' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-left ${activeFilter === f.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* BẢNG ĐIỀU KHIỂN BÊN PHẢI */}
      <aside className="absolute top-6 right-6 bottom-6 w-[380px] z-30 flex flex-col gap-4 animate-in slide-in-from-right duration-700 pointer-events-auto">

        {/* KHUNG HIỂN THỊ CAMERA */}
        {activeCameraId && (
          <div className="shrink-0 h-56 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
            {!cameraError && activeCameraObj?.streamUrl ? (
              <img
                key={cameraKey}
                src={activeCameraObj.streamUrl}
                alt="Camera Stream"
                className="w-full h-full object-cover bg-black scale-105"
                onError={() => setCameraError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
                <Wifi className="w-10 h-10 text-slate-600 mb-3 opacity-50" />
                <p className="text-slate-400 text-xs font-bold mb-4">Camera đang ngoại tuyến.</p>
                <button
                  onClick={() => { setCameraError(false); setCameraKey(Date.now()); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg"
                >
                  <RefreshCw className="w-3 h-3" /> Tải lại luồng
                </button>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">LIVE</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
              <h3 className="text-sm font-bold text-white mb-0.5">{activeCameraMeta?.label || 'Camera'}</h3>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <Video className="w-3 h-3" /> {activeCameraMeta?.roomName || 'Hệ thống'}
              </p>
            </div>
          </div>
        )}

        {!selectedSensor ? (
          <div className="flex-1 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
              <MousePointer2 className="w-8 h-8 text-blue-500 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Chưa chọn thiết bị</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Click vào một module trên bản đồ để hiển thị thông tin.</p>
          </div>
        ) : selectedSensor.isFake ? (
          <div className="flex-1 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className={`p-4 rounded-3xl ${getTypeColor(selectedSensor.deviceType)} shadow-xl mb-6`}>
              {(() => {
                const DynamicIcon = getDeviceIcon(selectedSensor);
                return <DynamicIcon className="w-8 h-8 text-white" />;
              })()}
            </div>
            <h3 className="text-xl font-black text-white leading-tight mb-2 truncate px-4">{selectedSensor.label || selectedSensor.name}</h3>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-tighter mb-8">
              <Map className="w-3.5 h-3.5 text-blue-500" /> {selectedSensor.roomName}
            </div>

            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
              <Clock className="w-8 h-8 text-amber-500 opacity-80" />
            </div>
            <h3 className="text-4xl font-black text-white tracking-widest mb-3 opacity-20">COMING<br />SOON</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">Chức năng cho thiết bị mô phỏng này đang được phát triển.</p>
          </div>
        ) : (
          <>
            <div className="shrink-0 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-3xl ${getTypeColor(selectedSensor.deviceType)} shadow-xl`}>
                    {(() => {
                      const DynamicIcon = getDeviceIcon(selectedSensor);
                      return <DynamicIcon className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider text-blue-400 border-blue-400/30 bg-blue-400/10">
                      LIVE DEVICE
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-tighter mt-1.5">
                      <Map className="w-3.5 h-3.5 text-blue-500" /> {selectedSensor.roomName}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white leading-tight truncate pr-4">{selectedSensor.label || selectedSensor.name}</h3>

                {hasToggleSwitch && (
                  <button
                    onClick={handleToggleSwitch}
                    className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 shrink-0 shadow-inner border border-black/20 ${isDeviceOn ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isDeviceOn ? 'translate-x-6' : ''}`}></div>
                  </button>
                )}
              </div>
            </div>

            {/* BẢNG BÁO CÁO LỊCH SỬ THIẾT BỊ */}
            <div className="flex-1 min-h-0 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" /> Dữ liệu & Báo cáo
                </h4>
              </div>

              <div className="flex flex-col gap-3 mb-6 shrink-0">
                <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">

                  {isHistoryOnlyDevice(selectedSensor) ? (
                    <button onClick={() => handleTabClick('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'history' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                      <Clock className="w-3.5 h-3.5" /> Lịch sử HĐ
                    </button>
                  ) : (selectedSensor.deviceType === 'environment' || selectedSensor.deviceType === 'safety') ? (
                    <button onClick={() => handleTabClick('alert')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'alert' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                      <Bell className="w-3.5 h-3.5" /> Lịch sử Cảnh báo
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleTabClick('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'history' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Clock className="w-3.5 h-3.5" /> Lịch sử HĐ
                      </button>
                      <button onClick={() => handleTabClick('alert')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'alert' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Bell className="w-3.5 h-3.5" /> Cảnh báo
                      </button>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {['1D', '3D'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-colors ${timeFilter === t ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/5 bg-transparent text-slate-500 hover:border-white/20'}`}
                    >
                      {t === '1D' ? 'Hôm nay' : '3 Ngày'}
                    </button>
                  ))}
                </div>
              </div>

              {/* RENDER NỘI DUNG TAB */}
              {dataFilter === 'history' ? (
                isLoadingHistory ? (
                  <div className="flex-1 min-h-0 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-slate-500 bg-black/20">
                    <RefreshCw className="w-8 h-8 mb-3 animate-spin text-blue-400" />
                    <p className="text-sm font-medium text-slate-400">Đang tải dữ liệu...</p>
                  </div>
                ) : deviceHistory.length > 0 ? (
                  <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                    {deviceHistory.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className={`p-2 rounded-xl shrink-0 ${item.state ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                          <Power className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white leading-tight">{item.action}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-slate-500 bg-black/20">
                    <History className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Không có lịch sử hoạt động <br /> trong khoảng thời gian này</p>
                  </div>
                )
              ) : dataFilter === 'alert' && (
                isLoadingAlerts ? (
                  <div className="flex-1 min-h-0 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-slate-500 bg-black/20">
                    <RefreshCw className="w-8 h-8 mb-3 animate-spin text-blue-400" />
                    <p className="text-sm font-medium text-slate-400">Đang tải cảnh báo...</p>
                  </div>
                ) : deviceAlerts.length > 0 ? (
                  <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                    {deviceAlerts.map(item => {
                      const isDanger = item.status === 'Nguy hiểm' || item.status === 'Cảnh báo';
                      const colorBg = isDanger ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500';
                      const AlertIcon = isDanger ? AlertTriangle : CheckCircle2;

                      return (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                          <div className={`p-2 rounded-xl shrink-0 ${colorBg}`}>
                            <AlertIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white leading-tight truncate">{item.value}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {formatTime(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-slate-500 bg-black/20">
                    <Shield className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Hệ thống an toàn <br /> Không có cảnh báo nào được ghi nhận</p>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}