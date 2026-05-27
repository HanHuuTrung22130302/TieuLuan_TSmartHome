import { useState, useEffect } from 'react';
import { 
  Camera, Activity, Radar, Video, AlertTriangle, 
  Flame, Wifi, Maximize, CheckCircle2, MapPin, RefreshCw
} from 'lucide-react';
import { getSecuritySidebar } from '../../services/api/security';
import wsService from '../../services/api/wsService';

export default function Security() {
  const [securityDevices, setSecurityDevices] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState(null);
  const [flashingDevices, setFlashingDevices] = useState({});

  // States quản lý lỗi kết nối Camera
  const [cameraErrors, setCameraErrors] = useState({});
  const [cameraKeys, setCameraKeys] = useState({});

  // Lấy dữ liệu API qua Service
  useEffect(() => {
    const fetchSecuritySidebar = async () => {
      try {
        const response = await getSecuritySidebar();
        if (response && response.code === 1000) {
          const devices = response.data;
          setSecurityDevices(devices);
          
          // Tự động chọn camera đầu tiên nếu có
          const firstCamera = devices.find(d => d.streamUrl);
          if (firstCamera) {
            setActiveCameraId(firstCamera.id);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách an ninh:", error);
      }
    };
    fetchSecuritySidebar();
  }, []);

  // Lắng nghe WebSocket để nhấp nháy cảm biến
  useEffect(() => {
    const stompClient = wsService.connect((rawData) => {
      const { deviceId, status, value } = rawData;
      
      setSecurityDevices(prev => 
        prev.map(d => {
          if (d.name === deviceId) {
            return { ...d, lastStatus: status, lastValue: value };
          }
          return d;
        })
      );

      // Bật cờ flashing cho thiết bị đó để UI nhấp nháy
      if (status === 'Nguy hiểm' || status === 'Cảnh báo') {
        setFlashingDevices(prev => ({ ...prev, [deviceId]: true }));
        
        // Tắt nhấp nháy sau 3 giây để đưa UI về bình thường
        setTimeout(() => {
          setFlashingDevices(prev => ({ ...prev, [deviceId]: false }));
        }, 3000);
      }
    });

    return () => {
      wsService.disconnect(stompClient);
    };
  }, []);

  // Phân loại Camera và Sensor
  const cameras = securityDevices.filter(d => d.streamUrl);
  const sensors = securityDevices.filter(d => !d.streamUrl);
  
  const activeCamera = cameras.find(c => c.id === activeCameraId);

  const getSensorIcon = (type) => {
    switch (type) {
      case 'radar': return Radar;
      case 'safety': return Flame;
      case 'security': return Activity;
      default: return Activity;
    }
  };

  const getSensorColor = (status, type) => {
    if (status === 'Nguy hiểm') return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    if (status === 'Cảnh báo') return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    
    if (type === 'safety') return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    if (type === 'radar') return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30';
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
  };

  // Hàm chuyển đổi Camera và Reset Lỗi
  const handleCameraSwitch = (camId) => {
    setActiveCameraId(camId);
    setCameraErrors(prev => ({ ...prev, [camId]: false }));
    setCameraKeys(prev => ({ ...prev, [camId]: Date.now() }));
  };

  // Hàm tải lại stream Camera thủ công
  const reloadCameraStream = () => {
    if (!activeCameraId) return;
    setCameraErrors(prev => ({ ...prev, [activeCameraId]: false }));
    setCameraKeys(prev => ({ ...prev, [activeCameraId]: Date.now() }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)]">
        
        {/* ================= CỘT TRÁI: CAMERA ================= */}
        <div className="xl:col-span-2 flex-1 flex flex-col gap-6 h-full min-h-[500px]">
          
          {/* Màn hình Stream Camera Chính */}
          <div className="flex-1 bg-[#121212] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
            {activeCamera ? (
              <>
                {!cameraErrors[activeCamera.id] ? (
                  <img 
                    // Thay đổi Key sẽ ép React hủy thẻ img cũ và render lại luồng mạng từ đầu
                    key={`${activeCamera.id}-${cameraKeys[activeCamera.id] || 'init'}`}
                    src={activeCamera.streamUrl} 
                    alt={activeCamera.label || activeCamera.name} 
                    className="w-full h-full object-cover bg-black"
                    onError={() => {
                      setCameraErrors(prev => ({ ...prev, [activeCamera.id]: true }));
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
                    <Wifi className="w-12 h-12 text-slate-600 mb-4 opacity-50" />
                    <p className="text-slate-400 font-bold mb-6">Mất kết nối stream hoặc ESP32 đang offline.</p>
                    <button 
                      onClick={reloadCameraStream}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                    >
                      <RefreshCw className="w-4 h-4" /> Tải lại Camera
                    </button>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-10"></div>
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    <span className="text-xs font-bold tracking-widest uppercase text-white">LIVE REC</span>
                  </div>
                  <button className="bg-black/50 backdrop-blur-md p-2.5 rounded-xl border border-white/10 hover:bg-white/20 transition-colors text-white">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{activeCamera.label || activeCamera.name}</h3>
                  <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <Video className="w-3.5 h-3.5" /> {activeCamera.roomName} • ESP32 Cam
                  </p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                <Camera className="w-12 h-12 text-slate-600 mb-4 opacity-50" />
                <p className="text-slate-400 font-bold">Không tìm thấy nguồn Camera nào.</p>
              </div>
            )}
          </div>

          {/* Thanh chọn Camera bên dưới */}
          <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-4 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-4">
              {cameras.map(cam => (
                <button 
                  key={cam.id}
                  onClick={() => handleCameraSwitch(cam.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 min-w-[200px] border ${
                    activeCameraId === cam.id 
                      ? 'bg-blue-600/20 border-blue-500/50 text-white' 
                      : 'bg-black/40 border-white/5 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Camera className={`w-5 h-5 ${activeCameraId === cam.id ? 'text-blue-400' : 'text-slate-500'}`} />
                  <div className="text-left">
                    <p className="font-bold text-sm truncate">{cam.label || cam.name}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-60 truncate">{cam.roomName}</p>
                  </div>
                </button>
              ))}
              {cameras.length === 0 && (
                <div className="px-5 py-3 text-sm text-slate-500">Chưa có dữ liệu Camera</div>
              )}
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI: DANH SÁCH CẢM BIẾN ================= */}
        <div className="w-full xl:w-96 flex flex-col shrink-0 h-full">
          <div className="flex-1 bg-[#121212] border border-white/5 rounded-[2.5rem] p-5 shadow-2xl flex flex-col relative overflow-hidden">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm sticky top-0 bg-[#121212] z-20 pb-2">
              <Activity className="w-4 h-4 text-amber-400" /> Trạng thái Cảm biến
            </h3>
            
            {/* THÊM px-2 và -mx-2 ĐỂ FIX LỖI OVERFLOW KHI CARD PHÌNH TO */}
            <div className="flex flex-col gap-3 overflow-y-auto px-2 pb-4 -mx-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
              {sensors.map(sensor => {
                const Icon = getSensorIcon(sensor.deviceType);
                const isFlashing = flashingDevices[sensor.name];
                const statusStr = sensor.lastStatus || 'An toàn';
                const colorClasses = getSensorColor(statusStr, sensor.deviceType);
                const hasWarning = statusStr === 'Nguy hiểm' || statusStr === 'Cảnh báo';

                return (
                  <div 
                    key={sensor.id}
                    className={`border rounded-2xl p-4 transition-all duration-300 ${
                      isFlashing 
                        ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] bg-rose-500/10 scale-[1.02] z-10' 
                        : 'border-white/5 bg-black/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${isFlashing ? 'bg-rose-500 text-white' : colorClasses.replace('text-', 'text-').split(' ')[0] + ' ' + colorClasses.split(' ')[1]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-white truncate pr-2" title={sensor.label || sensor.name}>
                            {sensor.label || sensor.name}
                          </h4>
                          {hasWarning ? (
                            <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isFlashing ? 'text-rose-400 animate-ping' : 'text-amber-400'}`} />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> {sensor.roomName}
                        </p>
                        
                        {(sensor.lastValue || hasWarning) && (
                          <div className={`text-[10px] font-medium px-2 py-1 rounded-md inline-block ${
                            hasWarning ? 'bg-rose-500/20 text-rose-300' : 'bg-white/5 text-slate-300'
                          }`}>
                            {sensor.lastValue || statusStr}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {sensors.length === 0 && (
                <div className="text-center text-slate-500 text-sm py-4">Không có cảm biến an ninh</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}