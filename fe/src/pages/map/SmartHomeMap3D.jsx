import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { 
  Thermometer, Camera, DoorClosed, Activity, Flame, 
  Lightbulb, Wind, Lock, Mic, AppWindow, Tv, Sun, Bell, 
  Blinds, Shield, Zap, Map, History, BarChart3, Clock, MousePointer2, Droplets
} from 'lucide-react';

// DANH SÁCH CẢM BIẾN 3D (ĐÃ XÓA TRƯỜNG `value`)
const MOCK_SENSORS = [
  { id: 'entrance_door_smartlock', name: 'Cửa chính & Smart Lock', type: 'security', room: 'Cửa chính', position: [-4.67, 1.2, 2.84], status: 'An toàn', isSimulated: false, icon: DoorClosed },
  { id: 'entrance_camera_s3', name: 'Camera ESP32-S3', type: 'security', room: 'Cửa chính', position: [-4.67, 2.2, 2.84], status: 'Bình thường', isSimulated: false, icon: Camera },
  { id: 'entrance_sensor_pir', name: 'PIR Cửa chính', type: 'security', room: 'Cửa chính', position: [-4.67, 2.2, 3.84], status: 'Bình thường', isSimulated: false, icon: Activity },

  { id: 'livingroom_light_front', name: 'Đèn trần trước', type: 'appliance', room: 'Phòng Khách', position: [-5.67, 1.2, 2.84], status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  { id: 'livingroom_light_back', name: 'Đèn trần sau', type: 'appliance', room: 'Phòng Khách', position: [-3.67, 1.2, 2.84], status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'livingroom_light_ceiling', name: 'Đèn trần P.Khách', type: 'appliance', room: 'Phòng Khách', position: [-1.79, 1.2, 3.19], status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'livingroom_light_dining', name: 'Đèn phòng ăn', type: 'appliance', room: 'Phòng Khách', position: [1.77, 1.2, 3.08], status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  { id: 'kitchen_light_main', name: 'Đèn bếp', type: 'appliance', room: 'Bếp', position: [1.86, 1.2, 0.13], status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  { id: 'livingroom_sensor_pir', name: 'PIR Khách/Bếp', type: 'security', room: 'Phòng Khách', position: [-0.15, 1.2, 3.18], status: 'Cảnh báo', isSimulated: false, icon: Activity },
  { id: 'livingroom_sensor_dht22', name: 'DHT22 (Nhiệt/Ẩm)', type: 'environment', room: 'Phòng Khách', position: [0.03, 1.2, -0.06], status: 'Bình thường', isSimulated: false, icon: Thermometer },
  { id: 'kitchen_sensor_mq135', name: 'Khí MQ-135', type: 'environment', room: 'Bếp', position: [-0.77, 1.2, 1.14], status: 'An toàn', isSimulated: false, icon: Wind },
  { id: 'kitchen_sensor_flame', name: 'Cảm biến Lửa', type: 'safety', room: 'Bếp', position: [1.69, 1.2, 1.53], status: 'An toàn', isSimulated: false, icon: Flame },
  { id: 'livingroom_sensor_audio', name: 'Cảm biến Âm thanh & Mic', type: 'environment', room: 'Phòng Khách', position: [0.06, 1.2, 4.79], status: 'Yên tĩnh', isSimulated: false, icon: Mic },

  { id: 'hallway_sensor_pir', name: 'PIR Hành lang', type: 'security', room: 'Hành Lang', position: [0.14, 1.2, -2.28], status: 'Bình thường', isSimulated: false, icon: Activity },
  { id: 'hallway_light_main', name: 'Đèn hành lang', type: 'appliance', room: 'Hành Lang', position: [0.06, 1.2, -1.45], status: 'Bình thường', isSimulated: true, icon: Lightbulb },

  { id: 'bedroom1_light_main', name: 'Đèn PN1', type: 'appliance', room: 'Phòng Ngủ 1', position: [-2.81, 1.2, -0.42], status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'bedroom1_sensor_flame', name: 'Lửa PN1', type: 'safety', room: 'Phòng Ngủ 1', position: [-3.28, 1.2, 1.02], status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'bedroom1_window_main', name: 'Cửa sổ PN1', type: 'security', room: 'Phòng Ngủ 1', position: [-3.89, 1.2, -1.94], status: 'An toàn', isSimulated: true, icon: AppWindow },

  { id: 'bedroom2_light_main', name: 'Đèn PN2', type: 'appliance', room: 'Phòng Ngủ 2', position: [-1.85, 1.2, -4.11], status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'bedroom2_sensor_flame', name: 'Lửa PN2', type: 'safety', room: 'Phòng Ngủ 2', position: [-2.96, 1.2, -3.06], status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'bedroom2_window_main', name: 'Cửa sổ PN2', type: 'security', room: 'Phòng Ngủ 2', position: [-1.70, 1.2, -5.52], status: 'An toàn', isSimulated: true, icon: AppWindow },

  { id: 'bedroom3_light_main', name: 'Đèn PN3', type: 'appliance', room: 'Phòng Ngủ 3', position: [3.06, 1.2, -4.00], status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'bedroom3_sensor_flame', name: 'Lửa PN3', type: 'safety', room: 'Phòng Ngủ 3', position: [1.84, 1.2, -3.96], status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'bedroom3_window_main', name: 'Cửa sổ PN3', type: 'security', room: 'Phòng Ngủ 3', position: [4.65, 1.2, -3.58], status: 'An toàn', isSimulated: true, icon: AppWindow },

  { id: 'balcony1_door_main', name: 'Cửa Ban công 1', type: 'security', room: 'Ban Công 1', position: [3.56, 1.2, 2.9], status: 'An toàn', isSimulated: true, icon: DoorClosed },
  { id: 'balcony1_light_main', name: 'Đèn Ban công 1', type: 'appliance', room: 'Ban Công 1', position: [4.61, 1.2, 3.44], status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'balcony1_curtain_main', name: 'Rèm Ban công 1', type: 'appliance', room: 'Ban Công 1', position: [3.56, 1.2, 3.64], status: 'Hoạt động', isSimulated: true, icon: Blinds },
  
  { id: 'balcony2_door_main', name: 'Cửa Ban công 2', type: 'security', room: 'Ban Công 2', position: [4.54, 1.2, -0.40], status: 'Cảnh báo', isSimulated: true, icon: DoorClosed },
  { id: 'balcony2_light_main', name: 'Đèn Ban công 2', type: 'appliance', room: 'Ban Công 2', position: [4.21, 1.2, -0.96], status: 'Bình thường', isSimulated: true, icon: Lightbulb },

  { id: 'wc1_light_main', name: 'Đèn WC 1', type: 'appliance', room: 'WC 1', position: [4.74, 1.2, 0.41], status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'wc2_light_main', name: 'Đèn WC 2', type: 'appliance', room: 'WC 2', position: [2.13, 1.2, -1.60], status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'wc3_light_main', name: 'Đèn WC 3', type: 'appliance', room: 'WC 3', position: [0.64, 1.2, -4.46], status: 'Bình thường', isSimulated: true, icon: Lightbulb },

  { id: 'global_appliance_tv', name: 'Cảm biến TV', type: 'appliance', room: 'Toàn hệ thống', position: [-1.70, 1.2, 4.74], status: 'Bình thường', isSimulated: false, icon: Tv },
  { id: 'global_environment_light', name: 'Cảm biến Ánh sáng', type: 'environment', room: 'Toàn hệ thống', position: [1.16, 1.2, 4.79], status: 'Bình thường', isSimulated: false, icon: Sun },
  { id: 'global_safety_buzzer', name: 'Còi Buzzer', type: 'safety', room: 'Toàn hệ thống', position: [-3.13, 1.2, 3.92], status: 'Sẵn sàng', isSimulated: false, icon: Bell },
  { id: 'global_camera_ai', name: 'Camera AI Toàn Cảnh', type: 'security', room: 'Toàn hệ thống', position: [3.32, 2.2, 4.75], status: 'Hoạt động', isSimulated: false, icon: Camera },
];

function HouseModel() {
  const { scene } = useGLTF('/web.glb');
  return <primitive object={scene} />;
}

export default function SmartHomeMap3D() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // KHỞI TẠO NULL ĐỂ HIỂN THỊ BẢNG TRỐNG
  const [selectedSensor, setSelectedSensor] = useState(null);

  // UI Bảng điều khiển
  const [isDeviceOn, setIsDeviceOn] = useState(false); 
  const [timeFilter, setTimeFilter] = useState('1D'); 
  const [dataFilter, setDataFilter] = useState('history'); 

  const filteredSensors = MOCK_SENSORS.filter(s => activeFilter === 'all' || s.type === activeFilter);

  useEffect(() => {
    if (selectedSensor) {
      setIsDeviceOn(selectedSensor.status === 'Hoạt động' || selectedSensor.status === 'Bật' || selectedSensor.status === 'Cảnh báo');
      
      // Nếu là Camera, tab mặc định là 'camera' (Live Feed)
      if (selectedSensor.name.includes('Camera')) {
        setDataFilter('camera');
      } else {
        setDataFilter(selectedSensor.type === 'environment' || selectedSensor.type === 'safety' ? 'chart' : 'history');
      }
    }
  }, [selectedSensor]);

  const getTypeColor = (type) => {
    switch(type) {
      case 'environment': return 'bg-sky-500 shadow-sky-500/50';
      case 'security': return 'bg-rose-500 shadow-rose-500/50';
      case 'safety': return 'bg-amber-500 shadow-amber-500/50';
      case 'appliance': return 'bg-violet-500 shadow-violet-500/50';
      default: return 'bg-slate-500 shadow-slate-500/50';
    }
  };

  const hasToggleSwitch = selectedSensor && !['environment', 'safety'].includes(selectedSensor.type);
  const isCamera = selectedSensor && selectedSensor.name.includes('Camera');

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      
      {/* ========================================================= */}
      {/* KHUNG HUD: HIỂN THỊ THÔNG SỐ MÔI TRƯỜNG CHUNG Ở TRÊN CÙNG */}
      {/* ========================================================= */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-4 pointer-events-auto">
        {/* Ô 1: Nhiệt độ */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2.5 px-6 rounded-full flex items-center gap-3 shadow-2xl">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <div className="flex items-baseline gap-1">
            <p className="text-sm font-black text-white leading-none">25</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">°C</p>
          </div>
        </div>
        {/* Ô 2: Độ ẩm */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2.5 px-6 rounded-full flex items-center gap-3 shadow-2xl">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div className="flex items-baseline gap-1">
            <p className="text-sm font-black text-white leading-none">55</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">%</p>
          </div>
        </div>
        {/* Ô 3: Không khí */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-2.5 px-6 rounded-full flex items-center gap-3 shadow-2xl">
          <Wind className="w-4 h-4 text-emerald-400" />
          <div className="flex items-baseline gap-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AQI</p>
            <p className="text-sm font-black text-emerald-400 leading-none">TỐT</p>
          </div>
        </div>
      </div>

      {/* KHU VỰC TRÁI: BỘ LỌC */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-4 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-white text-sm font-bold tracking-wide uppercase">Digital Twin Live 3D</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col gap-1 w-44">
          {[
            { id: 'all', label: 'Tất cả thiết bị' },
            { id: 'security', label: 'An ninh' },
            { id: 'environment', label: 'Môi trường' },
            { id: 'appliance', label: 'Đồ điện / Rèm' },
            { id: 'safety', label: 'PCCC' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-left ${
                activeFilter === f.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KHU VỰC PHẢI: BẢNG ĐIỀU KHIỂN & PHÂN TÍCH */}
      <aside className="absolute top-6 right-6 bottom-6 w-[380px] z-30 flex flex-col gap-4 animate-in slide-in-from-right duration-700 pointer-events-auto">
        
        {/* XỬ LÝ TRẠNG THÁI "CHƯA CHỌN THIẾT BỊ" */}
        {!selectedSensor ? (
          <div className="flex-1 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
              <MousePointer2 className="w-8 h-8 text-blue-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Chưa chọn thiết bị</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Vui lòng click vào một module hoặc cảm biến trên bản đồ 3D để xem thông tin chi tiết và điều khiển hệ thống.</p>
          </div>
        ) : (
          /* TRẠNG THÁI ĐÃ CHỌN THIẾT BỊ (Hiện 2 bảng) */
          <>
            {/* PANEL TRÊN: ĐIỀU KHIỂN */}
            <div className="shrink-0 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-3xl ${getTypeColor(selectedSensor.type)} shadow-xl`}>
                    <selectedSensor.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${selectedSensor.isSimulated ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' : 'text-blue-400 border-blue-400/30 bg-blue-400/10'}`}>
                      {selectedSensor.isSimulated ? 'MÔ PHỎNG' : 'LIVE DEVICE'}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-tighter mt-1.5">
                      <Map className="w-3.5 h-3.5 text-blue-500" /> {selectedSensor.room}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-white leading-tight pr-4">{selectedSensor.name}</h3>
                {hasToggleSwitch && (
                  <button 
                    onClick={() => setIsDeviceOn(!isDeviceOn)}
                    className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 shrink-0 shadow-inner border border-black/20 ${isDeviceOn ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isDeviceOn ? 'translate-x-6' : ''}`}></div>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                  <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Hệ thống</p>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-black tracking-tight">{selectedSensor.status}</span>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                  <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Kết nối</p>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-black uppercase tracking-tight">
                      {selectedSensor.isSimulated ? 'Virtual' : 'ESP32'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL DƯỚI: PHÂN TÍCH & LIVE CAMERA */}
            <div className="flex-1 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" /> Dữ liệu & Lịch sử
                </h4>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                {/* Đổi tab dựa trên việc có phải là Camera hay không */}
                <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
                  {isCamera ? (
                    <>
                      <button onClick={() => setDataFilter('camera')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'camera' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Camera className="w-3.5 h-3.5" /> Live Camera
                      </button>
                      <button onClick={() => setDataFilter('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'history' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <History className="w-3.5 h-3.5" /> Lịch sử HĐ
                      </button>
                    </>
                  ) : !hasToggleSwitch ? (
                    <>
                      <button onClick={() => setDataFilter('chart')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'chart' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <BarChart3 className="w-3.5 h-3.5" /> Biểu đồ thông số
                      </button>
                      <button onClick={() => setDataFilter('alert')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'alert' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Bell className="w-3.5 h-3.5" /> Lịch sử cảnh báo
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setDataFilter('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'history' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Clock className="w-3.5 h-3.5" /> Lịch sử bật/tắt
                      </button>
                      <button onClick={() => setDataFilter('alert')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dataFilter === 'alert' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Bell className="w-3.5 h-3.5" /> Báo cáo lỗi
                      </button>
                    </>
                  )}
                </div>

                {dataFilter !== 'camera' && (
                  <div className="flex gap-2">
                    {['1D', '7D', '1M'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setTimeFilter(t)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-colors ${timeFilter === t ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/5 bg-transparent text-slate-500 hover:border-white/20'}`}
                      >
                        {t === '1D' ? '1 Ngày' : t === '7D' ? '7 Ngày' : '1 Tháng'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RENDER NỘI DUNG TƯƠNG ỨNG VỚI TAB */}
              {dataFilter === 'camera' && isCamera ? (
                // VIEW CAMERA YOUTUBE
                <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 bg-black relative shadow-inner">
                  {/* YouTube Iframe với thông số autoplay, mute, loop */}
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&loop=1&controls=0" 
                    title="Camera Feed" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full object-cover scale-150 pointer-events-none"
                  ></iframe>
                  {/* Chấm đỏ REC */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-md backdrop-blur-md border border-white/10">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">REC</span>
                  </div>
                </div>
              ) : (
                // VIEW CHART/HISTORY TRỐNG
                <div className="flex-1 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-slate-500 bg-black/20">
                  <BarChart3 className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm font-medium">Khu vực hiển thị <br/> Dữ liệu / Biểu đồ API 3D</p>
                </div>
              )}

            </div>
          </>
        )}
      </aside>

      {/* CANVAS MÔ HÌNH 3D NẰM Ở LỚP DƯỚI */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Environment preset="city" />
          <Suspense fallback={<Html center><div className="text-white font-bold animate-pulse">Đang tải mô hình...</div></Html>}>
            <group scale={1.3} rotation={[0, Math.PI, 0]} position={[0, 0, 0]}>
              <HouseModel />
              
              {filteredSensors.map((sensor) => {
                const Icon = sensor.icon;
                const isSelected = selectedSensor?.id === sensor.id;
                
                return (
                  <Html key={sensor.id} position={sensor.position} center zIndexRange={[100, 0]}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSensor(sensor);
                      }}
                      className={`relative group cursor-pointer transition-all duration-300 hover:scale-150 hover:z-20 outline-none
                        ${isSelected ? 'scale-150 z-20' : ''}
                      `}
                    >
                      {(sensor.type === 'security' || sensor.type === 'safety') && (
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-60 ${getTypeColor(sensor.type)}`}></div>
                      )}
                      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white shadow-xl border-2 transition-all
                        ${isSelected ? 'border-white ring-4 ring-white/30' : 'border-white/80'} 
                        ${getTypeColor(sensor.type)}
                      `}>
                        <Icon className="w-4 h-4 drop-shadow-md" />
                      </div>
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900/95 backdrop-blur text-white text-xs font-bold rounded-lg transition-opacity whitespace-nowrap border border-slate-700 shadow-2xl pointer-events-none
                        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                      `}>
                        {sensor.name}
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