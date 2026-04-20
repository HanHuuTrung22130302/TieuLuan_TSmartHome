import { useState } from 'react';
import { 
  Thermometer, Camera, DoorClosed, Activity, Flame, 
  Lightbulb, Shield, Wind, Droplets, Info, Server 
} from 'lucide-react';

// DỮ LIỆU GIẢ LẬP (Fake Data) CHO TOÀN BỘ SENSOR
const MOCK_SENSORS = [
  { id: 's1', name: 'Nhiệt độ & Độ ẩm', type: 'environment', room: 'Phòng Khách', x: 20, y: 30, value: '26°C / 60%', status: 'Bình thường', isSimulated: true, icon: Thermometer },
  { id: 's2', name: 'Camera An Ninh AI', type: 'security', room: 'Phòng Khách', x: 10, y: 10, value: 'Đang ghi hình', status: 'Bình thường', isSimulated: true, icon: Camera },
  { id: 's3', name: 'Cửa chính (ESP32)', type: 'security', room: 'Hành Lang', x: 45, y: 85, value: 'Đóng', status: 'An toàn', isSimulated: false, icon: DoorClosed },
  { id: 's4', name: 'Cảm biến chuyển động', type: 'security', room: 'Phòng Ngủ', x: 75, y: 25, value: 'Không có người', status: 'Bình thường', isSimulated: true, icon: Activity },
  { id: 's5', name: 'Báo khói & Gas', type: 'safety', room: 'Bếp', x: 80, y: 75, value: '0 ppm', status: 'An toàn', isSimulated: true, icon: Flame },
  { id: 's6', name: 'Đèn trần (ESP32)', type: 'appliance', room: 'Phòng Khách', x: 30, y: 45, value: 'Bật (70%)', status: 'Đang hoạt động', isSimulated: false, icon: Lightbulb },
  { id: 's7', name: 'Điều hòa thông minh', type: 'appliance', room: 'Phòng Ngủ', x: 60, y: 15, value: 'Chế độ Auto', status: 'Đang tắt', isSimulated: true, icon: Wind },
];

export default function SmartHomeMap() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState(MOCK_SENSORS[0]); // Mặc định chọn sensor đầu tiên

  // Lọc sensor theo phân loại
  const filteredSensors = MOCK_SENSORS.filter(s => activeFilter === 'all' || s.type === activeFilter);

  // Lấy màu sắc dựa theo loại sensor
  const getTypeColor = (type) => {
    switch(type) {
      case 'environment': return 'bg-blue-500 shadow-blue-500/50';
      case 'security': return 'bg-rose-500 shadow-rose-500/50';
      case 'safety': return 'bg-orange-500 shadow-orange-500/50';
      case 'appliance': return 'bg-yellow-500 shadow-yellow-500/50';
      default: return 'bg-slate-500 shadow-slate-500/50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Bản đồ không gian (Digital Twin)</h3>
          <p className="text-slate-500 text-sm mt-1">Sơ đồ bố trí cảm biến và trạng thái theo thời gian thực.</p>
        </div>

        {/* BỘ LỌC */}
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'security', label: 'An ninh' },
            { id: 'environment', label: 'Môi trường' },
            { id: 'safety', label: 'An toàn' },
            { id: 'appliance', label: 'Thiết bị' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === f.id 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* =========================================
            BÊN TRÁI: BẢN ĐỒ SVG 2D INTERACTIVE
        ========================================= */}
        <div className="lg:w-2/3 bg-slate-50 rounded-2xl border border-slate-200 p-4 relative flex items-center justify-center overflow-hidden min-h-[400px]">
          
          {/* VÙNG CHỨA BẢN ĐỒ (Giữ tỷ lệ vuông hoặc chữ nhật để tọa độ % không bị méo) */}
          <div className="relative w-full max-w-lg aspect-[4/3] bg-slate-200 rounded-xl shadow-inner border-4 border-slate-300">
            
            {/* HÌNH VẼ MẶT BẰNG BẰNG SVG */}
            <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Phòng Khách (Trái trên) */}
              <rect x="0" y="0" width="55" height="60" fill="white" stroke="currentColor" strokeWidth="1" />
              <text x="27.5" y="30" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">Phòng Khách</text>
              
              {/* Hành Lang (Trái dưới) */}
              <rect x="0" y="60" width="55" height="40" fill="#f8fafc" stroke="currentColor" strokeWidth="1" />
              <text x="27.5" y="80" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">Hành Lang</text>
              
              {/* Phòng Ngủ (Phải trên) */}
              <rect x="55" y="0" width="45" height="50" fill="white" stroke="currentColor" strokeWidth="1" />
              <text x="77.5" y="25" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">Phòng Ngủ</text>
              
              {/* Bếp (Phải dưới) */}
              <rect x="55" y="50" width="45" height="50" fill="#f8fafc" stroke="currentColor" strokeWidth="1" />
              <text x="77.5" y="75" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">Bếp</text>

              {/* Các cửa ra vào giả lập (Đường màu xám đậm) */}
              <line x1="25" y1="60" x2="35" y2="60" stroke="#475569" strokeWidth="2" /> {/* Cửa PK -> Hành lang */}
              <line x1="55" y1="20" x2="55" y2="30" stroke="#475569" strokeWidth="2" /> {/* Cửa PK -> PN */}
              <line x1="55" y1="70" x2="55" y2="80" stroke="#475569" strokeWidth="2" /> {/* Cửa HL -> Bếp */}
            </svg>

            {/* HIỂN THỊ CÁC NODE SENSOR (Lọc qua filter) */}
            {filteredSensors.map((sensor) => {
              const Icon = sensor.icon;
              const isSelected = selectedSensor.id === sensor.id;
              
              return (
                <button
                  key={sensor.id}
                  onClick={() => setSelectedSensor(sensor)}
                  style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 group
                    ${isSelected ? 'scale-125 z-20' : 'hover:scale-110'}
                  `}
                >
                  {/* Vòng sáng nhấp nháy cho thiết bị An ninh/An toàn */}
                  {(sensor.type === 'security' || sensor.type === 'safety') && (
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${getTypeColor(sensor.type)}`}></div>
                  )}
                  
                  {/* Icon Sensor */}
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white shadow-lg border-2 
                    ${isSelected ? 'border-white' : 'border-transparent'} 
                    ${getTypeColor(sensor.type)}
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Tooltip khi hover */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {sensor.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================
            BÊN PHẢI: BẢNG CHI TIẾT SENSOR (SIDE PANEL)
        ========================================= */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            {/* Background pattern mờ */}
            <div className="absolute -right-10 -top-10 opacity-10">
              <selectedSensor.icon className="w-48 h-48" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${getTypeColor(selectedSensor.type)}`}>
                  <selectedSensor.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">{selectedSensor.name}</h4>
                  <p className="text-slate-400 text-sm">{selectedSensor.room}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Trạng thái hiện tại</p>
                  <p className="text-2xl font-bold text-white">{selectedSensor.value}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-slate-400 text-xs mb-1">Hệ thống</p>
                    <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {selectedSensor.status}
                    </p>
                  </div>
                  
                  {/* NHÃN THỰC TẾ vs MÔ PHỎNG (Rất quan trọng cho đồ án) */}
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-slate-400 text-xs mb-1">Nguồn dữ liệu</p>
                    {selectedSensor.isSimulated ? (
                      <p className="text-sm font-semibold text-yellow-400 flex items-center gap-1">
                        <Server className="w-3 h-3" /> Mô phỏng
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-blue-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> ESP32 thật
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông báo giải thích */}
              {selectedSensor.isSimulated && (
                <div className="mt-6 flex items-start gap-2 text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs">Thiết bị này đang sử dụng dữ liệu giả lập (Mock Data) để trình diễn tính năng logic của hệ thống.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Nút hành động giả lập */}
          <button className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-semibold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-colors">
            + Thêm cảm biến mới vào bản đồ
          </button>

        </div>
      </div>
    </div>
  );
}