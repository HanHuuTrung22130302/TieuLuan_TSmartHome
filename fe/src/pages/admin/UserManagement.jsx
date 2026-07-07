import { useState, useEffect } from 'react';
import {
  Search, Plus, Edit2, ShieldAlert, CheckCircle2, AlertTriangle,
  Lock, Unlock, X, Mail, Phone, MapPin, User, Shield, Lock as LockIcon,
  ChevronLeft, ChevronRight, RefreshCw, ChevronDown
} from 'lucide-react';
import adminService from '../../services/api/admin';

export default function UserManagement({ currentEmail, currentUserId, addLog }) {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // Lock Confirm Modal State
  const [showLockConfirmModal, setShowLockConfirmModal] = useState(false);
  const [userToLock, setUserToLock] = useState(null);

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [addUserErrors, setAddUserErrors] = useState({});

  // Edit User Modal State
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [editUserErrors, setEditUserErrors] = useState({});

  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await adminService.adminGetUsers();
      if (res.code === 1000) {
        setUsersList(res.data || []);
      } else {
        console.error(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, regionFilter]);

  // Unique regions derived from users list
  const uniqueRegions = ['ALL', ...new Set(usersList.map(u => u.region).filter(Boolean))];

  const handleToggleUserStatusClick = (user) => {
    if (user.status === 'Hoạt động') {
      setUserToLock(user);
      setShowLockConfirmModal(true);
    } else {
      toggleUserStatus(user.id);
    }
  };

  const confirmLockUser = () => {
    if (userToLock) {
      toggleUserStatus(userToLock.id);
      setShowLockConfirmModal(false);
      setUserToLock(null);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const res = await adminService.adminToggleLockUser(userId);
      if (res.code === 1000) {
        fetchUsers();
        addLog(res.message, `User ID: ${userId}`, 'SUCCESS');
      } else {
        alert(res.message || 'Lỗi khi thay đổi trạng thái khóa');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến máy chủ.');
    }
  };

  const toggleUserRole = async (userId) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;
    const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await adminService.adminUpdateUserRole(userId, nextRole);
      if (res.code === 1000) {
        fetchUsers();
        addLog('Thay đổi quyền hệ thống', `${user.name}: ${user.role} -> ${nextRole}`, 'INFO');
      } else {
        alert(res.message || 'Lỗi khi cập nhật vai trò');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến máy chủ.');
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) return "Mật khẩu tối thiểu phải từ 6 ký tự.";
    if (!/[A-Z]/.test(password)) return "Cần ít nhất 1 chữ in hoa.";
    if (!/[0-9]/.test(password)) return "Cần ít nhất 1 chữ số.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Cần ít nhất 1 ký tự đặc biệt.";
    return null;
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserForm(prev => ({ ...prev, [name]: value }));
    if (addUserErrors[name]) setAddUserErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!addUserForm.firstName.trim()) errors.firstName = 'Vui lòng nhập Họ';
    if (!addUserForm.lastName.trim()) errors.lastName = 'Vui lòng nhập Tên';

    if (!addUserForm.email.trim()) errors.email = 'Vui lòng nhập Email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addUserForm.email)) errors.email = 'Email không đúng định dạng';

    if (!addUserForm.phone.trim()) errors.phone = 'Vui lòng nhập Số điện thoại';
    else if (!/^\d{9,12}$/.test(addUserForm.phone.trim())) errors.phone = 'Số điện thoại không hợp lệ (9 - 12 chữ số)';

    if (!addUserForm.region.trim()) errors.region = 'Vui lòng nhập Khu vực';

    if (!addUserForm.password) errors.password = 'Vui lòng nhập Mật khẩu';
    else {
      const pwdErr = validatePassword(addUserForm.password);
      if (pwdErr) errors.password = pwdErr;
    }

    if (!addUserForm.confirmPassword) errors.confirmPassword = 'Vui lòng nhập lại Mật khẩu';
    else if (addUserForm.password !== addUserForm.confirmPassword) errors.confirmPassword = 'Mật khẩu nhập lại không khớp';

    if (Object.keys(errors).length > 0) {
      setAddUserErrors(errors);
      return;
    }

    try {
      const res = await adminService.adminCreateUser({
        firstName: addUserForm.firstName,
        lastName: addUserForm.lastName,
        email: addUserForm.email,
        phone: addUserForm.phone,
        region: addUserForm.region,
        password: addUserForm.password,
        role: addUserForm.role
      });

      if (res.code === 1000) {
        fetchUsers();
        addLog('Tạo tài khoản mới', `${addUserForm.firstName} ${addUserForm.lastName} (${addUserForm.email})`, 'SUCCESS');
        setShowAddUserModal(false);
        setAddUserForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          region: '',
          password: '',
          confirmPassword: '',
          role: 'USER'
        });
        setAddUserErrors({});
      } else {
        alert(res.message || 'Lỗi khi tạo tài khoản');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Lỗi kết nối đến máy chủ.');
    }
  };

  const handleEditUserClick = (user) => {
    const nameParts = user.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setEditingUserId(user.id);
    setEditUserForm({
      firstName,
      lastName,
      email: user.email,
      phone: user.phone || '',
      region: user.region || '',
      password: '',
      confirmPassword: '',
      role: user.role
    });
    setEditUserErrors({});
    setShowEditUserModal(true);
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUserForm(prev => ({ ...prev, [name]: value }));
    if (editUserErrors[name]) setEditUserErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!editUserForm.firstName.trim()) errors.firstName = 'Vui lòng nhập Họ';
    if (!editUserForm.lastName.trim()) errors.lastName = 'Vui lòng nhập Tên';

    if (!editUserForm.email.trim()) errors.email = 'Vui lòng nhập Email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUserForm.email)) errors.email = 'Email không đúng định dạng';

    if (!editUserForm.phone.trim()) errors.phone = 'Vui lòng nhập Số điện thoại';
    else if (!/^\d{9,12}$/.test(editUserForm.phone.trim())) errors.phone = 'Số điện thoại không hợp lệ (9 - 12 chữ số)';

    if (!editUserForm.region.trim()) errors.region = 'Vui lòng nhập Khu vực';

    if (editUserForm.password) {
      const pwdErr = validatePassword(editUserForm.password);
      if (pwdErr) errors.password = pwdErr;

      if (!editUserForm.confirmPassword) errors.confirmPassword = 'Vui lòng nhập lại Mật khẩu';
      else if (editUserForm.password !== editUserForm.confirmPassword) errors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }

    if (Object.keys(errors).length > 0) {
      setEditUserErrors(errors);
      return;
    }

    try {
      const res = await adminService.adminUpdateUser(editingUserId, {
        firstName: editUserForm.firstName,
        lastName: editUserForm.lastName,
        email: editUserForm.email,
        phone: editUserForm.phone,
        region: editUserForm.region,
        password: editUserForm.password,
        role: editUserForm.role
      });

      if (res.code === 1000) {
        fetchUsers();
        addLog('Cập nhật thông tin user', `${editUserForm.firstName} ${editUserForm.lastName} (${editUserForm.email})`, 'SUCCESS');
        setShowEditUserModal(false);
        setEditingUserId(null);
        setEditUserForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          region: '',
          password: '',
          confirmPassword: '',
          role: 'USER'
        });
        setEditUserErrors({});
      } else {
        alert(res.message || 'Lỗi khi cập nhật tài khoản');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Lỗi kết nối đến máy chủ.');
    }
  };

  // ================= FILTERS LOGIC =================
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.status === 'Hoạt động') ||
      (statusFilter === 'BLOCKED' && u.status === 'Bị khóa');
    const matchesRegion = regionFilter === 'ALL' || u.region === regionFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesRegion;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Specific Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/5 border border-white/5 rounded-xl shrink-0">
        {/* Local Search Input */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg pl-4 pr-1.5 py-1.5 w-full sm:w-72">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(searchInput)}
            placeholder="Tìm tên, email, sđt..."
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500 font-bold"
          />
          <button
            onClick={() => setSearchTerm(searchInput)}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all cursor-pointer shadow-md shadow-blue-600/10 shrink-0 outline-none"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-bold shrink-0">Quyền:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-black border border-white/10 text-slate-200 text-sm font-bold rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-blue-500 transition-all"
          >
            <option value="ALL">Tất cả</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-bold shrink-0">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black border border-white/10 text-slate-200 text-sm font-bold rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-blue-500 transition-all"
          >
            <option value="ALL">Tất cả</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BLOCKED">Bị khóa</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-bold shrink-0">Khu vực:</span>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-black border border-white/10 text-slate-200 text-sm font-bold rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-blue-500 transition-all"
          >
            <option value="ALL">Tất cả</option>
            {uniqueRegions.filter(r => r !== 'ALL').map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/25 ml-auto outline-none"
        >
          <Plus className="w-4 h-4" /> Tạo tài khoản
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-sm font-extrabold uppercase tracking-wider">
              <th className="py-4 pr-4 pl-2">Họ và tên</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Số điện thoại</th>
              <th className="py-4 px-4">Khu vực</th>
              <th className="py-4 px-4 text-center">Hệ thống Role</th>
              <th className="py-4 px-4 text-center">Trạng thái</th>
              <th className="py-4 pl-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm font-semibold">
            {loadingUsers ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 pr-4 pl-2 font-bold text-white">
                  <span className="text-base font-extrabold">{user.name}</span>
                </td>
                <td className="py-4 px-4 text-slate-300 font-mono text-sm">{user.email}</td>
                <td className="py-4 px-4 text-slate-300 font-mono text-sm">{user.phone}</td>
                <td className="py-4 px-4 text-slate-400 font-bold">{user.region}</td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => toggleUserRole(user.id)}
                    className={`px-3 py-1 font-black text-xs uppercase rounded-lg border transition-all cursor-pointer outline-none ${user.role === 'ADMIN'
                      ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 hover:bg-blue-600/20 shadow-sm shadow-blue-500/5'
                      : 'bg-slate-800/40 border-white/10 text-slate-400 hover:bg-white/5'
                      }`}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-black uppercase border ${user.status === 'Hoạt động'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleEditUserClick(user)}
                      title="Sửa thông tin"
                      className="p-2 rounded-lg border border-white/5 bg-white/5 hover:bg-blue-950/20 hover:border-blue-500/30 text-blue-400 transition-colors outline-none cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.email !== currentEmail && user.id !== currentUserId && (
                      <button
                        onClick={() => handleToggleUserStatusClick(user)}
                        title={user.status === 'Hoạt động' ? 'Khóa User' : 'Mở khóa'}
                        className={`p-2 rounded-lg border transition-colors outline-none cursor-pointer ${user.status === 'Hoạt động'
                          ? 'bg-white/5 border-white/5 hover:bg-rose-950/20 hover:border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-400'
                          }`}
                      >
                        {user.status === 'Hoạt động' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-500 font-bold text-base">
                  Không tìm thấy người dùng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-1 mt-auto pt-4 border-t border-white/10 shrink-0">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer outline-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer outline-none ${currentPage === pageNum
              ? 'bg-blue-600 border border-blue-500 text-white shadow-md shadow-blue-500/20'
              : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer outline-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ================= ADD USER MODAL ================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div onClick={() => setShowAddUserModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>
          <div className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl text-left animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/15 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Tạo tài khoản mới</h3>
            <p className="text-slate-500 text-xs mb-6 font-semibold">Tạo tài khoản người dùng hoặc quản trị viên mới trong hệ thống</p>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Họ</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className={`h-4.5 w-4.5 ${addUserErrors.firstName ? 'text-rose-500' : 'text-slate-500'}`} />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={addUserForm.firstName}
                      onChange={handleAddUserChange}
                      placeholder="Nguyễn"
                      className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${addUserErrors.firstName ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                        }`}
                    />
                  </div>
                  {addUserErrors.firstName && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{addUserErrors.firstName}</p>}
                </div>

                <div className="w-1/2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Tên</label>
                  <input
                    type="text"
                    name="lastName"
                    value={addUserForm.lastName}
                    onChange={handleAddUserChange}
                    placeholder="Văn A"
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${addUserErrors.lastName ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                  {addUserErrors.lastName && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{addUserErrors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className={`h-4.5 w-4.5 ${addUserErrors.email ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={addUserForm.email}
                    onChange={handleAddUserChange}
                    placeholder="email@tsmarthome.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${addUserErrors.email ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {addUserErrors.email && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{addUserErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className={`h-4.5 w-4.5 ${addUserErrors.phone ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={addUserForm.phone}
                    onChange={handleAddUserChange}
                    placeholder="0987654321"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${addUserErrors.phone ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {addUserErrors.phone && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{addUserErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Khu vực</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className={`h-4.5 w-4.5 ${addUserErrors.region ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    name="region"
                    value={addUserForm.region}
                    onChange={handleAddUserChange}
                    placeholder="Đồng Nai"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${addUserErrors.region ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {addUserErrors.region && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{addUserErrors.region}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Quyền hạn hệ thống</label>
                <select
                  name="role"
                  value={addUserForm.role}
                  onChange={handleAddUserChange}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none cursor-pointer focus:border-blue-600 transition-all"
                >
                  <option value="USER">USER (Người dùng thường)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`h-4.5 w-4.5 ${addUserErrors.password ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={addUserForm.password}
                    onChange={handleAddUserChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${addUserErrors.password ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {addUserErrors.password && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{addUserErrors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Nhập lại mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Shield className={`h-4.5 w-4.5 ${addUserErrors.confirmPassword ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={addUserForm.confirmPassword}
                    onChange={handleAddUserChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${addUserErrors.confirmPassword ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {addUserErrors.confirmPassword && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{addUserErrors.confirmPassword}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-bold uppercase tracking-wider outline-none border border-white/5 text-center transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold uppercase tracking-wider outline-none text-center shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT USER MODAL ================= */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end animate-in fade-in duration-200">
          <div onClick={() => setShowEditUserModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>
          <div className="relative w-full max-w-md h-full bg-[#121212] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300 font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Cập nhật tài khoản</h3>
                <p className="text-slate-500 text-xs mt-0.5">Sửa thông tin chi tiết người dùng</p>
              </div>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="flex-1 flex flex-col justify-between py-6 overflow-y-auto space-y-4 pr-1.5">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Họ</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className={`h-4.5 w-4.5 ${editUserErrors.firstName ? 'text-rose-500' : 'text-slate-500'}`} />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={editUserForm.firstName}
                      onChange={handleEditUserChange}
                      placeholder="Nguyễn"
                      className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${editUserErrors.firstName ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                        }`}
                    />
                  </div>
                  {editUserErrors.firstName && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{editUserErrors.firstName}</p>}
                </div>

                <div className="w-1/2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Tên</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editUserForm.lastName}
                    onChange={handleEditUserChange}
                    placeholder="Văn A"
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${editUserErrors.lastName ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                  {editUserErrors.lastName && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{editUserErrors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className={`h-4.5 w-4.5 ${editUserErrors.email ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={editUserForm.email}
                    onChange={handleEditUserChange}
                    placeholder="email@tsmarthome.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${editUserErrors.email ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {editUserErrors.email && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{editUserErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className={`h-4.5 w-4.5 ${editUserErrors.phone ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={editUserForm.phone}
                    onChange={handleEditUserChange}
                    placeholder="0987654321"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${editUserErrors.phone ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {editUserErrors.phone && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{editUserErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Khu vực</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className={`h-4.5 w-4.5 ${editUserErrors.region ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    name="region"
                    value={editUserForm.region}
                    onChange={handleEditUserChange}
                    placeholder="Đồng Nai"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${editUserErrors.region ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {editUserErrors.region && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{editUserErrors.region}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Quyền hạn hệ thống</label>
                <select
                  name="role"
                  value={editUserForm.role}
                  onChange={handleEditUserChange}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none cursor-pointer focus:border-blue-600 transition-all"
                >
                  <option value="USER">USER (Người dùng thường)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Mật khẩu mới (Để trống nếu không đổi)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`h-4.5 w-4.5 ${editUserErrors.password ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={editUserForm.password}
                    onChange={handleEditUserChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${editUserErrors.password ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {editUserErrors.password && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{editUserErrors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Nhập lại mật khẩu mới</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Shield className={`h-4.5 w-4.5 ${editUserErrors.confirmPassword ? 'text-rose-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={editUserForm.confirmPassword}
                    onChange={handleEditUserChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white outline-none focus:bg-slate-900 transition-all ${editUserErrors.confirmPassword ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-600'
                      }`}
                  />
                </div>
                {editUserErrors.confirmPassword && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{editUserErrors.confirmPassword}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-bold uppercase tracking-wider outline-none border border-white/5 text-center transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold uppercase tracking-wider outline-none text-center shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= LOCK USER CONFIRMATION MODAL ================= */}
      {showLockConfirmModal && userToLock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div onClick={() => { setShowLockConfirmModal(false); setUserToLock(null); }} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>
          <div className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <LockIcon className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Xác nhận khóa tài khoản</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-semibold font-sans">
              Bạn có chắc chắn muốn khóa tài khoản của <span className="text-blue-400 font-extrabold">{userToLock.name}</span> ({userToLock.email}) không? Người dùng này sẽ không thể đăng nhập vào hệ thống sau khi bị khóa.
            </p>
            <div className="grid grid-cols-2 gap-3 font-sans text-sm font-semibold">
              <button
                onClick={() => { setShowLockConfirmModal(false); setUserToLock(null); }}
                className="py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-bold uppercase tracking-wider outline-none border border-white/5 transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmLockUser}
                className="py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider outline-none shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                Khóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
