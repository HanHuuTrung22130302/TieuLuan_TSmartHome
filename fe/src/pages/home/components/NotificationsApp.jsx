import { useState, useEffect } from 'react';
import { 
  ShieldCheck, Flame, Wind, Activity, Radar, Volume2, Thermometer, 
  Clock, MapPin, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Info, Filter, Bell
} from 'lucide-react';
import { getWarningList, getWarningStats } from '../../../services/api/warning';
import wsService from '../../../services/api/wsService';
import { getDeviceInfo } from '../../../utils/deviceMapper';

export default function NotificationsApp() {
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
    <div className="flex flex-col lg:flex-row h-full text-white font-sans p-4 gap-4 overflow-hidden">
      {/* Left calendar & stats sidebar */}
      <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0 overflow-y-auto pr-1 pb-1">
        {/* Stats card */}
        <div className="flex gap-2 flex-row lg:flex-col shrink-0">
          <div className="bg-gradient-to-br from-rose-900/30 to-black border border-rose-500/15 p-3 rounded-2xl flex-1">
            <h3 className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Nguy hiểm
            </h3>
            <p className="text-xl font-black text-white">{stats.danger}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-900/30 to-black border border-amber-500/15 p-3 rounded-2xl flex-1">
            <h3 className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 mb-1">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Cảnh báo
            </h3>
            <p className="text-xl font-black text-white">{stats.warning}</p>
          </div>
        </div>

        {/* Filter block */}
        <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex flex-col gap-3.5 shrink-0">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-500" /> Bộ Lọc Cảnh báo
          </h3>

          <div className="flex flex-col gap-2.5">
            <select 
              value={deviceType}
              onChange={(e) => { setDeviceType(e.target.value); setPage(0); }}
              className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-blue-500"
            >
              <option value="all">Mọi Loại Thiết bị</option>
              <option value="safety">An toàn (PCCC)</option>
              <option value="security">An ninh</option>
              <option value="environment">Môi trường</option>
              <option value="appliance">Đồ điện</option>
              <option value="radar">Radar</option>
            </select>

            <select 
              value={filterType}
              onChange={(e) => handleFilterTypeChange(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-blue-500"
            >
              <option value="TODAY">Hôm nay</option>
              <option value="LAST_WEEK">7 Ngày qua</option>
              <option value="SPECIFIC_DATE">Ngày cụ thể</option>
              <option value="SPECIFIC_MONTH">Tháng cụ thể</option>
              <option value="CUSTOM_RANGE">Khoảng thời gian</option>
            </select>

            {/* Calendar widget */}
            <div className="bg-black/20 border border-white/5 p-2 rounded-xl flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-0.5 hover:bg-white/10 rounded transition-colors cursor-pointer">
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <span className="font-bold text-[10px] text-slate-200">
                  T{viewDate.getMonth() + 1}, {viewDate.getFullYear()}
                </span>
                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-0.5 hover:bg-white/10 rounded transition-colors cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {filterType !== 'SPECIFIC_MONTH' ? (
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {['2', '3', '4', '5', '6', '7', 'C'].map(d => (
                    <div key={d} className="text-[7px] text-slate-500 font-bold py-0.5">{d}</div>
                  ))}
                  {calendarDays.map((d, i) => {
                    const isSpecific = filterType === 'SPECIFIC_DATE' && startDate === d.date;
                    const isRangeStart = filterType === 'CUSTOM_RANGE' && startDate === d.date;
                    const isRangeEnd = filterType === 'CUSTOM_RANGE' && endDate === d.date;
                    const isRangeBetween = filterType === 'CUSTOM_RANGE' && startDate && endDate && d.date > startDate && d.date < endDate;
                    
                    let styleClass = 'text-slate-300 hover:bg-white/5';
                    if (!d.isCurrentMonth) styleClass = 'text-slate-600';
                    if (isSpecific || isRangeStart || isRangeEnd) styleClass = 'bg-blue-600 text-white font-bold rounded shadow';
                    else if (isRangeBetween) styleClass = 'bg-blue-600/30 text-white font-bold rounded';

                    return (
                      <button 
                        key={i} 
                        onClick={() => handleDayClick(d.date)}
                        className={`p-1 text-[8px] transition-all cursor-pointer ${styleClass}`}
                      >
                        {d.day}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-16">
                  <p className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg text-center">
                    Tháng {viewDate.getMonth() + 1}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Warning Logs Table/List Container */}
      <div className="flex-1 flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden min-h-0">
        <div className="flex items-center justify-between p-3.5 pb-2 shrink-0 border-b border-white/5 bg-black/10">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-blue-500" /> Danh sách Cảnh báo
          </h3>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 bg-black/40 border border-white/5 rounded-lg p-0.5 shrink-0">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1 rounded bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-[9px] font-bold font-mono px-1.5 text-slate-400">
                {page + 1}/{totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1 rounded bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Warning Logs List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          {logs.length > 0 ? (
            logs.map((n) => {
              const config = getSeverityConfig(n.status, n.type);
              const Icon = config.icon;

              return (
                <div key={n.id} className={`flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/[0.02] border-l-4 border-y border-r transition-colors hover:bg-white/[0.04] ${config.border}`}>
                  <div className={`p-2 rounded-lg shrink-0 ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-200 truncate">{n.deviceName || n.deviceId}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${config.bg} ${config.color}`}>
                          {n.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                        <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {n.room}</span>
                        <span className="font-mono text-slate-600">•</span>
                        <span className="font-mono">{n.time} - {n.date}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/5 shrink-0 self-start sm:self-auto text-[10px]">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mr-1">Payload:</span>
                      <strong className="text-white font-mono">{n.value}</strong>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <ShieldCheck className="w-10 h-10 mb-2 opacity-20" />
              <h4 className="font-bold text-white mb-1">Không có cảnh báo</h4>
              <p className="text-slate-400 text-center max-w-xs">Hệ thống đang hoạt động an toàn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
