import { useState, useEffect } from 'react';
import { 
  Camera, Activity, Radar, Video, AlertTriangle, 
  Flame, Wifi, Maximize, CheckCircle2, MapPin, RefreshCw, X
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

  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorLogs, setSensorLogs] = useState({});

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

  // Lắng nghe WebSocket để nhấp nháy cảm biến và lưu log raw
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

      // Lưu log mới nhận từ WebSocket
      if (deviceId) {
        setSensorLogs(prev => {
          const logs = prev[deviceId] || [];
          const newLog = {
            timestamp: new Date().toLocaleTimeString('vi-VN'),
            status: status || 'Bình thường',
            value: value || 'Dữ liệu thô',
            raw: rawData
          };
          return {
            ...prev,
            [deviceId]: [newLog, ...logs].slice(0, 50)
          };
        });
      }

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

  const renderPayloadDetails = (type, payload) => {
    if (!payload) return <p className="text-xs text-slate-500">Không có dữ liệu</p>;

    switch (type) {
      case 'radar': {
        const distance = payload.distance !== undefined ? payload.distance : 0;
        return (
          <div className="space-y-3 mt-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Khoảng cách phát hiện:</span>
              <span className="text-indigo-400 font-extrabold text-sm">{distance} cm</span>
            </div>
            {/* Progress bar visual */}
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (distance / 400) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Phạm vi phát hiện chuyển động của Radar (Tối đa 400 cm).</p>
          </div>
        );
      }
      case 'safety': {
        const gas = payload.gas !== undefined ? payload.gas : 0;
        const smoke = payload.smoke !== undefined ? payload.smoke : 0;
        const isGasHigh = gas > 300;
        const isSmokeHigh = smoke > 300;
        
        return (
          <div className="space-y-4 mt-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            {/* Gas Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Khí Gas rò rỉ:</span>
                <span className={`font-extrabold ${isGasHigh ? 'text-rose-400' : 'text-emerald-400'}`}>{gas} ppm</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${isGasHigh ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (gas / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Smoke Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Nồng độ khói:</span>
                <span className={`font-extrabold ${isSmokeHigh ? 'text-rose-400' : 'text-emerald-400'}`}>{smoke} ppm</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${isSmokeHigh ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (smoke / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 font-medium">Báo động an toàn khói lửa tự động kích hoạt khi vượt ngưỡng an toàn (300 ppm).</p>
          </div>
        );
      }
      case 'environment': {
        const temp = payload.temperature !== undefined ? payload.temperature : 0;
        const hum = payload.humidity !== undefined ? payload.humidity : 0;
        const co2 = payload.co2 !== undefined ? payload.co2 : 0;
        
        const isTempWarning = temp > 40 || temp < 10;
        const isHumWarning = hum > 85 || hum < 20;
        const isCo2Warning = co2 > 1000;

        return (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {/* Temp */}
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nhiệt độ</span>
              <span className={`text-base font-extrabold block ${isTempWarning ? 'text-rose-400' : 'text-slate-200'}`}>{temp} °C</span>
              <span className="text-[9px] text-slate-500 font-semibold block">{isTempWarning ? 'Bất thường' : 'Bình thường'}</span>
            </div>

            {/* Hum */}
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Độ ẩm</span>
              <span className={`text-base font-extrabold block ${isHumWarning ? 'text-rose-400' : 'text-slate-200'}`}>{hum} %</span>
              <span className="text-[9px] text-slate-500 font-semibold block">{isHumWarning ? 'Ẩm ướt/Khô' : 'Bình thường'}</span>
            </div>

            {/* CO2 */}
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CO2</span>
              <span className={`text-base font-extrabold block ${isCo2Warning ? 'text-rose-400' : 'text-slate-200'}`}>{co2} ppm</span>
              <span className="text-[9px] text-slate-500 font-semibold block">{isCo2Warning ? 'Không khí kém' : 'Trong lành'}</span>
            </div>
          </div>
        );
      }
      default: {
        const status = payload.status || 'Bình thường';
        const value = payload.value || 'Hoạt động ổn định';
        const isNormal = status === 'An toàn' || status === 'Bình thường' || status === 'Đang bật' || status === 'Đang tắt' || status === 'Không phát hiện';
        
        return (
          <div className="space-y-3.5 mt-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Trạng thái:</span>
              <span className={`font-extrabold ${isNormal ? 'text-emerald-400' : 'text-rose-400'}`}>{status}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Giá trị đo:</span>
              <span className="text-white font-extrabold">{value}</span>
            </div>
          </div>
        );
      }
    }
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
                    onClick={() => setSelectedSensor(sensor)}
                    className={`border rounded-2xl p-4 transition-all duration-300 cursor-pointer ${
                      isFlashing 
                        ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] bg-rose-500/10 scale-[1.02] z-10' 
                        : 'border-white/5 bg-black/20 hover:bg-white/[0.04] hover:border-white/10 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${isFlashing ? 'bg-rose-500 text-white' : colorClasses.replace('text-', 'text-').split(' ')[0] + ' ' + colorClasses.split(' ')[1]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-white pr-2" title={sensor.label || sensor.name}>
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

      {/* POPUP X XEM DỮ LIỆU WEBSOCKET STORM CHO CẢM BIẾN */}
      {selectedSensor && (() => {
        const Icon = getSensorIcon(selectedSensor.deviceType);
        const logs = sensorLogs[selectedSensor.name] || [];
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              onClick={() => setSelectedSensor(null)} 
              className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            ></div>
            
            <div className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedSensor(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Popup Header */}
              <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-5 shrink-0">
                <div className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white pr-10 truncate">
                    {selectedSensor.label || selectedSensor.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Vị trí: Phòng {selectedSensor.roomName} • Loại: {selectedSensor.deviceType}
                  </p>
                </div>
              </div>

              {/* Popup Content (Scrollable logs) */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                    Luồng WebSocket Storm (Real-time Stream)
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Dưới đây là các gói tin thời gian thực nhận được từ thiết bị kể từ khi tải trang.
                  </p>
                </div>

                {logs.length === 0 ? (
                  <div className="border border-white/5 bg-black/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-dashed border-slate-700 flex items-center justify-center animate-spin text-slate-500">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Đang chờ nhận gói tin mới...</p>
                    <p className="text-[10px] text-slate-500">Kích hoạt cảm biến hoặc chờ mô phỏng gửi dữ liệu mới qua MQTT.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((logItem, index) => (
                      <div 
                        key={index}
                        className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3"
                      >
                        {/* Log Item Header */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-slate-500 font-bold">{logItem.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                            logItem.status === 'Nguy hiểm' 
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' 
                              : logItem.status === 'Cảnh báo'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {logItem.status}
                          </span>
                        </div>

                        {/* Formatted UI Payload Details */}
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Thông số cảm biến ghi nhận:</span>
                          {renderPayloadDetails(selectedSensor.deviceType, logItem.raw)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Popup Footer */}
              <div className="shrink-0 pt-4 border-t border-white/5 mt-4 text-right">
                <button 
                  onClick={() => setSelectedSensor(null)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-white/5"
                >
                  Đóng
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}