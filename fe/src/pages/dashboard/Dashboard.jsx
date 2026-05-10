// import { useState } from 'react';
// import { 
//   Search, Mic, ChevronDown, Power, Sun, Wind, Droplets, Zap,
//   Tv, Radio, Lightbulb, Map as MapIcon, MoreVertical, MapPin, 
//   CloudRainWind, CloudRain, Navigation, ShieldCheck, Activity
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto font-sans">
      
//       {/* ================= HEADER ================= */}
//       <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
//         <div>
//           <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-1">Thứ Ba, 5 Tháng 5, 2026</p>
//           <h2 className="text-3xl font-bold tracking-tight">Welcome <span className="font-normal">Trung</span></h2>
//         </div>
        
//         <div className="flex items-center gap-4 w-full md:w-auto">
//           {/* Thanh tìm kiếm */}
//           <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5 flex-1 md:w-80">
//             <Search className="w-4 h-4 text-slate-400 mr-3" />
//             <input 
//               type="text" 
//               placeholder="Tìm kiếm thiết bị..." 
//               className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500"
//             />
//           </div>
//           {/* Nút Voice */}
//           <button className="p-3 bg-white text-black rounded-full hover:bg-slate-200 transition-colors shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
//             <Mic className="w-4 h-4" />
//           </button>
//           {/* Profile */}
//           <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1 pr-4 shrink-0 cursor-pointer hover:bg-white/10 transition-colors">
//             <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
//               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Trung" alt="avatar" />
//             </div>
//             <span className="text-sm font-medium">Trung Hán Hữu</span>
//             <ChevronDown className="w-4 h-4 text-slate-400" />
//           </div>
//         </div>
//       </header>

//       {/* ================= MAIN LAYOUT (2 CỘT) ================= */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
//         {/* CỘT TRÁI: ĐIỀU KHIỂN & MÔI TRƯỜNG (Chiếm 2/3) */}
//         <div className="xl:col-span-2 flex flex-col gap-6">
          
//           {/* WIDGET THỜI TIẾT & MÔI TRƯỜNG BÊN NGOÀI (Thay thế AC Panel cũ) */}
//           <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 shadow-2xl relative overflow-hidden group">
//             {/* Lớp màu blur trang trí */}
//             <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/3 group-hover:bg-sky-500/20 transition-colors duration-700"></div>
            
//             {/* Cột trái: Thông tin chính */}
//             <div className="relative z-10 flex flex-col justify-between min-w-[200px]">
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <MapPin className="w-4 h-4 text-sky-400" />
//                   <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Biên Hòa, Đồng Nai</span>
//                 </div>
//                 <h3 className="text-2xl font-bold text-white mb-6 leading-tight">Môi trường<br/>ngoài trời</h3>
//               </div>
              
//               <div>
//                 <div className="flex items-center gap-4 mb-3">
//                   <CloudRainWind className="w-14 h-14 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]" />
//                   <h1 className="text-7xl font-black tracking-tighter">27<span className="text-3xl text-slate-500 font-normal">°C</span></h1>
//                 </div>
//                 <p className="text-xl font-medium text-slate-200">Mưa rào nhẹ</p>
//                 <p className="text-sm text-slate-500 mt-1">Cảm giác như 30°C</p>
//               </div>
//             </div>

//             {/* Cột phải: Grid thông số môi trường chi tiết */}
//             <div className="relative z-10 flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
//               {/* AQI */}
//               <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
//                 <div className="flex items-center justify-between mb-4">
//                   <Wind className="w-5 h-5 text-emerald-400" />
//                   <span className="text-[10px] font-black tracking-wider px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-lg">TỐT</span>
//                 </div>
//                 <div>
//                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Chất lượng KK</p>
//                   <p className="text-2xl font-bold text-white">42 <span className="text-xs text-slate-500 font-medium">AQI</span></p>
//                 </div>
//               </div>
              
//               {/* Độ ẩm */}
//               <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
//                 <div className="flex items-center justify-between mb-4">
//                   <Droplets className="w-5 h-5 text-blue-400" />
//                 </div>
//                 <div>
//                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Độ ẩm</p>
//                   <p className="text-2xl font-bold text-white">85<span className="text-sm text-slate-500 font-medium">%</span></p>
//                 </div>
//               </div>

//               {/* Chỉ số UV */}
//               <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
//                 <div className="flex items-center justify-between mb-4">
//                   <Sun className="w-5 h-5 text-yellow-400" />
//                   <span className="text-[10px] font-black tracking-wider px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-lg">THẤP</span>
//                 </div>
//                 <div>
//                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Chỉ số UV</p>
//                   <p className="text-2xl font-bold text-white">2.1</p>
//                 </div>
//               </div>

//               {/* Hướng gió */}
//               <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors col-span-2 md:col-span-2">
//                  <div className="flex items-center gap-3 mb-2">
//                   <div className="p-2 bg-white/5 rounded-full"><Navigation className="w-4 h-4 text-slate-300" /></div>
//                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Tốc độ & Hướng gió</p>
//                 </div>
//                 <div className="mt-auto">
//                   <p className="text-2xl font-bold text-white">12 <span className="text-sm text-slate-500 font-medium">km/h</span> • <span className="text-base font-medium text-slate-300">Đông Nam</span></p>
//                 </div>
//               </div>

//               {/* Khả năng mưa */}
//               <div className="bg-white/5 border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
//                 <div className="flex items-center justify-between mb-4">
//                   <CloudRain className="w-5 h-5 text-indigo-400" />
//                 </div>
//                 <div>
//                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Tỷ lệ mưa</p>
//                   <p className="text-2xl font-bold text-white">70<span className="text-sm text-slate-500 font-medium">%</span></p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Thiết bị thường dùng (Square Cards) */}
//           <div className="mt-4">
//             <div className="flex justify-between items-end mb-6">
//               <h3 className="text-xl font-bold">Thường dùng (3)</h3>
//               <button className="text-slate-400 text-sm hover:text-white transition-colors">Xem tất cả</button>
//             </div>
            
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {/* Card 1 */}
//               <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 flex flex-col justify-between aspect-square group hover:bg-white/5 transition-colors cursor-pointer">
//                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
//                   <Tv className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
//                 </div>
//                 <div className="flex items-end justify-between">
//                   <p className="font-medium text-slate-300">TV - P.Khách</p>
//                   <div className="w-8 h-4 rounded-full border border-slate-600 flex items-center px-0.5">
//                     <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 2 */}
//               <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 flex flex-col justify-between aspect-square group hover:bg-white/5 transition-colors cursor-pointer">
//                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
//                   <Radio className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
//                 </div>
//                 <div className="flex items-end justify-between">
//                   <p className="font-medium text-slate-300">Còi Buzzer</p>
//                   <div className="w-8 h-4 rounded-full border border-slate-600 flex items-center px-0.5">
//                     <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 3 (Đang bật) */}
//               <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 flex flex-col justify-between aspect-square relative overflow-hidden cursor-pointer group">
//                 <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5a1]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
//                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative z-10">
//                   <Lightbulb className="w-5 h-5 text-[#e8f5a1] drop-shadow-[0_0_8px_rgba(232,245,161,0.8)]" />
//                 </div>
//                 <div className="flex items-end justify-between relative z-10">
//                   <p className="font-medium text-white">Đèn Bếp</p>
//                   <div className="w-8 h-4 rounded-full bg-[#e8f5a1] flex items-center px-0.5 justify-end shadow-[0_0_10px_rgba(232,245,161,0.3)]">
//                     <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* CỘT PHẢI: WIDGETS (Chiếm 1/3) */}
//         <div className="xl:col-span-1 flex flex-col gap-6">
          
//           {/* Widget Live Map */}
//           <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-4 flex flex-col h-[350px] relative overflow-hidden group">
//             <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:opacity-60 transition-opacity"></div>
            
//             <div className="relative z-10 flex justify-between items-start mb-auto">
//               <button className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold hover:bg-white/20 transition-colors">
//                 Live map <ChevronDown className="w-3 h-3 ml-1" />
//               </button>
//             </div>

//             <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
//             <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_blue]"></div>
//             <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_yellow]"></div>

//             <Link to="/map" className="relative z-10 w-full py-4 mt-auto bg-white text-black rounded-2xl font-bold text-sm text-center hover:bg-slate-200 transition-colors">
//               Mở Bản đồ Không gian
//             </Link>
//           </div>

//           <div className="flex items-center justify-between mt-2">
//             <h3 className="text-xl font-bold">Widgets (01)</h3>
//             <button className="bg-[#e8f5a1] text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-[#d6e685] transition-colors">
//               Thêm mới
//             </button>
//           </div>

//           {/* System Health Widget (Thay cho widget thời tiết cũ) */}
//           <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between gap-6 group hover:border-emerald-500/30 transition-colors">
//             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
            
//             <div className="relative z-10 flex justify-between items-start">
//               <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
//                 <ShieldCheck className="w-7 h-7 text-emerald-400" />
//               </div>
//               <div className="text-right">
//                 <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Trạng thái hệ thống</p>
//                 <h2 className="text-2xl font-black text-emerald-400">AN TOÀN</h2>
//               </div>
//             </div>

//             <div className="relative z-10 flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
//               <Activity className="w-4 h-4 text-blue-400" />
//               <p className="text-sm font-medium text-slate-300"><strong className="text-white">40/40</strong> thiết bị online</p>
//             </div>

//             <div className="relative z-10 flex justify-between items-end">
//               <button className="text-slate-500 text-xs font-bold hover:text-white transition-colors uppercase tracking-wider">
//                 Xem chi tiết
//               </button>
//               <button className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
//                 <MoreVertical className="w-4 h-4 text-slate-400" />
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }