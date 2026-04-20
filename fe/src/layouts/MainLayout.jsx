import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, Grid, Settings, LogOut, Zap } from 'lucide-react';
import { Home, LayoutDashboard, Grid, Settings, LogOut, Zap, Map } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation(); // Để biết đang ở trang nào và bôi đậm menu
  const navigate = useNavigate(); // Hook dùng để chuyển trang

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan' },
    { path: '/map', icon: <Map className="w-5 h-5" />, label: 'Bản đồ không gian' },
    { path: '/rooms', icon: <Grid className="w-5 h-5" />, label: 'Quản lý phòng' },
    { path: '/automations', icon: <Zap className="w-5 h-5" />, label: 'Tự động hóa' },
  ];

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // 1. Xóa sạch token ở cả localStorage và sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    
    // 2. Đẩy người dùng về trang Đăng nhập
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR (Bên trái) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex z-20">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-100">
            <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-600/20">
              <Home className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">TSmartHome</h1>
          </div>

          {/* Menu chính */}
          <nav className="p-4 space-y-2 mt-4">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Menu cài đặt & Đăng xuất ở dưới cùng */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium transition-all">
            <Settings className="w-5 h-5" />
            Cài đặt
          </Link>
          
          {/* Đã chuyển Link thành button và gắn sự kiện handleLogout */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* 2. KHÔNG GIAN LÀM VIỆC CHÍNH (Bên phải) */}
      <main className="flex-1 h-full overflow-y-auto relative">
        {/* Lớp nền mờ ảo trang trí cho toàn bộ nội dung bên phải */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
        
        {/* <Outlet /> chính là nơi React Router sẽ "nhúng" trang Dashboard vào */}
        <Outlet />
      </main>
      
    </div>
  );
}