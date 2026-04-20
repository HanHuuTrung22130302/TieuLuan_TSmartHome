import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Zap, Lightbulb, Fan, Bell } from 'lucide-react';
import SmartHomeMap from './SmartHomeMap'; // Đường dẫn import tùy thư mục của bạn

export default function Dashboard() {
  // Trạng thái giả lập việc đang gọi API lấy dữ liệu từ Spring Boot
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập API delay 2 giây sau khi vào trang
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Đã lấy xong dữ liệu, tắt loading
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // GIAO DIỆN SKELETON (Khi đang tải dữ liệu)
  // ==========================================
  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        {/* Skeleton Header */}
        <div className="flex justify-between items-end mb-10 animate-pulse">
          <div className="w-full">
            <div className="h-4 bg-slate-200 rounded w-32 mb-3"></div>
            <div className="h-8 bg-slate-200 rounded w-64"></div>
          </div>
          <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        </div>

        {/* Skeleton Quick Stats (3 thẻ) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 animate-pulse">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-100 rounded w-24 mb-3"></div>
                <div className="h-8 bg-slate-100 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton Devices */}
        <div>
          <div className="h-6 bg-slate-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white p-5 h-36 rounded-3xl shadow-sm border border-slate-100 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                  <div className="w-11 h-6 bg-slate-100 rounded-full"></div>
                </div>
                <div>
                  <div className="h-3 bg-slate-100 rounded w-20 mb-2"></div>
                  <div className="h-5 bg-slate-100 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // GIAO DIỆN THẬT (Khi đã có dữ liệu)
  // ==========================================
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* 1. HEADER */}
      <header className="flex justify-between items-end mb-10">
        <div>
          <p className="text-slate-500 font-medium mb-1">Thứ Bảy, 18 Tháng 4</p>
          <h2 className="text-3xl font-bold text-slate-900">Chào buổi sáng, Nam! 👋</h2>
        </div>
        <button className="p-3 bg-white border border-slate-200 rounded-full hover:shadow-md transition-shadow relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* 2. QUICK STATS (Thông số môi trường) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300 cursor-default">
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-500">
            <Thermometer className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Nhiệt độ trong nhà</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-bold text-slate-800">28.5</h3>
              <span className="text-slate-500 font-medium">°C</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300 cursor-default">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-500">
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Độ ẩm không khí</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-bold text-slate-800">64</h3>
              <span className="text-slate-500 font-medium">%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300 cursor-default">
          <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-500">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Điện tiêu thụ (Tháng)</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-bold text-slate-800">142</h3>
              <span className="text-slate-500 font-medium">kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FAVORITE DEVICES (Thiết bị thường dùng) */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6">Thiết bị đang hoạt động</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card Thiết bị 1 (Đang bật) */}
          <div className="bg-blue-600 p-5 rounded-3xl shadow-lg shadow-blue-600/30 text-white relative overflow-hidden group cursor-pointer hover:bg-blue-700 transition-colors">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <Lightbulb className="w-8 h-8 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" />
              <div className="w-11 h-6 bg-white/30 rounded-full p-1 flex items-center justify-end transition-colors">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-medium mb-1">Phòng khách</p>
              <h4 className="text-lg font-bold">Đèn trần chính</h4>
            </div>
          </div>

          {/* Card Thiết bị 2 (Đang tắt) */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <Fan className="w-8 h-8 text-slate-400 group-hover:text-slate-500 transition-colors" />
              <div className="w-11 h-6 bg-slate-200 rounded-full p-1 flex items-center justify-start transition-colors">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Phòng ngủ</p>
              <h4 className="text-lg font-bold text-slate-800">Quạt điều hòa</h4>
            </div>
          </div>

        </div>
      </div>
      {/* 4. DIGITAL TWIN (BẢN ĐỒ 2D) */}
      <SmartHomeMap />

    </div>
  );
}