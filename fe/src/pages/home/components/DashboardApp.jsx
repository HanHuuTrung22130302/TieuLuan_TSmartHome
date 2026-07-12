import { useState, useEffect } from 'react';
import { 
  Wind, Droplets, Sun, MapPin, CloudRain, Navigation, 
  Thermometer, AlertTriangle, CheckCircle2, Clock, ShieldCheck, Activity, Volume2, Radar
} from 'lucide-react';
import useWeather from '../../../hooks/useWeather';
import { getRecentLogs } from '../../../services/api/log';
import wsService from '../../../services/api/wsService';
import { getDeviceInfo } from '../../../utils/deviceMapper';

export default function DashboardApp() {
  const weather = useWeather();
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('vi-VN', dateOptions));
  }, []);

  // Fetch initial logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const result = await getRecentLogs('1D', 'all', 0, 10);
        if (result && result.code === 1000 && result.data) {
          setLogs(result.data.content);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  // Stomp client for real-time logs
  useEffect(() => {
    const stompClient = wsService.connect((rawData) => {
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
        return [newLog, ...prevLogs].slice(0, 10);
      });
    });

    return () => {
      wsService.disconnect(stompClient);
    };
  }, []);

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
    <div className="flex flex-col h-full text-white p-4 font-sans gap-5">
      {/* Weather Header */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden shrink-0">
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            {weather.icon && <weather.icon className="w-8 h-8 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]" />}
            <div>
              <div className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-sky-400" />
                <span className="text-slate-400 font-bold text-[8px] uppercase tracking-wider">Biên Hòa, VN</span>
              </div>
              <h3 className="text-sm font-bold text-white leading-none mt-1">Thời tiết</h3>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-black tracking-tighter text-white leading-none">{weather.temp}<span className="text-xs text-slate-500 font-normal">°C</span></h1>
            <p className="text-[10px] font-medium text-sky-400 capitalize mt-1">{weather.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 relative z-10 text-[10px]">
          <div className="bg-black/30 border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center">
            <span className="text-slate-400 font-bold uppercase tracking-wider mb-1">Độ ẩm</span>
            <span className="text-xs font-bold text-white">{weather.humidity}%</span>
          </div>
          <div className="bg-black/30 border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center">
            <span className="text-slate-400 font-bold uppercase tracking-wider mb-1">Tia UV</span>
            <span className={`text-[9px] font-bold px-1 py-0.5 rounded text-white ${weather.uvColor} ${weather.uvBg}`}>{weather.uv}</span>
          </div>
          <div className="bg-black/30 border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center">
            <span className="text-slate-400 font-bold uppercase tracking-wider mb-1">Cảm giác</span>
            <span className="text-xs font-bold text-white">{weather.feelsLike}°C</span>
          </div>
        </div>
      </div>

      {/* Logs section */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5 text-blue-500" /> Hoạt động hôm nay
        </h3>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          {logs.length > 0 ? (
            logs.slice(0, 10).map((log, idx) => {
              const style = getLogStyle(log);
              const LogIcon = style.icon;

              return (
                <div key={log.id || idx} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${style.border} bg-white/5 hover:bg-white/10 transition-colors`}>
                  <div className={`p-1.5 rounded-lg shrink-0 ${style.bg}`}>
                    <LogIcon className={`w-3.5 h-3.5 ${style.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-1">
                      <h4 className="font-bold text-white text-xs truncate">{log.deviceName || log.deviceId}</h4>
                      <span className="text-[8px] text-slate-500 font-mono shrink-0">{log.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${style.bg} ${style.color}`}>
                        {log.status}
                      </span>
                      <span className="text-[10px] text-slate-300 font-semibold truncate">
                        Payload: {log.value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 mb-2 opacity-20" />
              <p>Không có hoạt động mới.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
