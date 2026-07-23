import { useState, useEffect } from 'react';
import {
  Clock, Plus, Trash2, Edit3, Power, Calendar, RefreshCw,
  CheckCircle2, AlertTriangle, X, ChevronDown, Check, HelpCircle
} from 'lucide-react';
import { getRooms } from '../../../services/api/room';
import { getDevices } from '../../../services/api/device';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../../services/api/schedule';

export default function SchedulesApp() {
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

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setEditingSchedule(null);
    setSelectedDeviceId(devices.length > 0 ? devices[0].id : '');
    setActionState(true);
    setScheduleType('DAILY');

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setScheduleTime(`${hours}:${minutes}`);

    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedDeviceId(schedule.deviceId);

    const isActionOn = schedule.action?.state === true || schedule.action?.enable === true;
    setActionState(isActionOn);
    setScheduleType(schedule.scheduleType);

    if (schedule.scheduleType === 'ONCE') {
      const formattedTime = schedule.time ? schedule.time.substring(0, 16) : '';
      setScheduleTime(formattedTime);
    } else {
      setScheduleTime(schedule.time || '');
    }

    setIsModalOpen(true);
  };

  // Save schedule
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
        const res = await updateSchedule(editingSchedule.id, payload);
        if (res && res.code === 1000) {
          setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? res.data : s));
          showToast('success', 'Cập nhật lịch hẹn giờ thành công');
          setIsModalOpen(false);
        } else {
          showToast('error', res.msg || 'Có lỗi xảy ra');
        }
      } else {
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
      showToast('error', 'Lưu lịch hẹn giờ thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn giờ này?')) return;
    try {
      const res = await deleteSchedule(id);
      if (res && res.code === 1000) {
        setSchedules(prev => prev.filter(s => s.id !== id));
        showToast('success', 'Đã xóa lịch hẹn giờ');
      } else {
        showToast('error', res.msg || 'Xóa thất bại');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Có lỗi xảy ra khi xóa');
    }
  };

  // Toggle active status
  const handleToggleActive = async (schedule) => {
    const nextActive = !schedule.isActive;
    const payload = {
      deviceId: schedule.deviceId,
      action: schedule.action,
      scheduleType: schedule.scheduleType,
      time: schedule.time,
      isActive: nextActive
    };

    try {
      // Optimistic UI update
      setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, isActive: nextActive } : s));
      const res = await updateSchedule(schedule.id, payload);
      if (!res || res.code !== 1000) {
        // Revert if error
        setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, isActive: schedule.isActive } : s));
        showToast('error', 'Không thể bật/tắt lịch hẹn giờ');
      }
    } catch (error) {
      console.error(error);
      setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, isActive: schedule.isActive } : s));
    }
  };

  const getDeviceLabel = (deviceId) => {
    const d = devices.find(x => x.id === deviceId);
    return d ? (d.label || d.name) : deviceId;
  };

  const getRoomLabel = (deviceId) => {
    const d = devices.find(x => x.id === deviceId);
    if (!d) return 'Hệ thống';
    const r = rooms.find(x => x.id === d.roomId);
    return r ? r.name : 'Chưa xếp phòng';
  };

  const formatScheduleTime = (timeStr, type) => {
    if (!timeStr) return '';
    if (type === 'ONCE') {
      try {
        const date = new Date(timeStr);
        return date.toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch {
        return timeStr;
      }
    }
    return timeStr; // HH:mm format for DAILY
  };

  return (
    <div className="flex flex-col h-full text-white font-sans p-4 gap-4 overflow-hidden relative">
      
      {/* Toast Alert overlay inside the window app */}
      {toast && (
        <div className="absolute top-2 right-2 z-50 flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold shadow-lg animate-in fade-in duration-300">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Control bar */}
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-500" /> Hẹn giờ tự động
        </h3>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-[10px] font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Tạo lịch mới
        </button>
      </div>

      {/* Schedules list */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          </div>
        ) : schedules.length > 0 ? (
          schedules.map(item => {
            const isStateOn = item.action?.state === true || item.action?.enable === true;
            return (
              <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xs text-white truncate max-w-[150px]">{getDeviceLabel(item.deviceId)}</h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isStateOn ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      <Power className="w-2.5 h-2.5" />
                      {isStateOn ? 'BẬT' : 'TẮT'}
                    </span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                      {item.scheduleType === 'DAILY' ? 'Hàng ngày' : 'Một lần'}
                    </span>
                  </div>

                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                    <span>Phòng: {getRoomLabel(item.deviceId)}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400 flex items-center gap-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatScheduleTime(item.time, item.scheduleType)}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Toggle active switch */}
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-300 cursor-pointer border border-black/10 ${
                      item.isActive ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                      item.isActive ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </button>

                  <button 
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-colors cursor-pointer"
                    title="Sửa"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteSchedule(item.id)}
                    className="p-1.5 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 rounded-lg border border-rose-500/10 transition-colors cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <Clock className="w-10 h-10 mb-2 opacity-20" />
            <p>Chưa có lịch hẹn giờ nào.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal (Floating inside the app) */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveSchedule}
            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-200">
                {editingSchedule ? 'Cập nhật lịch hẹn' : 'Thêm lịch hẹn mới'}
              </h4>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Chọn Thiết bị</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-blue-500"
                  required
                >
                  <option value="" disabled>-- Chọn thiết bị --</option>
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.label || d.name} ({getRoomLabel(d.id)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Hành động</label>
                  <select
                    value={actionState ? 'true' : 'false'}
                    onChange={(e) => setActionState(e.target.value === 'true')}
                    className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-blue-500"
                  >
                    <option value="true">BẬT thiết bị</option>
                    <option value="false">TẮT thiết bị</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Chu kỳ lặp</label>
                  <select
                    value={scheduleType}
                    onChange={(e) => {
                      setScheduleType(e.target.value);
                      setScheduleTime('');
                    }}
                    className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-blue-500"
                  >
                    <option value="DAILY">Hàng ngày (Lặp)</option>
                    <option value="ONCE">Một lần (Once)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cài đặt Thời gian</label>
                {scheduleType === 'ONCE' ? (
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                ) : (
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                    required
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2.5 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase rounded-xl transition-all shadow-md flex items-center gap-1 cursor-pointer"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Lưu lại
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
