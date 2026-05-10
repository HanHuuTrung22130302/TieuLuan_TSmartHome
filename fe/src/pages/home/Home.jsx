import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { 
  Search, Mic, ChevronDown, Wind, Droplets, Sun, 
  Tv, Radio, Lightbulb, MoreVertical, MapPin, 
  CloudRain, Navigation, ShieldCheck, Activity,
  Map as MapIcon, Cuboid
} from 'lucide-react';
import useWeather from '../../hooks/useWeather'; 

// ================= COMPONENT LOAD MÔ HÌNH 3D MINI =================
function MiniHouseModel() {
  // Trỏ đúng vào file floor_plan.glb của bạn
  const { scene } = useGLTF('/web.glb');
  
  return (
    <primitive 
      object={scene} 
      // Bạn có thể chỉnh scale (phóng to/thu nhỏ) và position (dịch lên/xuống) cho vừa với khung widget
      scale={0.8} 
      position={[0, -1, 0]} 
    />
  );
}

export default function Home() {
  const weather = useWeather();
  const [currentDate, setCurrentDate] = useState('');
  
  // Quản lý hiển thị Map 2D / 3D
  const [mapView, setMapView] = useState('2D'); 

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('vi-VN', dateOptions));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto font-sans">
      
      {/* ================= HEADER ================= */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-1">{currentDate}</p>
          <h2 className="text-3xl font-bold tracking-tight">Welcome <span className="font-normal">Trung</span></h2>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5 flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 mr-3" />
            <input type="text" placeholder="Tìm kiếm thiết bị..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500" />
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

      {/* ================= MAIN LAYOUT ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* WIDGET THỜI TIẾT */}
          <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/3 group-hover:bg-sky-500/20 transition-colors duration-700"></div>
            
            <div className="relative z-10 flex flex-col justify-between min-w-[200px]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Biên Hòa, VN</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 leading-tight">Môi trường<br/>ngoài trời</h3>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-3">
                  {weather.icon && <weather.icon className="w-14 h-14 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]" />}
                  <h1 className="text-7xl font-black tracking-tighter">{weather.temp}<span className="text-3xl text-slate-500 font-normal">°C</span></h1>
                </div>
                <p className="text-xl font-medium text-slate-200">{weather.desc}</p>
                <p className="text-sm text-slate-500 mt-1">Cảm giác như {weather.feelsLike}°C</p>
              </div>
            </div>

            <div className="relative z-10 flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <Wind className={`w-5 h-5 ${weather.aqiColor}`} />
                  <span className={`text-[10px] font-black tracking-wider px-2 py-1 ${weather.aqiBg} ${weather.aqiColor} rounded-lg`}>{weather.aqiStatus}</span>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Chất lượng KK</p>
                  <p className="text-2xl font-bold text-white">{weather.aqi} <span className="text-xs text-slate-500 font-medium">AQI</span></p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <Droplets className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Độ ẩm</p>
                  <p className="text-2xl font-bold text-white">{weather.humidity}<span className="text-sm text-slate-500 font-medium">%</span></p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <Sun className={`w-5 h-5 ${weather.uvColor}`} />
                  <span className={`text-[10px] font-black tracking-wider px-2 py-1 ${weather.uvBg} ${weather.uvColor} rounded-lg`}>{weather.uvStatus}</span>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Chỉ số UV max</p>
                  <p className="text-2xl font-bold text-white">{weather.uv}</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors col-span-2 md:col-span-2">
                 <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/5 rounded-full"><Navigation className="w-4 h-4 text-slate-300" /></div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Tốc độ & Hướng gió</p>
                </div>
                <div className="mt-auto">
                  <p className="text-2xl font-bold text-white">{weather.windSpeed} <span className="text-sm text-slate-500 font-medium">km/h</span> • <span className="text-base font-medium text-slate-300">{weather.windDir}</span></p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <CloudRain className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Tỷ lệ mưa</p>
                  <p className="text-2xl font-bold text-white">{weather.pop}<span className="text-sm text-slate-500 font-medium">%</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* THIẾT BỊ THƯỜNG DÙNG */}
          <div className="mt-4">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xl font-bold">Thường dùng (3)</h3>
              <button className="text-slate-400 text-sm hover:text-white transition-colors">Xem tất cả</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 flex flex-col justify-between aspect-square group hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Tv className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex items-end justify-between">
                  <p className="font-medium text-slate-300">TV - P.Khách</p>
                  <div className="w-8 h-4 rounded-full border border-slate-600 flex items-center px-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 flex flex-col justify-between aspect-square group hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex items-end justify-between">
                  <p className="font-medium text-slate-300">Còi Buzzer</p>
                  <div className="w-8 h-4 rounded-full border border-slate-600 flex items-center px-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 flex flex-col justify-between aspect-square relative overflow-hidden cursor-pointer group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5a1]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative z-10">
                  <Lightbulb className="w-5 h-5 text-[#e8f5a1] drop-shadow-[0_0_8px_rgba(232,245,161,0.8)]" />
                </div>
                <div className="flex items-end justify-between relative z-10">
                  <p className="font-medium text-white">Đèn Bếp</p>
                  <div className="w-8 h-4 rounded-full bg-[#e8f5a1] flex items-center px-0.5 justify-end shadow-[0_0_10px_rgba(232,245,161,0.3)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* ================= MAP WIDGET ================= */}
          <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-4 flex flex-col h-[350px] relative overflow-hidden group">
            
            {/* Lớp nền khi ở chế độ 2D */}
            {mapView === '2D' && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/apartment_map.png')" }}
              ></div>
            )}

            {/* Lớp Canvas vẽ mô hình khi ở chế độ 3D */}
            {mapView === '3D' && (
              <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <Environment preset="city" />
                  <Suspense fallback={null}>
                    <MiniHouseModel />
                  </Suspense>
                  {/* autoRotate giúp nhà tự quay, enableZoom=false để tránh lỗi lăn chuột */}
                  <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} enablePan={false} />
                </Canvas>
              </div>
            )}
            
            {/* Gradient đen mờ để làm nổi bật UI */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex justify-between items-start mb-auto pointer-events-auto">
              <div className="flex bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-lg">
                <button 
                  onClick={() => setMapView('2D')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mapView === '2D' ? 'bg-[#e8f5a1] text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> 2D
                </button>
                <button 
                  onClick={() => setMapView('3D')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mapView === '3D' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  <Cuboid className="w-3.5 h-3.5" /> 3D
                </button>
              </div>
            </div>

            {/* Radar mồi cho chế độ 2D */}
            {mapView === '2D' && (
              <>
                <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-rose-500 rounded-full animate-ping pointer-events-none"></div>
                <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-rose-500 rounded-full border-2 border-white pointer-events-none"></div>
                
                <div className="absolute bottom-[30%] right-[25%] w-3 h-3 bg-blue-500 rounded-full animate-ping pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-[30%] right-[25%] w-3 h-3 bg-blue-500 rounded-full border-2 border-white pointer-events-none"></div>
              </>
            )}

            {/* Nút truy cập vào trang Map tương ứng */}
            <Link 
              to={mapView === '2D' ? "/map" : "/map3d"} 
              className="relative z-10 w-full py-4 mt-auto bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-sm text-center hover:bg-white hover:text-black transition-colors shadow-xl"
            >
              Mở chi tiết Không gian {mapView}
            </Link>
          </div>

          <div className="flex items-center justify-between mt-2">
            <h3 className="text-xl font-bold">Widgets (01)</h3>
            <button className="bg-[#e8f5a1] text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-[#d6e685] transition-colors">
              Thêm mới
            </button>
          </div>

          {/* SYSTEM HEALTH WIDGET */}
          <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between gap-6 group hover:border-emerald-500/30 transition-colors">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Trạng thái hệ thống</p>
                <h2 className="text-2xl font-black text-emerald-400">AN TOÀN</h2>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
              <Activity className="w-4 h-4 text-blue-400" />
              <p className="text-sm font-medium text-slate-300"><strong className="text-white">40/40</strong> thiết bị online</p>
            </div>

            <div className="relative z-10 flex justify-between items-end">
              <button className="text-slate-500 text-xs font-bold hover:text-white transition-colors uppercase tracking-wider">
                Xem chi tiết
              </button>
              <button className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}