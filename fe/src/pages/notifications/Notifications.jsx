import { useState, useMemo } from 'react';
import { 
  Bell, AlertTriangle, Info, CheckCircle2, ShieldCheck, 
  Flame, Wind, Activity, Radar, Volume2, Thermometer, 
  Clock, MapPin, Search, Filter, Trash2, CheckCircle
} from 'lucide-react';

// DỮ LIỆU MOCK TỪ PAYLOAD SQL CỦA BẠN
const MOCK_NOTIFICATIONS = [
  { id: 5146, deviceId: "kitchen_sensor_mq135", room: "Bếp", title: "Phát hiện Khí độc", value: "Khí độc", status: "Nguy hiểm", time: "22:27:45", date: "10/05/2026", type: "gas", isRead: false },
  { id: 5362, deviceId: "hallway_sensor_radar", room: "Hành Lang", title: "Cảnh báo Xâm nhập", value: "Có vật thể tại Block 1 (8.4m)", status: "Cảnh báo", time: "22:44:55", date: "10/05/2026", type: "radar", isRead: false },
  { id: 5144, deviceId: "entrance_sensor_pir", room: "Cửa chính", title: "Phát hiện Chuyển động", value: "Có người", status: "Cảnh báo", time: "22:27:40", date: "10/05/2026", type: "pir", isRead: false },
  { id: 5122, deviceId: "kitchen_sensor_flame", room: "Bếp", title: "BÁO CHÁY: Có Lửa", value: "CÓ LỬA", status: "Nguy hiểm", time: "22:26:04", date: "10/05/2026", type: "flame", isRead: true },
  { id: 5123, deviceId: "kitchen_sensor_flame", room: "Bếp", title: "Đã dập tắt lửa", value: "Không có lửa", status: "An toàn", time: "22:26:04", date: "10/05/2026", type: "flame", isRead: true },
  { id: 5145, deviceId: "livingroom_sensor_dht22", room: "Phòng Khách", title: "Nhiệt độ phòng tăng cao", value: "36.1°C / 53.0%", status: "Bình thường", time: "22:27:44", date: "10/05/2026", type: "temp", isRead: true },
  { id: 5363, deviceId: "livingroom_sensor_audio", room: "Phòng Khách", title: "Cập nhật tiếng ồn", value: "30 dB", status: "Yên tĩnh", time: "22:45:00", date: "10/05/2026", type: "audio", isRead: true },
];

export default function Notifications() {
  const [filterSeverity, setFilterSeverity] = useState('all'); // all, danger, warning, info
  const [searchQuery, setSearchQuery] = useState('');
  
  // State giả lập đánh dấu đã đọc
  const [readIds, setReadIds] = useState(MOCK_NOTIFICATIONS.filter(n => n.isRead).map(n => n.id));

  // Hàm chọn Style theo Status của Payload
  const getSeverityConfig = (status, type) => {
    if (status === 'Nguy hiểm') return { icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', tag: 'Nguy hiểm' };
    if (status === 'Cảnh báo') return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', tag: 'Cảnh báo' };
    if (status === 'An toàn') return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', tag: 'An toàn' };
    
    // Các trạng thái còn lại (Yên tĩnh, Bình thường) quy về Info
    let FallbackIcon = Info;
    if (type === 'audio') FallbackIcon = Volume2;
    if (type === 'temp') FallbackIcon = Thermometer;
    
    return { icon: FallbackIcon, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', tag: 'Thông tin' };
  };

  // Lọc dữ liệu
  const filteredNotifs = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter(n => {
      // Lọc theo search
      const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.room.toLowerCase().includes(searchQuery.toLowerCase());
      // Lọc theo mức độ
      let matchSeverity = true;
      if (filterSeverity === 'danger') matchSeverity = n.status === 'Nguy hiểm';
      if (filterSeverity === 'warning') matchSeverity = n.status === 'Cảnh báo';
      if (filterSeverity === 'info') matchSeverity = ['Bình thường', 'Yên tĩnh', 'An toàn'].includes(n.status);
      
      return matchSearch && matchSeverity;
    });
  }, [filterSeverity, searchQuery]);

  // Đếm thống kê
  const stats = useMemo(() => {
    return {
      danger: MOCK_NOTIFICATIONS.filter(n => n.status === 'Nguy hiểm').length,
      warning: MOCK_NOTIFICATIONS.filter(n => n.status === 'Cảnh báo').length,
      unread: MOCK_NOTIFICATIONS.length - readIds.length
    };
  }, [readIds]);

  const handleMarkAllRead = () => {
    setReadIds(MOCK_NOTIFICATIONS.map(n => n.id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-yellow-500" /> Trung tâm Thông báo
          </h2>
          <p className="text-slate-500 mt-2">Bạn có <strong className="text-white">{stats.unread}</strong> thông báo chưa đọc trong ngày hôm nay.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-[#121212] border border-white/10 rounded-2xl px-4 py-3 flex-1 md:w-80 focus-within:border-blue-500 transition-colors shadow-lg">
            <Search className="w-4 h-4 text-slate-500 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Tìm kiếm thông báo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
            />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        
        {/* CỘT TRÁI: DANH SÁCH THÔNG BÁO (Chiếm 2/3) */}
        <div className="xl:col-span-2 flex flex-col bg-[#121212] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          
          {/* Action Bar (Top) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'danger', label: 'Nguy hiểm' },
                { id: 'warning', label: 'Cảnh báo' },
                { id: 'info', label: 'Thông tin' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterSeverity(f.id)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                    filterSeverity === f.id ? 'bg-white/15 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Đánh dấu đã đọc
            </button>
          </div>

          {/* List Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((n) => {
                const config = getSeverityConfig(n.status, n.type);
                const Icon = config.icon;
                const isUnread = !readIds.includes(n.id);

                return (
                  <div 
                    key={n.id} 
                    onClick={() => { if(isUnread) setReadIds([...readIds, n.id]) }}
                    className={`relative flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer group ${
                      isUnread 
                        ? `${config.bg} border-transparent shadow-lg` 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white-[0.04]'
                    }`}
                  >
                    {/* Unread Dot Indicator */}
                    {isUnread && (
                      <div className={`absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full ${config.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}></div>
                    )}

                    {/* Icon */}
                    <div className={`p-3 rounded-xl shrink-0 ${isUnread ? 'bg-black/20' : config.bg}`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1.5">
                        <h4 className={`font-bold text-lg truncate ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                          {n.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono shrink-0">
                          <Clock className="w-3 h-3" />
                          {n.time} <span className="hidden sm:inline">•</span> {n.date}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-sm font-medium text-slate-400">{n.room}</span>
                      </div>

                      {/* Payload Bubble */}
                      <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                        <span className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`}></span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payload:</span>
                        <strong className="text-sm text-white">{n.value}</strong>
                      </div>
                    </div>
                    
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                <h4 className="text-xl font-bold text-white mb-2">Không có thông báo</h4>
                <p className="text-sm text-center max-w-sm">Hệ thống đang hoạt động ổn định. Không có dữ liệu nào khớp với bộ lọc hiện tại.</p>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: THỐNG KÊ (Chiếm 1/3) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-rose-900/40 to-black border border-rose-500/20 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Cảnh báo Khẩn cấp
              </h3>
            </div>
            <div className="relative z-10">
              <p className="text-5xl font-black text-white">{stats.danger} <span className="text-lg font-medium text-rose-400">sự cố</span></p>
              <p className="text-sm text-slate-400 mt-2">Cần kiểm tra ngay lập tức các module có trạng thái <span className="text-rose-400 font-bold">Nguy hiểm</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-900/40 to-black border border-amber-500/20 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" /> Chú ý An ninh
              </h3>
            </div>
            <div className="relative z-10">
              <p className="text-5xl font-black text-white">{stats.warning} <span className="text-lg font-medium text-amber-400">cảnh báo</span></p>
              <p className="text-sm text-slate-400 mt-2">Ghi nhận các chuyển động và trạng thái <span className="text-amber-400 font-bold">Bất thường</span> từ cảm biến.</p>
            </div>
          </div>

          <div className="flex-1 bg-[#121212] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <Trash2 className="w-6 h-6 text-slate-500" />
            </div>
            <h4 className="font-bold text-white mb-2">Dọn dẹp Nhật ký</h4>
            <p className="text-xs text-slate-500 mb-6 px-4">Hệ thống sẽ tự động xóa các thông báo "Yên tĩnh/Bình thường" cũ hơn 30 ngày để giải phóng bộ nhớ.</p>
            <button className="px-6 py-2.5 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 rounded-xl font-bold text-sm transition-colors border border-transparent hover:border-rose-500/30">
              Dọn dẹp thủ công
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}