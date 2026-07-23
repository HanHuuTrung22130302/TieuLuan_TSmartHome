import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import ForgotPassword from './pages/Auth/ForgotPassword';
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home'; 
import SmartHomeMap from './pages/map/SmartHomeMap';
import SmartHomeMap3D from './pages/map/SmartHomeMap3D';

// Import các trang quản lý chức năng
import Devices from './pages/devices/Devices';
import Notifications from './pages/notifications/Notifications';
import Security from './pages/security/Security';

// BỔ SUNG: Import trang Lịch sử trò chuyện trợ lý AI mới làm
import AssistantHistory from './pages/assistant/AssistantHistory';
import Schedules from './pages/schedules/Schedules';

// BỔ SUNG: Import trang Bảng quản trị hệ thống
import AdminDashboard from './pages/admin/AdminDashboard';

// 1. Hàm kiểm tra xem đã có Token chưa (trong LocalStorage hoặc SessionStorage)
const isAuthenticated = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// 2. Component chặn trang Yêu cầu Đăng nhập (Home, Rooms...)
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Chưa có token -> Đá về trang Đăng nhập
    return <Navigate to="/" replace />;
  }
  return children;
};

// 3. Component chặn trang Không Yêu cầu Đăng nhập (Login, Register, Forgot Password)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    // Có token rồi -> Đá vào Home (Không cho quay lại màn Login)
    return <Navigate to="/home" replace />;
  }
  return children;
};

// 4. Component chặn truy cập admin đối với user thông thường
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  if (role?.toUpperCase() !== 'ADMIN') {
    // Không phải admin -> Đá về trang Home
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          
          {/* CÁC TRANG CHỨC NĂNG - TỰ ĐỘNG CHUYỂN HƯỚNG VỀ TRANG HỢP NHẤT */}
          <Route path="/devices" element={<Navigate to="/home" replace />} />
          <Route path="/admin" element={<Navigate to="/home" replace />} />
          <Route path="/admin/users" element={<Navigate to="/home" replace />} />
          <Route path="/admin/homes" element={<Navigate to="/home" replace />} />
          <Route path="/admin/devices" element={<Navigate to="/home" replace />} />
          <Route path="/admin/logs" element={<Navigate to="/home" replace />} />
          <Route path="/admin/firmware" element={<Navigate to="/home" replace />} />
          <Route path="/notifications" element={<Navigate to="/home" replace />} />
          <Route path="/security" element={<Navigate to="/home" replace />} />
          <Route path="/schedules" element={<Navigate to="/home" replace />} />
          <Route path="/assistant-history" element={<Navigate to="/home" replace />} />
          <Route path="/map" element={<Navigate to="/home" replace />} />
          <Route path="/map3d" element={<Navigate to="/home" replace />} />
        </Route>

        {/* ================= 404 CATCH-ALL ================= */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/home" : "/"} replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;