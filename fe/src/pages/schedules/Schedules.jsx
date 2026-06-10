import { useState, useEffect } from 'react';
import {
  Clock, Plus, Trash2, Edit3, Power, Calendar, RefreshCw,
  CheckCircle2, AlertTriangle, X, ChevronDown, Check, HelpCircle
} from 'lucide-react';
import { getRooms } from '../../services/api/room';
import { getDevices } from '../../services/api/device';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../services/api/schedule';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Notification states
  const [toast, setToast] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Form states
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [actionState, setActionState] = useState(true); // true = ON, false = OFF
  const [scheduleType, setScheduleType] = useState('DAILY'); // ONCE or DAILY
  const [scheduleTime, setScheduleTime] = useState(''); // HH:mm for DAILY, yyyy-MM-ddTHH:mm for ONCE
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [scheduleRes, deviceRes, roomRes] = await Promise.all([
          getSchedules(),
          getDevices({ deviceType: 'all' }),
          getRooms()
        ]);

        if (scheduleRes && scheduleRes.code === 1000) {
          setSchedules(scheduleRes.data);
        }
        if (deviceRes && deviceRes.code === 1000) {
          // Lọc các thiết bị có trạng thái điều khiển được (state !== null) và không phải là thiết bị ảo
          const controllable = deviceRes.data.filter(d => d.state !== null && d.isFake === false);
          setDevices(controllable);
        }
        if (roomRes && roomRes.code === 1000) {
          setRooms(roomRes.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        showToast('error', 'Không thể tải danh sách dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingSchedule(null);
    setSelectedDeviceId(devices.length > 0 ? devices[0].id : '');
    setActionState(true);
    setScheduleType('DAILY');

    // Set default time (current time or default HH:mm)
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setScheduleTime(`${hours}:${minutes}`);

    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedDeviceId(schedule.deviceId);

    const isActionOn = schedule.action?.state === true || schedule.action?.enable === true;
    setActionState(isActionOn);
    setScheduleType(schedule.scheduleType);

    if (schedule.scheduleType === 'ONCE') {
      // Format LocalDateTime string to yyyy-MM-ddTHH:mm
      const formattedTime = schedule.time ? schedule.time.substring(0, 16) : '';
      setScheduleTime(formattedTime);
    } else {
      setScheduleTime(schedule.time || '');
    }

    setIsModalOpen(true);
  };

  // Lưu lịch hẹn giờ (Thêm mới / Cập nhật)
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!selectedDeviceId) {
      showToast('error', 'Vui lòng chọn thiết bị');
      return;
    }
    if (!scheduleTime) {
      showToast('error', 'Vui lòng cài đặt thời gian');
      return;
    }

    setIsSaving(true);
    const payload = {
      deviceId: selectedDeviceId,
      action: { state: actionState },
      scheduleType: scheduleType,
      time: scheduleTime,
      isActive: editingSchedule ? editingSchedule.isActive : true
    };

    try {
      if (editingSchedule) {
        // Cập nhật
        const res = await updateSchedule(editingSchedule.id, payload);
        if (res && res.code === 1000) {
          setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? res.data : s));
          showToast('success', 'Cập nhật lịch hẹn giờ thành công');
          setIsModalOpen(false);
        } else {
          showToast('error', res.msg || 'Có lỗi xảy ra');
        }
      } else {
        // Tạo mới
        const res = await createSchedule(payload);
        if (res && res.code === 1000) {
          setSchedules(prev => [res.data, ...prev]);
          showToast('success', 'Tạo lịch hẹn giờ thành công');
          setIsModalOpen(false);
        } else {
          showToast('error', res.msg || 'Có lỗi xảy ra');
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu lịch hẹn giờ:', error);
      showToast('error', 'Kết nối server thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  // Xóa lịch hẹn giờ
  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn giờ này?')) return;
    try {
      const res = await deleteSchedule(id);
      if (res && res.code === 1000) {
        setSchedules(prev => prev.filter(s => s.id !== id));
        showToast('success', 'Xóa lịch hẹn giờ thành công');
        setIsModalOpen(false);
      } else {
        showToast('error', res.msg || 'Không thể xóa');
      }
    } catch (error) {
      console.error('Lỗi khi xóa lịch hẹn giờ:', error);
      showToast('error', 'Lỗi kết nối máy chủ');
    }
  };

  // Bật/tắt trực tiếp lịch hẹn giờ trên Card (Slide toggle)
  const handleToggleActive = async (e, schedule) => {
    e.stopPropagation(); // Ngăn mở modal chỉnh sửa khi click vào nút gạt

    const newActive = !schedule.isActive;

    // Optimistic Update
    setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, isActive: newActive } : s));

    try {
      const payload = {
        isActive: newActive
      };
      const res = await updateSchedule(schedule.id, payload);
      if (!res || res.code !== 1000) {
        // Revert nếu lỗi
        setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, isActive: schedule.isActive } : s));
        showToast('error', res.msg || 'Lỗi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Lỗi toggle active:', error);
      setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, isActive: schedule.isActive } : s));
      showToast('error', 'Lỗi kết nối máy chủ');
    }
  };

  // Khi thay đổi loại lịch hẹn giờ, cài lại giờ mặc định phù hợp định dạng
  const handleTypeChange = (type) => {
    setScheduleType(type);
    const now = new Date();
    if (type === 'ONCE') {
      // Format: yyyy-MM-ddTHH:mm
      const tzoffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = (new Date(now.getTime() - tzoffset)).toISOString().slice(0, 16);
      setScheduleTime(localISOTime);
    } else {
      // Format: HH:mm
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setScheduleTime(`${hours}:${minutes}`);
    }
  };

  // Phân loại phòng cho thiết bị
  const getRoomName = (deviceId) => {
    const dev = devices.find(d => d.id === deviceId);
    if (!dev) return 'Thiết bị';
    return dev.roomName || 'Không rõ khu vực';
  };

  const formatScheduleTime = (schedule) => {
    if (schedule.scheduleType === 'DAILY') {
      return `Hằng ngày lúc ${schedule.time}`;
    } else {
      // "2026-06-08T14:30:00" -> "14:30 ngày 08/06/2026"
      try {
        const parts = schedule.time.split('T');
        if (parts.length === 2) {
          const [dateStr, timeStr] = parts;
          const [yr, mo, dy] = dateStr.split('-');
          const [hr, mn] = timeStr.split(':');
          return `${hr}:${mn} ngày ${dy}/${mo}/${yr}`;
        }
      } catch (e) { }
      return schedule.time;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full pb-28">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border transition-all duration-300 animate-in slide-in-from-right-5 ${toast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-500 animate-pulse" /> Cài đặt tự động hóa thiết bị
            </h2>
            <p className="text-slate-500 mt-2">
              Lập lịch bật tắt các module điện tự động. Tổng cộng có <strong className="text-white">{schedules.length}</strong> bộ hẹn giờ.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all outline-none border border-blue-500/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm lịch mới
          </button>
        </div>
      </header>

      {/* ================= CONTENT LIST ================= */}
      {isLoading ? (
        <div className="h-[400px] flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-400 text-sm font-bold tracking-wider uppercase">Đang tải dữ liệu từ máy chủ...</p>
        </div>
      ) : schedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schedules.map((schedule) => {
            const isActionOn = schedule.action?.state === true || schedule.action?.enable === true;
            const roomName = getRoomName(schedule.deviceId);

            // Dynamic card styling based on state and action
            let cardStyle = 'bg-[#121212] border-white/5 hover:border-white/10 hover:bg-white/[0.02]';
            let actionBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

            if (schedule.isActive) {
              if (isActionOn) {
                cardStyle = 'bg-emerald-500/[0.02] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.04] shadow-[0_0_15px_rgba(16,185,129,0.02)]';
                actionBadge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
              } else {
                cardStyle = 'bg-rose-500/[0.01] border-rose-500/20 hover:border-rose-500/30 hover:bg-rose-500/[0.03] shadow-[0_0_15px_rgba(244,63,94,0.01)]';
              }
            } else {
              cardStyle = 'bg-[#121212] border-white/5 opacity-55 hover:opacity-80';
              actionBadge = isActionOn
                ? 'bg-emerald-500/5 text-emerald-500/70 border-emerald-500/10'
                : 'bg-rose-500/5 text-rose-500/70 border-rose-500/10';
            }

            return (
              <div
                key={schedule.id}
                onClick={() => handleOpenEditModal(schedule)}
                className={`relative border p-6 rounded-[2rem] transition-all duration-300 flex flex-col justify-between min-h-[170px] group cursor-pointer overflow-hidden ${cardStyle}`}
              >
                {/* Background soft lighting */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {roomName}
                    </span>
                    <h4 className="text-base font-bold text-white transition-colors line-clamp-1 group-hover:text-blue-400">
                      {schedule.deviceLabel || schedule.deviceName}
                    </h4>
                  </div>

                  {/* Switch toggle on card */}
                  <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleToggleActive(e, schedule)}
                      className={`w-11 h-5.5 rounded-full flex items-center px-0.75 transition-colors duration-300 cursor-pointer outline-none ${schedule.isActive ? 'bg-blue-600' : 'bg-slate-700'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${schedule.isActive ? 'translate-x-5.5' : 'translate-x-0'
                        }`}></div>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mt-auto relative z-10">
                  {/* Schedule Time representation */}
                  <div className="flex items-center gap-2.5 text-slate-300 font-medium text-xs bg-black/20 px-3 py-2 rounded-xl border border-white/5">
                    {schedule.scheduleType === 'DAILY' ? (
                      <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                    )}
                    <span className="line-clamp-1">{formatScheduleTime(schedule)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    {/* Action badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${actionBadge}`}>
                      {isActionOn ? 'Hẹn Bật' : 'Hẹn Tắt'}
                    </span>

                    {/* Edit micro indicator */}
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Chi tiết
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-[350px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] text-slate-500 bg-[#121212]/30 shadow-inner">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Chưa có lịch hẹn giờ</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-xs text-center leading-relaxed">
            Hệ thống chưa thiết lập lịch hẹn giờ tự động nào. Hãy thêm mới để tự động hóa ngôi nhà của bạn.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer border border-blue-500/30"
          >
            Tạo lịch đầu tiên
          </button>
        </div>
      )}

      {/* ================= ADD/EDIT SCHEDULE MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop blur */}
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200 z-10 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/30">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                {editingSchedule ? 'Cài đặt Hẹn giờ' : 'Thêm Lịch hẹn giờ mới'}
              </h3>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-6">

              {/* Device Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Thiết bị cần lập lịch
                </label>
                <div className="relative">
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    disabled={editingSchedule} // Khóa đổi thiết bị khi sửa
                    className="w-full appearance-none bg-black/50 border border-white/5 text-slate-200 text-sm font-bold rounded-xl pl-4 pr-10 py-3.5 outline-none hover:border-white/15 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="" disabled>Chọn một thiết bị...</option>
                    {devices.map(dev => (
                      <option key={dev.id} value={dev.id}>
                        {dev.label || dev.name} ({dev.roomName || 'Không xác định'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                {devices.length === 0 && (
                  <p className="text-[10px] font-bold text-rose-400 mt-1.5 flex items-center gap-1">
                    * Không tìm thấy thiết bị điều khiển được trong phòng!
                  </p>
                )}
              </div>

              {/* Action Toggle Switch */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                  Lệnh thực hiện
                </label>
                <div className="grid grid-cols-2 gap-3 bg-black/40 p-1.5 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setActionState(true)}
                    className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${actionState
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Power className="w-3.5 h-3.5" /> BẬT Thiết bị
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionState(false)}
                    className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${!actionState
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Power className="w-3.5 h-3.5 rotate-180" /> TẮT Thiết bị
                    </div>
                  </button>
                </div>
              </div>

              {/* Schedule Type */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                  Tần suất lặp lại
                </label>
                <div className="grid grid-cols-2 gap-3 bg-black/40 p-1.5 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('DAILY')}
                    className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${scheduleType === 'DAILY'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Hằng ngày
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('ONCE')}
                    className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${scheduleType === 'ONCE'
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Một lần
                    </div>
                  </button>
                </div>
              </div>

              {/* Time Configuration */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Thời gian kích hoạt
                </label>
                {scheduleType === 'DAILY' ? (
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 text-white text-base font-bold rounded-xl px-4 py-3.5 outline-none hover:border-white/15 focus:border-blue-500 transition-colors cursor-pointer"
                    required
                  />
                ) : (
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 text-white text-sm font-bold rounded-xl px-4 py-3.5 outline-none hover:border-white/15 focus:border-blue-500 transition-colors cursor-pointer"
                    required
                  />
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                {editingSchedule && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSchedule(editingSchedule.id)}
                    className="sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer outline-none"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa lịch
                  </button>
                )}

                <div className="flex-1 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest border border-white/5 cursor-pointer outline-none transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer outline-none shadow-lg shadow-blue-900/10 transition-all border border-blue-500/30"
                  >
                    {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
