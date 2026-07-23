import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Cpu, Video, Bell, Clock, MessageSquare, Settings, Terminal, LogOut, Globe, AppWindow,
  ZoomIn, ZoomOut, Maximize
} from 'lucide-react';
import useWeather from '../../hooks/useWeather';
import { getMapDevices, getCameraStreams } from '../../services/api/map';
import wsService from '../../services/api/wsService';

// Import các component con của hệ điều hành TSmartOS
import DesktopWindow from './components/DesktopWindow';
import Map2D from './components/Map2D';
import Map3D from './components/Map3D';
import DashboardApp from './components/DashboardApp';
import DevicesListApp from './components/DevicesListApp';
import DeviceInspectorApp from './components/DeviceInspectorApp';
import CameraApp from './components/CameraApp';
import NotificationsApp from './components/NotificationsApp';
import SchedulesApp from './components/SchedulesApp';
import AiChatApp from './components/AiChatApp';
import AdminDashboardApp from './components/AdminDashboardApp';
import SettingsApp from './components/SettingsApp';

// ================= HÀM XÁC ĐỊNH BLOCK RADAR =================
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

export default function Home() {
  const weather = useWeather();
  const [viewMode, setViewMode] = useState('2D'); // '2D' or '3D'
  const [currentDate, setCurrentDate] = useState('');
  const [userProfile, setUserProfile] = useState({
    fullName: localStorage.getItem('fullName') || 'User',
    avatarUrl: localStorage.getItem('avatarUrl') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trung'
  });

  // State quản lý thiết bị & WebSocket
  const [mapDevices, setMapDevices] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [radarTargets, setRadarTargets] = useState({});
  const radarTimersRef = useRef({});
  const transformRef = useRef(null);

  // Default Window Configurations
  const DEFAULT_WINDOWS = {
    dashboard: { id: 'dashboard', label: 'Dashboard', isOpen: true, minimized: false, maximized: false, pinned: false, x: 40, y: 80, width: 400, height: 760, zIndex: 10 },
    devices: { id: 'devices', label: 'Danh sách Thiết bị', isOpen: false, minimized: false, maximized: false, pinned: false, x: 100, y: 120, width: 340, height: 500, zIndex: 10 },
    inspector: { id: 'inspector', label: 'Chi tiết Thiết bị', isOpen: false, minimized: false, maximized: false, pinned: false, x: 860, y: 80, width: 380, height: 580, zIndex: 10, activeDeviceId: null },
    camera: { id: 'camera', label: 'Camera Trực tiếp', isOpen: false, minimized: false, maximized: false, pinned: false, x: 450, y: 150, width: 720, height: 480, zIndex: 10 },
    notifications: { id: 'notifications', label: 'Lịch sử Cảnh báo', isOpen: false, minimized: false, maximized: false, pinned: false, x: 180, y: 90, width: 900, height: 580, zIndex: 10 },
    schedules: { id: 'schedules', label: 'Kịch bản Hẹn giờ', isOpen: false, minimized: false, maximized: false, pinned: false, x: 220, y: 110, width: 850, height: 560, zIndex: 10 },
    aiChat: { id: 'aiChat', label: 'Trợ lý ảo TSmartAI', isOpen: false, minimized: false, maximized: false, pinned: false, x: 440, y: 100, width: 440, height: 540, zIndex: 10 },
    settings: { id: 'settings', label: 'Cấu hình Hệ thống', isOpen: false, minimized: false, maximized: false, pinned: false, x: 200, y: 80, width: 800, height: 580, zIndex: 10 },
    admin: { id: 'admin', label: 'Quản trị hệ thống', isOpen: false, minimized: false, maximized: false, pinned: false, x: 120, y: 70, width: 950, height: 620, zIndex: 10 }
  };

  // State quản lý Window Manager
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [windows, setWindows] = useState(() => {
    try {
      const saved = localStorage.getItem('tsmarthome_windows_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...DEFAULT_WINDOWS };
        Object.keys(parsed).forEach(key => {
          if (merged[key]) {
            merged[key] = { ...merged[key], ...parsed[key] };
          }
        });
        return merged;
      }
    } catch (e) {
      console.error("Failed to load windows config from localStorage:", e);
    }
    return DEFAULT_WINDOWS;
  });

  // Save window configuration to localStorage on change
  useEffect(() => {
    localStorage.setItem('tsmarthome_windows_config', JSON.stringify(windows));
  }, [windows]);

  // Check Admin Role
  const userRole = localStorage.getItem('role') || sessionStorage.getItem('role') || 'USER';
  const isAdmin = userRole?.toUpperCase() === 'ADMIN';

  // Load Date & Profile
  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('vi-VN', dateOptions));

    const handleProfileUpdate = () => {
      setUserProfile({
        fullName: localStorage.getItem('fullName') || 'User',
        avatarUrl: localStorage.getItem('avatarUrl') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trung'
      });
    };
    window.addEventListener('tsmarthome_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('tsmarthome_profile_updated', handleProfileUpdate);
  }, []);

  // Fetch Devices list on mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await getMapDevices();
        if (res && res.code === 1000) {
          setMapDevices(res.data);
        }
      } catch (err) {
        console.error("Lỗi khi fetch map devices:", err);
      }
    };
    fetchDevices();
  }, []);

  // WebSockets State sync
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

  // Clean radar timers
  useEffect(() => {
    return () => {
      Object.values(radarTimersRef.current).forEach(timer => clearTimeout(timer));
      radarTimersRef.current = {};
    };
  }, []);

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

  // Window Manager Logic
  const handleWindowClose = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  };

  const handleWindowMinimize = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], minimized: true }
    }));
  };

  const handleWindowMaximize = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], maximized: !prev[id].maximized }
    }));
  };

  const handleWindowPin = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], pinned: !prev[id].pinned }
    }));
  };

  const handleWindowFocus = (id) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: nextZ }
    }));
  };

  const handleWindowDrag = (id, newX, newY) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], x: newX, y: newY }
    }));
  };

  const handleWindowResize = (id, newW, newH) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], width: newW, height: newH }
    }));
  };

  // Select device (Marker on Map or List item clicked)
  const handleSelectDevice = (device) => {
    setSelectedSensor(device);
    
    // Increment zIndex to focus Inspector window
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    setWindows(prev => ({
      ...prev,
      inspector: {
        ...prev.inspector,
        isOpen: true,
        minimized: false,
        zIndex: nextZ,
        activeDeviceId: device.id
      }
    }));
  };

  // Dock click handler (Window Manager Specification implementation)
  const handleDockClick = (id) => {
    const win = windows[id];
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    if (!win.isOpen) {
      // 1. Not open -> Open it
      setWindows(prev => ({
        ...prev,
        [id]: { ...prev[id], isOpen: true, minimized: false, zIndex: nextZ }
      }));
    } else if (win.minimized) {
      // 4. Minimized -> Restore and focus
      setWindows(prev => ({
        ...prev,
        [id]: { ...prev[id], minimized: false, zIndex: nextZ }
      }));
    } else {
      // Window is open and visible. Check if focused.
      const highestZ = Object.values(windows)
        .filter(w => w.isOpen && !w.minimized)
        .reduce((max, w) => (w.zIndex > max ? w.zIndex : max), 0);

      const isFocused = win.zIndex === highestZ;

      if (!isFocused) {
        // 2. Open but obscured -> Focus
        setWindows(prev => ({
          ...prev,
          [id]: { ...prev[id], zIndex: nextZ }
        }));
      } else {
        // 3. Open and focused -> Minimize
        setWindows(prev => ({
          ...prev,
          [id]: { ...prev[id], minimized: true }
        }));
      }
    }
  };

  // Floating apps list for Dock
  const dockApps = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'devices', label: 'Thiết bị', icon: Cpu },
    { id: 'inspector', label: 'Inspector', icon: Settings },
    { id: 'camera', label: 'Security Cam', icon: Video },
    { id: 'notifications', label: 'Cảnh báo', icon: Bell },
    { id: 'schedules', label: 'Kịch bản', icon: Clock },
    { id: 'aiChat', label: 'Trợ lý ảo', icon: MessageSquare },
    { id: 'settings', label: 'Cài đặt', icon: Globe },
  ];

  if (isAdmin) {
    dockApps.push({ id: 'admin', label: 'Admin Panel', icon: Terminal });
  }

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      
      {/* DESKTOP BACKGROUND WALLPAPER (2D / 3D MAPS) */}
      <div className="absolute inset-0 z-0 select-none">
        {viewMode === '2D' ? (
          <Map2D
            devices={mapDevices}
            activeFilter="all"
            selectedSensor={selectedSensor}
            onDeviceClick={(e, d) => handleSelectDevice(d)}
            radarTargets={radarTargets}
            transformRef={transformRef}
          />
        ) : (
          <Map3D
            devices={mapDevices}
            activeFilter="all"
            selectedSensor={selectedSensor}
            onDeviceClick={(e, d) => handleSelectDevice(d)}
            radarTargets={radarTargets}
          />
        )}
      </div>

      {/* FLOATING TOPBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-slate-950/60 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 select-none pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <AppWindow className="text-white w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-white uppercase leading-none">TSmartOS</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{currentDate}</span>
          </div>
        </div>

        {/* Center Pill: Mode Toggle & 2D Zoom controls */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-full border border-white/10 shadow-2xl pointer-events-auto">
          <div className="flex">
            <button 
              onClick={() => setViewMode('2D')} 
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === '2D' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sơ đồ 2D
            </button>
            <button 
              onClick={() => setViewMode('3D')} 
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === '3D' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Digital Twin 3D
            </button>
          </div>

          {viewMode === '2D' && (
            <>
              <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
              <div className="flex items-center gap-0.5 pr-1">
                <button 
                  onClick={() => transformRef.current?.zoomOut()} 
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Thu nhỏ bản đồ"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => transformRef.current?.resetTransform()} 
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Đặt lại bản đồ"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => transformRef.current?.zoomIn()} 
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Phóng to bản đồ"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* User profile dropdown and system buttons */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {weather.temp && (
            <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-slate-300">
              <span className="text-sky-400 font-bold">{weather.temp}°C</span>
              <span className="opacity-50">•</span>
              <span className="capitalize">{weather.desc}</span>
            </div>
          )}

          <div
            onClick={() => handleDockClick('settings')}
            className="flex items-center gap-2 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors p-1 pr-3 rounded-full cursor-pointer"
            title="Hồ sơ cá nhân"
          >
            <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden border border-slate-600 flex items-center justify-center">
              <img src={userProfile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-bold text-slate-300">{userProfile.fullName}</span>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('tsmarthome_open_logout'))}
            className="p-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-all rounded-full border border-rose-500/15 cursor-pointer shadow-md"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* FLOATING WINDOWS LAYER (pointer-events-none lets clicks fall through to map) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none">
        
        {/* App 1: Dashboard App */}
        <DesktopWindow
          {...windows.dashboard}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <DashboardApp />
        </DesktopWindow>

        {/* App 2: Devices App */}
        <DesktopWindow
          {...windows.devices}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <DevicesListApp onSelectDevice={handleSelectDevice} />
        </DesktopWindow>

        {/* App 3: Inspector App */}
        <DesktopWindow
          {...windows.inspector}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <DeviceInspectorApp 
            deviceId={windows.inspector.activeDeviceId} 
            activeDevice={selectedSensor && selectedSensor.id === windows.inspector.activeDeviceId ? selectedSensor : mapDevices.find(d => d.id === windows.inspector.activeDeviceId)}
          />
        </DesktopWindow>

        {/* App 4: Camera App */}
        <DesktopWindow
          {...windows.camera}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <CameraApp />
        </DesktopWindow>

        {/* App 5: Notifications App */}
        <DesktopWindow
          {...windows.notifications}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <NotificationsApp />
        </DesktopWindow>

        {/* App 6: Schedules App */}
        <DesktopWindow
          {...windows.schedules}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <SchedulesApp />
        </DesktopWindow>

        {/* App 7: AI Chat App */}
        <DesktopWindow
          {...windows.aiChat}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <AiChatApp />
        </DesktopWindow>

        {/* App 8: Settings App */}
        <DesktopWindow
          {...windows.settings}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <SettingsApp />
        </DesktopWindow>

        {/* App 9: Admin App */}
        <DesktopWindow
          {...windows.admin}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onPin={handleWindowPin}
          onFocus={handleWindowFocus}
          onDrag={handleWindowDrag}
          onResize={handleWindowResize}
        >
          <AdminDashboardApp />
        </DesktopWindow>

      </div>

      {/* DOCK BAR SYSTEM */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/60 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] pointer-events-auto select-none">
        {dockApps.map(app => {
          const Icon = app.icon;
          const win = windows[app.id];
          const isAppOpen = win.isOpen;
          const isAppMinimized = win.minimized;

          return (
            <button
              key={app.id}
              onClick={() => handleDockClick(app.id)}
              className="relative p-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-2xl transition-all duration-300 hover:scale-125 cursor-pointer outline-none group border border-white/5 hover:border-white/10 active:scale-95 shadow-md flex items-center justify-center"
            >
              <Icon className="w-5 h-5" />

              {/* Indicator Dot (macos style) */}
              {isAppOpen && (
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isAppMinimized ? 'bg-slate-500 opacity-60' : 'bg-blue-500 animate-pulse'
                }`}></span>
              )}

              {/* Tooltip */}
              <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur border border-white/10 px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl whitespace-nowrap">
                {app.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}