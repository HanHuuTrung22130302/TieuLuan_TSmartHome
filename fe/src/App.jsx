import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/dashboard/Dashboard'; // Đảm bảo đường dẫn này đúng

// 1. Hàm kiểm tra xem đã có Token chưa (trong LocalStorage hoặc SessionStorage)
const isAuthenticated = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// 2. Component chặn trang Yêu cầu Đăng nhập (Dashboard, Rooms...)
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
    // Có token rồi -> Đá vào Dashboard (Không cho quay lại màn Login)
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        {/* Đã đăng nhập thì không cho vào 2 trang này nữa */}
        <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        {/* ================= PROTECTED ROUTES ================= */}
        {/* Bắt buộc phải có Token mới được nhúng vào MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Các trang sau này của bạn như /rooms, /settings sẽ nằm ở đây */}
          <Route path="/map" element={<SmartHomeMap />} />
        </Route>

        {/* ================= 404 CATCH-ALL ================= */}
        {/* Nếu gõ URL bậy bạ, tự động kiểm tra token để đẩy về đúng chỗ */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/"} replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;