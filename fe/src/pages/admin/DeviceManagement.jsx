import { useState, useEffect } from 'react';
import {
  Search, Cpu, RefreshCw, CheckCircle, XCircle, AlertCircle, Wifi, Play, HelpCircle, Activity
} from 'lucide-react';
import adminService from '../../services/api/admin';

export default function DeviceManagement({ addLog }) {
  const [homes, setHomes] = useState([]);
  const [selectedHomeId, setSelectedHomeId] = useState(null);
  const [homeSearch, setHomeSearch] = useState('');
  const [loadingHomes, setLoadingHomes] = useState(false);

  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [pingingDeviceId, setPingingDeviceId] = useState(null);
  const [pingingAll, setPingingAll] = useState(false);
  const [testStatuses, setTestStatuses] = useState({});

  const fetchHomes = async (selectFirst = false) => {
    setLoadingHomes(true);
    try {
      const res = await adminService.adminGetHomes();
      if (res.code === 1000) {
        const linkedHomes = (res.data || []).filter(h => h.linked);
        setHomes(linkedHomes);
        if (linkedHomes.length > 0 && (selectFirst || !selectedHomeId)) {
          setSelectedHomeId(linkedHomes[0].id);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách ngôi nhà:', err);
    } finally {
      setLoadingHomes(false);
    }
  };

  const fetchDevices = async (homeId) => {
    if (!homeId) return;
    setLoadingDevices(true);
    try {
      const res = await adminService.adminGetHomeDevices(homeId);
      if (res.code === 1000) {
        setDevices(res.data || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách thiết bị:', err);
    } finally {
      setLoadingDevices(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchHomes(true);
  }, []);

  // Fetch devices when selected home changes
  useEffect(() => {
    if (selectedHomeId) {
      fetchDevices(selectedHomeId);
      setTestStatuses({}); // Reset test statuses when home changes
    } else {
      setDevices([]);
      setTestStatuses({});
    }
  }, [selectedHomeId]);

  const handlePingDevice = async (deviceId, name) => {
    setPingingDeviceId(deviceId);
    try {
      const res = await adminService.adminPingDevice(deviceId);
      if (res.code === 1000) {
        const isConnected = res.data;
        setTestStatuses(prev => ({
          ...prev,
          [deviceId]: isConnected ? 'CONNECTED' : 'DISCONNECTED'
        }));
        if (addLog) {
          if (isConnected) {
            addLog('Kiểm tra kết nối', `Thiết bị ${name} phản hồi thành công`, 'SUCCESS');
          } else {
            addLog('Kiểm tra kết nối', `Thiết bị ${name} mất kết nối`, 'WARNING');
          }
        }
        // Refresh local devices & homes connection summary status
        fetchDevices(selectedHomeId);
        fetchHomes(false);
      }
    } catch (err) {
      console.error('Lỗi khi kiểm tra kết nối:', err);
    } finally {
      setPingingDeviceId(null);
    }
  };

  const handlePingAll = async () => {
    if (!selectedHomeId) return;
    setPingingAll(true);
    try {
      const res = await adminService.adminPingAllDevices(selectedHomeId);
      if (res.code === 1000) {
        if (addLog) addLog('Test kết nối toàn bộ', `Đã chạy quét kiểm tra toàn bộ thiết bị trong nhà`, 'INFO');
        const newStatuses = {};
        (res.data || []).forEach(d => {
          newStatuses[d.id] = d.status;
        });
        setTestStatuses(newStatuses);
        setDevices(res.data || []);
        fetchHomes(false);
      }
    } catch (err) {
      console.error('Lỗi khi kiểm tra kết nối toàn bộ:', err);
    } finally {
      setPingingAll(false);
    }
  };

  const filteredHomes = homes.filter(h =>
    h.name.toLowerCase().includes(homeSearch.toLowerCase()) ||
    (h.owner && h.owner.toLowerCase().includes(homeSearch.toLowerCase()))
  );

  const selectedHomeName = homes.find(h => h.id === selectedHomeId)?.name || 'Chưa chọn';

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0">
      
      {/* LEFT COLUMN: Homes Table */}
      <div className="w-full md:w-[360px] flex flex-col bg-[#121212] border border-white/5 rounded-xl overflow-hidden shrink-0 min-h-0">
        <div className="p-4 border-b border-white/5 bg-black/40">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span>1. Chọn hệ thống nhà</span>
          </h3>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm ngôi nhà, chủ nhà..."
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all font-bold"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {loadingHomes ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs font-bold gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              Đang tải danh sách nhà...
            </div>
          ) : filteredHomes.length === 0 ? (
            <div className="py-12 text-center text-slate-600 text-xs font-bold">
              Không tìm thấy ngôi nhà nào.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredHomes.map((home) => {
                let statusBadge = (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                    <HelpCircle className="w-3 h-3" /> N/A
                  </span>
                );
                if (home.connectionStatus === 'Đã kết nối') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3" /> Online
                    </span>
                  );
                } else if (home.connectionStatus === 'Mất kết nối') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      <XCircle className="w-3 h-3" /> Offline
                    </span>
                  );
                } else if (home.connectionStatus === 'Chờ đồng bộ') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3" /> Chờ kết nối
                    </span>
                  );
                }

                return (
                  <div
                    key={home.id}
                    onClick={() => setSelectedHomeId(home.id)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-white/[0.02] ${
                      selectedHomeId === home.id ? 'bg-blue-600/10 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-white truncate">{home.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">Chủ nhà: {home.owner || 'Hệ thống'}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {statusBadge}
                      <span className="text-[9px] text-slate-600 font-black">{home.devices} thiết bị</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Devices Details & Diagnostics */}
      <div className="flex-1 flex flex-col bg-[#121212] border border-white/5 rounded-xl overflow-hidden min-h-0">
        <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <span>2. Quản lý thiết bị ({selectedHomeName})</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Danh sách cổng kết nối IoT và lệnh kiểm tra chẩn đoán</p>
          </div>

          {selectedHomeId && devices.length > 0 && (
            <button
              onClick={handlePingAll}
              disabled={pingingAll || loadingDevices}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-50 outline-none"
            >
              {pingingAll ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wifi className="w-3.5 h-3.5" />
              )}
              {pingingAll ? 'Đang gửi...' : 'Test kết nối toàn bộ'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {!selectedHomeId ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-12 select-none">
              <Cpu className="w-10 h-10 opacity-30" />
              <p className="text-xs font-bold">Vui lòng chọn một ngôi nhà bên trái để quản lý thiết bị.</p>
            </div>
          ) : loadingDevices ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-xs font-bold">Đang tải danh sách thiết bị...</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-12 select-none">
              <AlertCircle className="w-10 h-10 text-amber-500/30" />
              <p className="text-xs font-bold text-slate-500">Chưa cấu hình thiết bị phần cứng nào cho ngôi nhà này.</p>
            </div>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Tên thiết bị</th>
                  <th className="pb-3">Phân loại</th>
                  <th className="pb-3">Chủ đề (MQTT Topic)</th>
                  <th className="pb-3 text-center">Trạng thái chẩn đoán</th>
                  <th className="pb-3 text-right pr-2">Kiểm tra kết nối</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold">
                {devices.map((dev) => {
                  const devStatus = testStatuses[dev.id] || null;
                  let badge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-500">
                      N/A
                    </span>
                  );
                  if (devStatus === 'CONNECTED') {
                    badge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
                        Đang chạy
                      </span>
                    );
                  } else if (devStatus === 'DISCONNECTED') {
                    badge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400">
                        Mất kết nối
                      </span>
                    );
                  }

                  return (
                    <tr key={dev.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-white flex items-center gap-2">
                        <span className="truncate max-w-[150px]" title={dev.label}>{dev.label}</span>
                      </td>
                      <td className="py-3.5 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                        {dev.deviceType}
                      </td>
                      <td className="py-3.5 font-mono text-slate-400 text-[10px] truncate max-w-[200px]" title={dev.mqttTopic}>
                        {dev.mqttTopic}
                      </td>
                      <td className="py-3.5 text-center">
                        {badge}
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={() => handlePingDevice(dev.id, dev.label)}
                          disabled={pingingDeviceId === dev.id || pingingAll}
                          className="px-2.5 py-1 bg-white/5 border border-white/5 hover:bg-blue-600 hover:text-white rounded text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 outline-none disabled:opacity-50"
                        >
                          {pingingDeviceId === dev.id && (
                            <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                          )}
                          Ping
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
