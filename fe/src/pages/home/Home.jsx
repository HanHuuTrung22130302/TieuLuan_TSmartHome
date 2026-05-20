import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Mic, ChevronDown, Wind, Droplets, Sun, 
  MapPin, CloudRain, Navigation, ShieldCheck, Activity,
  Flame, Thermometer, Radar, Volume2, AlertTriangle, 
  CheckCircle2, Clock, Wifi, Maximize, Video, ChevronLeft, ChevronRight
} from 'lucide-react';
import useWeather from '../../hooks/useWeather'; 
import { getRecentLogs } from '../../services/api/log';
import wsService from '../../services/api/wsService';
import { getDeviceInfo } from '../../utils/deviceMapper';

export default function Home() {
  const weather = useWeather();
  const [currentDate, setCurrentDate] = useState('');
  const [timeFilter, setTimeFilter] = useState('12H'); 
  const [moduleFilter, setModuleFilter] = useState('all');
  
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('vi-VN', dateOptions));
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      const result = await getRecentLogs(timeFilter, moduleFilter, page, 10);
      if (result && result.code === 1000 && result.data) {
        setLogs(result.data.content);
        setTotalPages(result.data.totalPages);
      }
    };
    fetchLogs();
  }, [timeFilter, moduleFilter, page]);

  useEffect(() => {
    wsService.connect((rawData) => {
      const dateObj = new Date(rawData.timestamp * 1000);
      const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour12: false });
      const dateStr = dateObj.toLocaleDateString('vi-VN');
      const deviceInfo = getDeviceInfo(rawData.deviceId);

      const newLog = {
        id: Date.now() + Math.random(),
        deviceId: rawData.deviceId,
        deviceName: deviceInfo.name,
        value: rawData.value,
        status: rawData.status,
        time: timeStr,
        date: dateStr,
        type: deviceInfo.type
      };

      setLogs(prevLogs => {
        if (moduleFilter !== 'all' && newLog.type !== moduleFilter) return prevLogs;
        if (page !== 0) return prevLogs;
        return [newLog, ...prevLogs].slice(0, 10);
      });
    });

    return () => {
      wsService.disconnect();
    };
  }, [moduleFilter, page]);

  const handleFilterChange = (type, value) => {
    if (type === 'module') setModuleFilter(value);
    if (type === 'time') setTimeFilter(value);
    setPage(0);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
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
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/5 shrink-0">
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

  const getLogStyle = (log) => {
    if (log.status === 'Nguy hiểm' || log.status === 'Cảnh báo') return { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
    if (log.status === 'An toàn') return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (log.type === 'audio') return { icon: Volume2, color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/5' };
    if (log.type === 'temp') return { icon: Thermometer, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' };
    if (log.type === 'gas') return { icon: Wind, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    if (log.type === 'radar') return { icon: Radar, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/30' };
    
    return { icon: Activity, color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/5' };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto overflow-x-hidden font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-1">{currentDate}</p>
          <h2 className="text-3xl font-bold tracking-tight">Welcome <span className="font-normal">Trung</span></h2>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5 flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 mr-3" />
            <input type="text" placeholder="Tìm kiếm hệ thống..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500" />
          </div>
          <button className="p-3 bg-white text-black rounded-full hover:bg-slate-200 transition-colors shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Mic className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1 pr-4 shrink-0 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Trung" alt="avatar" />
            </div>
            <span className="text-sm font-medium">Trung Hán Hữu</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl flex flex-col h-[600px] xl:h-[calc(100vh-10rem)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" /> Nhật ký Hoạt động
                </h3>
                <p className="text-sm text-slate-500 mt-1">Dữ liệu từ payload cảm biến (Real-time)</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select 
                    value={moduleFilter}
                    onChange={(e) => handleFilterChange('module', e.target.value)}
                    className="appearance-none bg-black border border-white/10 text-slate-300 text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 outline-none cursor-pointer focus:border-blue-500 transition-colors"
                  >
                    <option value="all">Tất cả Module</option>
                    <option value="radar">Radar</option>
                    <option value="environment">Môi trường</option>
                    <option value="safety">An toàn (Lửa/Khí)</option>
                    <option value="security">An ninh (Cửa/PIR)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                <div className="flex bg-black border border-white/10 rounded-xl p-1">
                  {['12H', '1D', '7D'].map(t => (
                    <button 
                      key={t}
                      onClick={() => handleFilterChange('time', t)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${timeFilter === t ? 'bg-[#e8f5a1] text-black shadow-md' : 'text-slate-500 hover:text-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
              {logs.length > 0 ? logs.map((log, idx) => {
                const style = getLogStyle(log);
                const LogIcon = style.icon;
                
                return (
                  <div key={log.id || idx} className={`flex items-start gap-4 p-4 rounded-2xl border ${style.border} bg-white/5 hover:bg-white/10 transition-colors cursor-default`}>
                    <div className={`p-3 rounded-xl shrink-0 ${style.bg}`}>
                      <LogIcon className={`w-5 h-5 ${style.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                        <h4 className="font-bold text-white text-base truncate">{log.deviceName || log.deviceId}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {log.time} <span className="text-slate-600 hidden sm:inline">•</span> {log.date}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${style.bg} ${style.color} border ${style.border}`}>
                          {log.status}
                        </span>
                        <span className="text-sm font-medium text-slate-300 bg-black/30 px-3 py-1 rounded-lg border border-white/5">
                          Payload: <strong className="text-white">{log.value}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <ShieldCheck className="w-12 h-12 mb-3 opacity-20" />
                  <p>Không có dữ liệu nào khớp với bộ lọc.</p>
                </div>
              )}
            </div>

            {renderPagination()}
            
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col gap-6 xl:h-[calc(100vh-10rem)]">
          <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col flex-1 min-h-[200px] relative overflow-hidden group">
            <img 
              src="http://171.227.82.185:81/stream" 
              alt="Live Stream" 
              className="absolute inset-0 w-full h-full object-cover bg-black"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            
            <div className="absolute inset-0 flex-col items-center justify-center bg-slate-900 hidden">
              <Wifi className="w-10 h-10 text-slate-600 mb-3 opacity-50" />
              <p className="text-slate-400 font-bold text-sm">Camera ngoại tuyến</p>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
            
            <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white">LIVE REC</span>
              </div>
              <Link to="/security" className="bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10 hover:bg-white/20 transition-colors text-white z-10">
                <Maximize className="w-4 h-4" />
              </Link>
            </div>

            <div className="absolute bottom-5 left-5 pointer-events-none">
              <h3 className="text-lg font-bold text-white mb-0.5">Cửa chính (ESP32)</h3>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <Video className="w-3 h-3" /> 1600x1200 • 30 FPS
              </p>
            </div>
          </div>

          <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden shrink-0">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                {weather.icon && <weather.icon className="w-10 h-10 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]" />}
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    <span className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Biên Hòa, VN</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-none">Thời tiết</h3>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-black tracking-tighter text-white leading-none">{weather.temp}<span className="text-lg text-slate-500 font-normal">°C</span></h1>
                <p className="text-xs font-medium text-sky-400 capitalize mt-1">{weather.desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
              <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className={`w-4 h-4 ${weather.aqiColor}`} />
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">AQI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${weather.aqiBg} ${weather.aqiColor}`}>
                    {weather.aqiStatus}
                  </span>
                  <span className="text-sm font-bold text-white">{weather.aqi}</span>
                </div>
              </div>

              <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Độ ẩm</span>
                </div>
                <span className="text-sm font-bold text-white">{weather.humidity}%</span>
              </div>

              <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className={`w-4 h-4 ${weather.uvColor}`} />
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Tia UV</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${weather.uvBg} ${weather.uvColor}`}>
                    {weather.uvStatus}
                  </span>
                  <span className="text-sm font-bold text-white">{weather.uv}</span>
                </div>
              </div>

              <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Cảm giác</span>
                </div>
                <span className="text-sm font-bold text-white">{weather.feelsLike}°C</span>
              </div>

              <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-slate-300" />
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Gió</span>
                </div>
                <span className="text-sm font-bold text-white">{weather.windSpeed} <span className="text-[10px] text-slate-500 font-normal">km/h</span></span>
              </div>

              <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Mưa</span>
                </div>
                <span className="text-sm font-bold text-white">{weather.pop}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}