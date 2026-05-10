import { useState } from 'react';
import { 
  Thermometer, Camera, DoorClosed, Activity, Flame, 
  Lightbulb, Shield, Wind, Server, Zap, Map, Pencil, PlusCircle, 
  ZoomIn, ZoomOut, Maximize, Lock, Mic, AppWindow, Tv, Sun, Bell, MousePointer2,Blinds
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// DANH SÁCH SENSOR ĐÃ CẬP NHẬT TỌA ĐỘ CHUẨN XÁC V2
const MOCK_SENSORS = [
  // 🚪 CỬA CHÍNH (Gộp chung Reed Switch & Smart Lock)
  { id: 'c1', name: 'Cửa chính & Smart Lock', type: 'security', room: 'Cửa chính', x: 29.29, y: 74.86, value: 'Đã khóa', status: 'An toàn', isSimulated: false, icon: DoorClosed },
  { id: 'c2', name: 'Camera ESP32-S3', type: 'security', room: 'Cửa chính', x: 26.81, y: 69.49, value: 'Đang ghi', status: 'Bình thường', isSimulated: false, icon: Camera },
  { id: 'c3', name: 'PIR Cửa chính', type: 'security', room: 'Cửa chính', x: 22.11, y: 74.91, value: 'Trống', status: 'Bình thường', isSimulated: false, icon: Activity },

  // 🛋️ PHÒNG KHÁCH + BẾP
  { id: 'pk1', name: 'Đèn trần trước', type: 'appliance', room: 'Phòng Khách', x: 25.04, y: 75.16, value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  { id: 'pk2', name: 'Đèn trần sau', type: 'appliance', room: 'Phòng Khách', x: 34.11, y: 73.70, value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'pk3', name: 'Đèn trần P.Khách', type: 'appliance', room: 'Phòng Khách', x: 42.08, y: 75.39, value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'pk4', name: 'Đèn phòng ăn', type: 'appliance', room: 'Phòng Khách', x: 57.78, y: 74.92, value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  { id: 'pk5', name: 'Đèn bếp', type: 'appliance', room: 'Bếp', x: 58.44, y: 54.42, value: 'Bật', status: 'Hoạt động', isSimulated: true, icon: Lightbulb },
  { id: 'pk6', name: 'PIR Khách/Bếp', type: 'security', room: 'Phòng Khách', x: 49.84, y: 75.88, value: 'Có người', status: 'Cảnh báo', isSimulated: false, icon: Activity },
  { id: 'pk7', name: 'DHT22 (Nhiệt/Ẩm)', type: 'environment', room: 'Phòng Khách', x: 50.52, y: 46.05, value: '25°C / 55%', status: 'Bình thường', isSimulated: false, icon: Thermometer },
  { id: 'pk8', name: 'Khí MQ-135', type: 'environment', room: 'Bếp', x: 54.34, y: 61.87, value: 'Sạch', status: 'An toàn', isSimulated: false, icon: Wind },
  { id: 'pk9', name: 'Cảm biến Lửa', type: 'safety', room: 'Bếp', x: 61.80, y: 62.02, value: 'Không có lửa', status: 'An toàn', isSimulated: false, icon: Flame },
  // Gộp chung Voice Sensor và Micro MAX9814
  { id: 'pk10', name: 'Cảm biến Âm thanh & Mic', type: 'environment', room: 'Phòng Khách', x: 33.67, y: 67.66, value: '45 dB', status: 'Yên tĩnh', isSimulated: false, icon: Mic },

  // 🧭 HÀNH LANG
  { id: 'hl1', name: 'PIR Hành lang', type: 'security', room: 'Hành Lang', x: 48.02, y: 35.03, value: 'Trống', status: 'Bình thường', isSimulated: false, icon: Activity },
  { id: 'hl2', name: 'Đèn hành lang', type: 'appliance', room: 'Hành Lang', x: 47.45, y: 50.66, value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },

  // 🛏️ PHÒNG NGỦ 1
  { id: 'pn1_1', name: 'Đèn PN1', type: 'appliance', room: 'Phòng Ngủ 1', x: 36.34, y: 46.68, value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'pn1_2', name: 'Lửa PN1', type: 'safety', room: 'Phòng Ngủ 1', x: 43.60, y: 44.65, value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'pn1_3', name: 'Cửa sổ PN1', type: 'security', room: 'Phòng Ngủ 1', x: 32.47, y: 34.25, value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },

  // 🛏️ PHÒNG NGỦ 2
  { id: 'pn2_1', name: 'Đèn PN2', type: 'appliance', room: 'Phòng Ngủ 2', x: 42.50, y: 17.98, value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'pn2_2', name: 'Lửa PN2', type: 'safety', room: 'Phòng Ngủ 2', x: 48.43, y: 30.49, value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'pn2_3', name: 'Cửa sổ PN2', type: 'security', room: 'Phòng Ngủ 2', x: 42.23, y: 4.93, value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },

  // 🛏️ PHÒNG NGỦ 3
  { id: 'pn3_1', name: 'Đèn PN3', type: 'appliance', room: 'Phòng Ngủ 3', x: 63.83, y: 18.19, value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'pn3_2', name: 'Lửa PN3', type: 'safety', room: 'Phòng Ngủ 3', x: 57.78, y: 22.49, value: 'An toàn', status: 'Bình thường', isSimulated: false, icon: Flame },
  { id: 'pn3_3', name: 'Cửa sổ PN3', type: 'security', room: 'Phòng Ngủ 3', x: 71.04, y: 19.17, value: 'Đóng', status: 'An toàn', isSimulated: true, icon: AppWindow },

  // 🌿 BAN CÔNG
  { id: 'bc1_1', name: 'Cửa Ban công 1', type: 'security', room: 'Ban Công 1', x: 65.93, y: 71.70, value: 'Khóa', status: 'An toàn', isSimulated: true, icon: DoorClosed },
  { id: 'bc1_2', name: 'Đèn Ban công 1', type: 'appliance', room: 'Ban Công 1', x: 70.65, y: 74.27, value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'bc2_1', name: 'Cửa Ban công 2', type: 'security', room: 'Ban Công 2', x: 73.26, y: 46.39, value: 'Mở', status: 'Cảnh báo', isSimulated: true, icon: DoorClosed },
  { id: 'bc2_2', name: 'Đèn Ban công 2', type: 'appliance', room: 'Ban Công 2', x: 70.41, y: 37.59, value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },

  { id: 'bc1_3', name: 'Rèm Ban công 1', type: 'appliance', room: 'Ban Công 1', x: 65.93, y: 80.59, value: 'Đang mở (50%)', status: 'Hoạt động', isSimulated: true, icon: Blinds },

  // 🚿 NHÀ VỆ SINH
  { id: 'wc1', name: 'Đèn WC 1', type: 'appliance', room: 'WC 1', x: 70.93, y: 56.14, value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'wc2', name: 'Đèn WC 2', type: 'appliance', room: 'WC 2', x: 57.21, y: 38.64, value: 'Tắt', status: 'Bình thường', isSimulated: true, icon: Lightbulb },
  { id: 'wc3', name: 'Đèn WC 3', type: 'appliance', room: 'WC 3', x: 54.03, y: 16.42, value: 'Bật', status: 'Bình thường', isSimulated: true, icon: Lightbulb },

  // ⚡ TOÀN HỆ THỐNG (GLOBAL)
  { id: 'gl1', name: 'Cảm biến TV', type: 'appliance', room: 'Toàn hệ thống', x: 39.66, y: 88.92, value: 'TV Tắt', status: 'Bình thường', isSimulated: false, icon: Tv },
  { id: 'gl2', name: 'Cảm biến Ánh sáng', type: 'environment', room: 'Toàn hệ thống', x: 55.37, y: 89.82, value: 'Sáng', status: 'Bình thường', isSimulated: false, icon: Sun },
  { id: 'gl3', name: 'Còi Buzzer', type: 'safety', room: 'Toàn hệ thống', x: 35.64, y: 81.42, value: 'Im lặng', status: 'Sẵn sàng', isSimulated: false, icon: Bell },
  { id: 'gl4', name: 'Camera AI Toàn Cảnh', type: 'security', room: 'Toàn hệ thống', x: 65.25, y: 89.40, value: 'Đang quét', status: 'Hoạt động', isSimulated: false, icon: Camera },
];

export default function SmartHomeMap() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState(MOCK_SENSORS[0]);
  const [clickedCoord, setClickCoord] = useState({ x: 0, y: 0 });

  const filteredSensors = MOCK_SENSORS.filter(s => activeFilter === 'all' || s.type === activeFilter);

  const getTypeColor = (type) => {
    switch(type) {
      case 'environment': return 'bg-sky-500 shadow-sky-500/50';
      case 'security': return 'bg-rose-500 shadow-rose-500/50';
      case 'safety': return 'bg-amber-500 shadow-amber-500/50';
      case 'appliance': return 'bg-violet-500 shadow-violet-500/50';
      default: return 'bg-slate-500 shadow-slate-500/50';
    }
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickCoord({ x: x.toFixed(2), y: y.toFixed(2) });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      
      {/* 1. LỚP NỀN TĨNH: LƯỚI Ô VUÔNG */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* 2. KHU VỰC BẢN ĐỒ (ZOOM & PAN) */}
      <div className="absolute inset-0 z-10">
        <TransformWrapper
          centerOnInit={false}
          initialScale={1}
          initialPositionX={-50}
          initialPositionY={50}
          minScale={0.3}
          maxScale={5}
          wheel={{ step: 0.001, smoothStep: 1 }} 
          pinch={{ step: 1 }}
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* THANH CÔNG CỤ ZOOM */}
              <div className="absolute bottom-8 left-[40%] -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
                <button onClick={() => zoomOut()} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button onClick={() => resetTransform()} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <Maximize className="w-5 h-5" />
                </button>
                <button onClick={() => zoomIn()} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              {/* VÙNG CHỨA MAP VÀ SENSORS */}
              <TransformComponent wrapperClass="!w-screen !h-screen" contentClass="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                
                <div 
                  className="relative inline-block max-w-[90vw] max-h-[90vh]"
                  onClick={handleMapClick}
                >
                  <img 
                    src="/apartment_map.png" 
                    alt="Bản đồ căn hộ" 
                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] pointer-events-none"
                  />

                  {filteredSensors.map((sensor) => {
                    const Icon = sensor.icon;
                    const isSelected = selectedSensor.id === sensor.id;
                    
                    return (
                      <button
                        key={sensor.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSensor(sensor);
                        }}
                        style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
                        /* SỬA CHÍNH Ở ĐÂY: Loại bỏ việc scale to cố định khi isSelected. Cứ đưa chuột vào (hover) là to ra. */
                        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 group hover:scale-150 hover:z-20"
                      >
                        {(sensor.type === 'security' || sensor.type === 'safety') && (
                          <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${getTypeColor(sensor.type)}`}></div>
                        )}
                        
                        <div className={`relative flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-white shadow-2xl border-2 
                          ${isSelected ? 'border-white ring-4 ring-white/30' : 'border-white/60'} 
                          ${getTypeColor(sensor.type)}
                        `}>
                          <Icon className="w-3 h-3 md:w-4 md:h-4 drop-shadow-md" />
                        </div>

                        {/* SỬA CHÍNH Ở ĐÂY: Tooltip Text sẽ ẩn hoàn toàn, chỉ hiện khi đưa chuột vào (group-hover:opacity-100) */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 rounded bg-slate-900/90 backdrop-blur-sm text-[10px] text-white font-bold tracking-tight transition-opacity whitespace-nowrap border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none">
                          {sensor.name}
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

      {/* =========================================
          3. TRỢ LÝ TỌA ĐỘ VÀ CÁC PANEL CỐ ĐỊNH
      ========================================= */}
      
      {/* Box hiển thị Trạng thái & Trợ lý Tọa độ */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-4 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-white text-sm font-bold tracking-wide uppercase">Digital Twin Live</span>
        </div>

        {/* Khung trợ lý tọa độ */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl shadow-2xl max-w-xs hidden md:block">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <MousePointer2 className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Trợ lý Tọa độ</h4>
          </div>
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
            Click vào bản đồ để lấy `x` và `y` %. Thay vào mảng `MOCK_SENSORS` trong code.
          </p>
          <div className="bg-black/50 p-2 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 flex justify-center gap-4 select-all">
            <span>x: <strong className="text-white">{clickedCoord.x}</strong></span>
            <span>y: <strong className="text-white">{clickedCoord.y}</strong></span>
          </div>
        </div>
      </div>

      {/* Bảng chức năng bên phải */}
      <aside className="absolute top-6 right-6 bottom-6 w-[380px] z-30 flex flex-col gap-4 animate-in slide-in-from-right duration-700 pointer-events-auto">
        
        {/* Bộ lọc mini */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-2xl flex justify-between gap-1">
          {['all', 'security', 'environment', 'appliance'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-1 ${
                activeFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Panel chính hiển thị chi tiết */}
        <div className="flex-1 bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
          
          <div className="p-8 border-b border-white/5">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-3xl ${getTypeColor(selectedSensor.type)} shadow-xl`}>
                <selectedSensor.icon className="w-8 h-8 text-white" />
              </div>
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${selectedSensor.isSimulated ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' : 'text-blue-400 border-blue-400/30 bg-blue-400/10'}`}>
                {selectedSensor.isSimulated ? 'MÔ PHỎNG' : 'LIVE DEVICE'}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white leading-tight mb-1">{selectedSensor.name}</h3>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
              <Map className="w-4 h-4 text-blue-500" />
              {selectedSensor.room}
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-[2rem] border border-white/10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Thông số hiện tại</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tighter">{selectedSensor.value.split(' ')[0]}</span>
                <span className="text-lg font-bold text-blue-500 uppercase">{selectedSensor.value.split(' ')[1] || ''}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Hệ thống</p>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Shield className="w-3 h-3" />
                  <span className="text-xs font-black uppercase tracking-tighter">{selectedSensor.status}</span>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Kết nối</p>
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs font-black uppercase tracking-tighter">
                    {selectedSensor.isSimulated ? 'Virtual' : 'ESP32'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                Cấu hình thiết bị
              </button>
            </div>
          </div>
        </div>

      </aside>
    </div>
  );
}