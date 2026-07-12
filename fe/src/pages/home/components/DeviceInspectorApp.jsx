import { useState, useEffect } from 'react';
import { 
  Thermometer, Camera, DoorClosed, Activity, Flame, 
  Lightbulb, Wind, Mic, AppWindow, Tv, Sun, Bell, Blinds, Radar, Cpu,
  Wifi, RefreshCw, Power, AlertTriangle, CheckCircle2, History, Clock, MapPin, Video
} from 'lucide-react';
import { getDeviceInfo } from '../../../utils/deviceMapper';
import { controlDevice, getDeviceHistory, getDeviceAlerts } from '../../../services/api/device';
import { getCameraStreams } from '../../../services/api/map';
import wsService from '../../../services/api/wsService';

export default function DeviceInspectorApp({ deviceId, activeDevice }) {
  const [device, setDevice] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [cameraError, setCameraError] = useState(false);
  const [cameraKey, setCameraKey] = useState(Date.now());

  // Report/Tab States
  const [timeFilter, setTimeFilter] = useState('1D');
  const [dataFilter, setDataFilter] = useState('history');
  const [deviceHistory, setDeviceHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [deviceAlerts, setDeviceAlerts] = useState([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  // Load Cameras list to resolve stream url
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await getCameraStreams();
        if (res && res.code === 1000) setCameras(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCameras();
  }, []);

  // Fetch / update active device details from general device lists
  useEffect(() => {
    if (!deviceId) {
      setDevice(null);
      return;
    }

    if (activeDevice) {
      setDevice(activeDevice);
    } else {
      // Fallback: We map device info using local device mapper first
      const fetchDeviceDetail = async () => {
        try {
          const info = getDeviceInfo(deviceId);
          setDevice({
            id: deviceId,
            name: deviceId,
            label: info.name,
            deviceType: info.type,
            roomName: info.room || 'Hệ thống',
            state: false,
            status: 'Đang hoạt động',
            isFake: false
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchDeviceDetail();
    }
  }, [deviceId, activeDevice]);

  // Set default tabs
  useEffect(() => {
    if (device) {
      const isEnvOrSafety = device.deviceType === 'environment' || device.deviceType === 'safety';
      if (isHistoryOnlyDevice(device)) {
        setDataFilter('history');
      } else {
        setDataFilter(isEnvOrSafety ? 'alert' : 'history');
      }
    }
  }, [device?.id]);

  // WebSocket sync for this specific device
  useEffect(() => {
    if (!deviceId) return;
    const stompClient = wsService.connect((rawData) => {
      if (rawData.deviceId === device?.name || rawData.deviceId === deviceId) {
        setDevice(prev => {
          if (!prev) return null;
          return {
            ...prev,
            state: rawData.state !== undefined ? rawData.state : prev.state,
            status: rawData.status !== undefined ? rawData.status : prev.status
          };
        });
      }
    });

    return () => {
      wsService.disconnect(stompClient);
    };
  }, [deviceId, device?.name]);

  // Load history/alerts based on filter changes
  useEffect(() => {
    if (deviceId && device && !device.isFake) {
      if (dataFilter === 'history') {
        fetchHistory(deviceId, timeFilter);
      } else if (dataFilter === 'alert') {
        fetchAlerts(deviceId, timeFilter);
      }
    }
  }, [deviceId, device?.id, dataFilter, timeFilter]);

  const fetchHistory = async (id, filterObj) => {
    setIsLoadingHistory(true);
    try {
      const res = await getDeviceHistory(id, filterObj === '3D' ? '3d' : '');
      if (res && res.code === 1000) setDeviceHistory(res.data);
    } catch {
      setDeviceHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchAlerts = async (id, filterObj) => {
    setIsLoadingAlerts(true);
    try {
      const res = await getDeviceAlerts(id, filterObj === '3D' ? '3d' : '');
      if (res && res.code === 1000) setDeviceAlerts(res.data);
    } catch {
      setDeviceAlerts([]);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const handleToggleSwitch = async () => {
    if (!device || device.isFake || device.state === null) return;
    const action = !device.state;
    try {
      setDevice(prev => ({ ...prev, state: action }));
      await controlDevice(device.id, action);
      if (dataFilter === 'history') {
        fetchHistory(device.id, timeFilter);
      }
    } catch (err) {
      console.error(err);
      setDevice(prev => ({ ...prev, state: !action }));
    }
  };

  const isHistoryOnlyDevice = (dev) => {
    if (!dev) return false;
    const name = (dev.name || '').toLowerCase();
    const label = (dev.label || '').toLowerCase();
    return (
      dev.deviceType === 'appliance' ||
      name.includes('light') ||
      name.includes('curtain') ||
      label.includes('đèn') ||
      label.includes('rèm')
    );
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

  const getDeviceIcon = (dev) => {
    const nameStr = (dev.label || dev.name || '').toLowerCase();
    const type = dev.deviceType;

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

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    const day = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    return `${time} - ${day}`;
  };

  if (!deviceId || !device) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs">
        <Cpu className="w-12 h-12 mb-3 opacity-20" />
        <p>Vui lòng nhấp vào một thiết bị trên Bản đồ hoặc Danh sách thiết bị để kiểm tra.</p>
      </div>
    );
  }

  const Icon = getDeviceIcon(device);
  const activeCameraObj = cameras.find(c => c.deviceId === device.id);
  const hasToggleSwitch = device.state !== null && device.deviceType !== 'environment';
  const isOn = device.state === true;

  return (
    <div className="flex flex-col h-full text-white p-4 font-sans gap-4">
      {/* Device summary box */}
      <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col shrink-0 gap-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white ${getTypeColor(device.deviceType)}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[7px] font-black px-2 py-0.5 rounded border uppercase tracking-wider text-blue-400 border-blue-400/30 bg-blue-400/10">
                Live Device
              </span>
              <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[8px] uppercase tracking-wider mt-1">
                <MapPin className="w-2.5 h-2.5 text-blue-500" /> {device.roomName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider bg-slate-500/20 text-slate-400 border-slate-500/30`}>
              {device.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <h3 className="text-sm font-black text-white truncate max-w-[200px]" title={device.label || device.name}>
            {device.label || device.name}
          </h3>

          {hasToggleSwitch && (
            <button
              onClick={handleToggleSwitch}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors duration-300 shrink-0 cursor-pointer border border-black/10 ${isOn ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isOn ? 'translate-x-5' : ''}`}></div>
            </button>
          )}
        </div>
      </div>

      {/* Live Stream Camera box if camera */}
      {activeCameraObj && (
        <div className="h-44 bg-black border border-white/10 rounded-xl overflow-hidden relative shrink-0">
          {!cameraError && activeCameraObj.streamUrl ? (
            <img
              key={cameraKey}
              src={activeCameraObj.streamUrl}
              alt="Camera Feed"
              className="w-full h-full object-cover scale-105"
              onError={() => setCameraError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
              <Wifi className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
              <p className="text-slate-400 text-[10px] font-bold mb-3">Camera ngoại tuyến.</p>
              <button
                onClick={() => { setCameraError(false); setCameraKey(Date.now()); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin" /> Tải lại
              </button>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 bg-black/50 px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-[8px] font-bold text-white tracking-widest uppercase">LIVE</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 pt-6">
            <h4 className="text-[10px] font-bold text-white leading-tight">{device.label}</h4>
            <p className="text-[8px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
              <Video className="w-3 h-3" /> {device.roomName}
            </p>
          </div>
        </div>
      )}

      {/* History & Reports tab */}
      <div className="flex-1 flex flex-col min-h-0">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5 shrink-0">
          <History className="w-3.5 h-3.5 text-blue-400" /> Báo cáo thiết bị
        </h4>

        {/* Tab Header Selector */}
        <div className="flex flex-col gap-2 shrink-0 mb-3">
          <div className="flex bg-black/40 rounded-xl p-0.5 border border-white/5">
            {isHistoryOnlyDevice(device) ? (
              <button onClick={() => setDataFilter('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${dataFilter === 'history' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                <Clock className="w-3 h-3" /> Lịch sử HĐ
              </button>
            ) : (device.deviceType === 'environment' || device.deviceType === 'safety') ? (
              <button onClick={() => setDataFilter('alert')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${dataFilter === 'alert' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                <Bell className="w-3 h-3" /> Cảnh báo
              </button>
            ) : (
              <>
                <button onClick={() => setDataFilter('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${dataFilter === 'history' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Clock className="w-3 h-3" /> Lịch sử</button>
                <button onClick={() => setDataFilter('alert')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${dataFilter === 'alert' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Bell className="w-3 h-3" /> Cảnh báo</button>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {['1D', '3D'].map(t => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${timeFilter === t ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/5 bg-transparent text-slate-500 hover:border-white/20'}`}
              >
                {t === '1D' ? 'Hôm nay' : '3 Ngày'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Body Render */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          {dataFilter === 'history' ? (
            isLoadingHistory ? (
              <div className="flex items-center justify-center py-6 text-slate-500"><RefreshCw className="w-5 h-5 animate-spin text-blue-400" /></div>
            ) : deviceHistory.length > 0 ? (
              deviceHistory.map(item => (
                <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className={`p-1.5 rounded-lg shrink-0 ${item.state ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    <Power className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate leading-tight">{item.action}</p>
                    <p className="text-[8px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono"><Clock className="w-2.5 h-2.5" />{formatTime(item.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[11px] text-slate-500">Không có lịch sử hoạt động</div>
            )
          ) : (
            isLoadingAlerts ? (
              <div className="flex items-center justify-center py-6 text-slate-500"><RefreshCw className="w-5 h-5 animate-spin text-blue-400" /></div>
            ) : deviceAlerts.length > 0 ? (
              deviceAlerts.map(item => {
                const isDanger = item.status === 'Nguy hiểm' || item.status === 'Cảnh báo';
                return (
                  <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className={`p-1.5 rounded-lg shrink-0 ${isDanger ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      {isDanger ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate leading-tight">{item.value}</p>
                      <p className="text-[8px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono"><Clock className="w-2.5 h-2.5" />{formatTime(item.createdAt)}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-[11px] text-slate-500">Hệ thống an toàn</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
