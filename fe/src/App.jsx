import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang mặc định sẽ là Đăng nhập/Đăng ký */}
        <Route path="/" element={<Auth />} />
        
        {/* Trang quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;