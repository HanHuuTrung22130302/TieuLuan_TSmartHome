import { useState, useEffect } from 'react';
import { 
  ShieldCheck, Flame, Wind, Activity, Radar, Volume2, Thermometer, 
  Clock, MapPin, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Info, Filter, CalendarDays, Bell
} from 'lucide-react';
import { getWarningList, getWarningStats } from '../../services/api/warning';
import wsService from '../../services/api/wsService';
import { getDeviceInfo } from '../../utils/deviceMapper';

export default function Notifications() {
  const [deviceType, setDeviceType] = useState('all');
  const [filterType, setFilterType] = useState('TODAY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ danger: 0, warning: 0 });

  const [viewDate, setViewDate] = useState(new Date());

  const fetchWarnings = async () => {
    let params = { page, deviceType, filterType };
    if (['SPECIFIC_DATE', 'SPECIFIC_MONTH'].includes(filterType) && startDate) {
      params.startDate = startDate;
    } else if (filterType === 'CUSTOM_RANGE' && startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    try {
      const [listRes, statsRes] = await Promise.all([
        getWarningList(params),
        getWarningStats({ deviceType, filterType, startDate: params.startDate, endDate: params.endDate })
      ]);

      if (listRes?.code === 1000) {
        setLogs(listRes.data.content);
        setTotalPages(listRes.data.totalPages);
      }
      if (statsRes?.code === 1000) {
        setStats({
          danger: statsRes.data.dangerCount || 0,
          warning: statsRes.data.warningCount || 0
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, [page, deviceType, filterType, startDate, endDate]);

  useEffect(() => {
    const stompClient = wsService.connect((rawData) => {
      if (filterType !== 'TODAY' || page !== 0) return;

      const dateObj = new Date(rawData.timestamp * 1000);
      const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour12: false });
      const dateStr = dateObj.toLocaleDateString('vi-VN');
      const deviceInfo = getDeviceInfo(rawData.deviceId);

      const newLog = {
        id: Date.now() + Math.random(),
        deviceId: rawData.deviceId,
        deviceName: deviceInfo.name || rawData.deviceId,
        value: rawData.value,
        status: rawData.status,
        time: timeStr,
        date: dateStr,
        type: deviceInfo.type,
        room: rawData.zone || 'Hệ thống'
      };

      if (newLog.status === 'Nguy hiểm') {
        setStats(prev => ({ ...prev, danger: prev.danger + 1 }));
      } else if (newLog.status === 'Cảnh báo') {
        setStats(prev => ({ ...prev, warning: prev.warning + 1 }));
      }

      setLogs(prevLogs => {
        if (deviceType !== 'all' && newLog.type !== deviceType) return prevLogs;
        return [newLog, ...prevLogs].slice(0, 20); 
      });
    });

    return () => {
      wsService.disconnect(stompClient);
    };
  }, [deviceType, filterType, page]);

  useEffect(() => {
    if (filterType === 'SPECIFIC_MONTH') {
      const y = viewDate.getFullYear();
      const m = (viewDate.getMonth() + 1).toString().padStart(2, '0');
      setStartDate(`${y}-${m}`);
      setEndDate('');
      setPage(0);
    }
  }, [viewDate, filterType]);

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const formatDate = (y, m, d) => {
    return `${y}-${(m + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
  };

  const buildCalendar = () => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrevMonth = new Date(y, m, 0).getDate();

    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        date: formatDate(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1, daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        date: formatDate(y, m, i),
        isCurrentMonth: true
      });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        date: formatDate(m === 11 ? y + 1 : y, m === 11 ? 0 : m + 1, i),
        isCurrentMonth: false
      });
    }
    return days;
  };

  const handleDayClick = (clickedDate) => {
    if (filterType === 'CUSTOM_RANGE') {
      if (startDate && !endDate) {
        const d1 = new Date(startDate);
        const d2 = new Date(clickedDate);
        if (d2 < d1) {
          setStartDate(clickedDate);
        } else {
          const diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
          if (diffDays > 92) {
            alert("Không được chọn khoảng thời gian vượt quá 3 tháng!");
            return;
          }
          setEndDate(clickedDate);
          setPage(0);
        }
      } else {
        setStartDate(clickedDate);
        setEndDate('');
      }
    } else {
      setFilterType('SPECIFIC_DATE');
      setStartDate(clickedDate);
      setEndDate('');
      setPage(0);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    let startPage = Math.max(0, page - 2);
    let endPage = Math.min(totalPages - 1, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(0, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
            page === i 
              ? 'bg-blue-600 text-white' 
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 pt-4 shrink-0">
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages}
        <button 
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const getSeverityConfig = (status, type) => {
    if (status === 'Nguy hiểm') return { icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-l-rose-500 border-white/5' };
    if (status === 'Cảnh báo') return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-l-amber-500 border-white/5' };
    if (status === 'An toàn') return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-l-emerald-500 border-white/5' };
    
    let FallbackIcon = Info;
    if (type === 'audio') FallbackIcon = Volume2;
    if (type === 'temp') FallbackIcon = Thermometer;
    if (type === 'gas') FallbackIcon = Wind;
    if (type === 'radar' || type === 'pir') FallbackIcon = Radar;
    
    return { icon: FallbackIcon, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-l-blue-500 border-white/5' };
  };

  const calendarDays = buildCalendar();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-500" /> Trung tâm Thông báo
        </h2>
        <p className="text-slate-500 mt-2">Theo dõi, lọc và phân tích lịch sử cảnh báo an ninh toàn hệ thống.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
        
        {/* ================= CỘT TRÁI: THỐNG KÊ & BỘ LỌC (SIDEBAR) ================= */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Thống kê Card */}
          <div className="flex gap-4 lg:flex-col shrink-0">
            <div className="bg-gradient-to-br from-rose-900/40 to-black border border-rose-500/20 p-5 rounded-3xl relative overflow-hidden flex-1">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2 relative z-10">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Nguy hiểm
              </h3>
              <p className="text-4xl font-black text-white relative z-10">{stats.danger}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/40 to-black border border-amber-500/20 p-5 rounded-3xl relative overflow-hidden flex-1">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2 relative z-10">
                <Activity className="w-4 h-4 text-amber-400" /> Cảnh báo
              </h3>
              <p className="text-4xl font-black text-white relative z-10">{stats.warning}</p>
            </div>
          </div>

          {/* Bộ Lọc Điều hướng */}
          <div className="bg-[#121212] border border-white/5 p-5 rounded-[2rem] flex flex-col gap-5 shadow-xl shrink-0">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-500" /> Bộ Lọc Danh Sách
            </h3>
            
            <div className="flex flex-col gap-4">
              <select 
                value={deviceType}
                onChange={(e) => { setDeviceType(e.target.value); setPage(0); }}
                className="w-full bg-black/40 border border-white/10 text-white text-sm font-bold rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-blue-500 transition-colors appearance-none"
              >
                <option value="all">Tất cả Thiết bị</option>
                <option value="safety">An toàn (PCCC)</option>
                <option value="security">An ninh</option>
                <option value="environment">Môi trường</option>
                <option value="appliance">Đồ điện</option>
                <option value="radar">Radar</option>
              </select>

              <select 
                value={filterType}
                onChange={(e) => handleFilterTypeChange(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white text-sm font-bold rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-blue-500 transition-colors appearance-none"
              >
                <option value="TODAY">Hôm nay</option>
                <option value="LAST_WEEK">7 Ngày qua</option>
                <option value="SPECIFIC_DATE">Ngày cụ thể</option>
                <option value="SPECIFIC_MONTH">Tháng cụ thể</option>
                <option value="CUSTOM_RANGE">Khoảng thời gian</option>
              </select>

              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                  <span className="font-bold text-[13px] text-slate-200">
                    Tháng {viewDate.getMonth() + 1}, {viewDate.getFullYear()}
                  </span>
                  <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                {filterType !== 'SPECIFIC_MONTH' ? (
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                      <div key={d} className="text-[9px] text-slate-500 font-bold py-1">{d}</div>
                    ))}
                    {calendarDays.map((d, i) => {
                      const isSpecific = filterType === 'SPECIFIC_DATE' && startDate === d.date;
                      const isRangeStart = filterType === 'CUSTOM_RANGE' && startDate === d.date;
                      const isRangeEnd = filterType === 'CUSTOM_RANGE' && endDate === d.date;
                      const isRangeBetween = filterType === 'CUSTOM_RANGE' && startDate && endDate && d.date > startDate && d.date < endDate;
                      
                      let styleClass = 'text-slate-300 hover:bg-white/10';
                      if (!d.isCurrentMonth) styleClass = 'text-slate-600 hover:bg-white/5';
                      if (isSpecific || isRangeStart || isRangeEnd) styleClass = 'bg-blue-600 text-white font-bold shadow-md';
                      else if (isRangeBetween) styleClass = 'bg-blue-600/30 text-white font-bold';

                      return (
                        <button 
                          key={i} 
                          onClick={() => handleDayClick(d.date)}
                          className={`p-1.5 text-xs rounded-lg transition-all ${styleClass}`}
                        >
                          {d.day}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-28">
                    <p className="text-xs font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl text-center">
                      Đang hiển thị toàn bộ<br/>Tháng {viewDate.getMonth() + 1}
                    </p>
                  </div>
                )}
              </div>
              
              {filterType === 'CUSTOM_RANGE' && (
                <div className="flex flex-col items-center bg-black/40 border border-white/5 p-3 rounded-xl gap-2">
                  <div className="text-[11px] font-bold text-slate-400 w-full flex justify-between">
                    <span>Từ: {startDate || '--'}</span>
                    <span>Đến: {endDate || '--'}</span>
                  </div>
                  {startDate && !endDate && <p className="text-[10px] text-blue-400 w-full mt-1">Vui lòng chọn ngày kết thúc trên lịch...</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI: KHU VỰC HIỂN THỊ DANH SÁCH ================= */}
        <div className="flex-1 flex flex-col bg-[#121212] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
            {logs.length > 0 ? (
              logs.map((n) => {
                const config = getSeverityConfig(n.status, n.type);
                const Icon = config.icon;

                // Thẻ thông báo được làm phẳng (flat), nhấn nhá bằng thanh màu ở cạnh trái
                return (
                  <div key={n.id} className={`flex items-center gap-4 py-4 px-5 rounded-2xl bg-white/[0.02] border-l-4 border-y border-r transition-colors hover:bg-white/[0.04] ${config.border}`}>
                    <div className={`p-3 rounded-xl shrink-0 ${config.bg}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-200 truncate">
                            {n.deviceName || n.deviceId}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${config.bg} ${config.color}`}>
                            {n.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {n.room}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" /> {n.time} - {n.date}
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg border border-white/5 shrink-0 self-start md:self-auto">
                        <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`}></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payload:</span>
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
          
          <div className="p-4 border-t border-white/5 bg-black/20">
            {renderPagination()}
          </div>
        </div>

      </div>
    </div>
  );
}