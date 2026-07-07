import { useState, useEffect } from 'react';
import {
  Search, Plus, Trash2, Home as HomeIcon, AlertTriangle, X, RefreshCw,
  Thermometer, Droplets, Lightbulb, Wind, Eye, Bell, Tv, Plug, Shield, Cpu, Lock,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import adminService from '../../services/api/admin';

const renderDeviceIcon = (iconName) => {
  if (!iconName) return <Cpu className="w-5 h-5 text-blue-400" />;
  const normalized = iconName.toLowerCase().replace(/^(fa-|mdi-|lucide:)/, '');

  switch (normalized) {
    case 'thermometer':
    case 'temperature':
    case 'temp':
      return <Thermometer className="w-5 h-5 text-amber-500" />;
    case 'droplet':
    case 'droplets':
    case 'humidity':
    case 'humid':
      return <Droplets className="w-5 h-5 text-blue-400" />;
    case 'light':
    case 'lightbulb':
    case 'bulb':
    case 'led':
      return <Lightbulb className="w-5 h-5 text-yellow-400" />;
    case 'fan':
    case 'wind':
      return <Wind className="w-5 h-5 text-teal-400" />;
    case 'radar':
    case 'motion':
    case 'eye':
    case 'presence':
      return <Eye className="w-5 h-5 text-purple-400" />;
    case 'bell':
    case 'buzzer':
    case 'alarm':
      return <Bell className="w-5 h-5 text-rose-500" />;
    case 'tv':
    case 'ir':
      return <Tv className="w-5 h-5 text-indigo-400" />;
    case 'plug':
    case 'socket':
    case 'power':
      return <Plug className="w-5 h-5 text-emerald-400" />;
    case 'lock':
    case 'door':
      return <Lock className="w-5 h-5 text-orange-400" />;
    case 'shield':
    case 'security':
      return <Shield className="w-5 h-5 text-rose-400" />;
    default:
      return <Cpu className="w-5 h-5 text-blue-400" />;
  }
};

export default function HomeManagement({ addLog }) {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPageHomes, setCurrentPageHomes] = useState(1);
  const [itemsPerPageHomes] = useState(20);

  const [homeOwnershipFilter, setHomeOwnershipFilter] = useState('ALL');

  // Home Detail Modal State
  const [showHomeDetailModal, setShowHomeDetailModal] = useState(false);
  const [loadingHomeDetail, setLoadingHomeDetail] = useState(false);
  const [homeDetailData, setHomeDetailData] = useState(null);

  const [homesList, setHomesList] = useState([]);
  const [loadingHomes, setLoadingHomes] = useState(false);

  // Add Home Modal states
  const [showAddHomeModal, setShowAddHomeModal] = useState(false);
  const [addHomeName, setAddHomeName] = useState('');
  const [savingNewHome, setSavingNewHome] = useState(false);

  // Link Owner Modal states
  const [showLinkOwnerModal, setShowLinkOwnerModal] = useState(false);
  const [loadingUnlinkedUsers, setLoadingUnlinkedUsers] = useState(false);
  const [unlinkedUsers, setUnlinkedUsers] = useState([]);
  const [linkingHomeId, setLinkingHomeId] = useState(null);
  const [linkingHomeName, setLinkingHomeName] = useState('');
  const [searchTermLink, setSearchTermLink] = useState('');
  const [confirmLinkUser, setConfirmLinkUser] = useState(null);
  const [linkingOwner, setLinkingOwner] = useState(false);

  const handleAddHomeSubmit = async (e) => {
    e.preventDefault();
    if (!addHomeName.trim()) return;
    setSavingNewHome(true);
    try {
      const res = await adminService.adminCreateHome({
        name: addHomeName
      });
      if (res.code === 1000) {
        fetchHomes();
        setShowAddHomeModal(false);
        setAddHomeName('');
        addLog('Tạo ngôi nhà mới', `${addHomeName}`, 'SUCCESS');
      } else {
        alert(res.message || 'Lỗi khi tạo ngôi nhà');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến máy chủ.');
    } finally {
      setSavingNewHome(false);
    }
  };

  const handleOpenLinkOwnerModal = async (home) => {
    setLinkingHomeId(home.id);
    setLinkingHomeName(home.name);
    setSearchTermLink('');
    setConfirmLinkUser(null);
    setLoadingUnlinkedUsers(true);
    setShowLinkOwnerModal(true);
    try {
      const res = await adminService.adminGetUnlinkedUsers();
      if (res.code === 1000) {
        setUnlinkedUsers(res.data);
      } else {
        alert(res.message || 'Lỗi khi tải danh sách người dùng');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến máy chủ khi tải danh sách người dùng.');
    } finally {
      setLoadingUnlinkedUsers(false);
    }
  };

  const handleLinkOwnerConfirmSubmit = async () => {
    if (!linkingHomeId || !confirmLinkUser) return;
    setLinkingOwner(true);
    try {
      const res = await adminService.adminLinkOwner(linkingHomeId, confirmLinkUser.id);
      if (res.code === 1000) {
        fetchHomes();
        setShowLinkOwnerModal(false);
        addLog(
          'Liên kết chủ sở hữu',
          `Gán ngôi nhà "${linkingHomeName}" cho chủ sở hữu ${confirmLinkUser.name} (${confirmLinkUser.email})`,
          'SUCCESS'
        );
      } else {
        alert(res.message || 'Lỗi khi liên kết chủ sở hữu');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến máy chủ khi thực hiện liên kết.');
    } finally {
      setLinkingOwner(false);
      setConfirmLinkUser(null);
    }
  };

  // Config Devices states
  const [showConfigDevicesModal, setShowConfigDevicesModal] = useState(false);
  const [togglingDeviceId, setTogglingDeviceId] = useState(null);

  const handleToggleHardware = async (device) => {
    setTogglingDeviceId(device.id);
    const nextIsFake = !device.isFake;
    try {
      const res = await adminService.adminUpdateDevice(device.id, {
        label: device.label || device.name,
        isFake: nextIsFake
      });
      if (res.code === 1000) {
        // Refresh details modal content
        const detailRes = await adminService.adminGetHomeDetail(homeDetailData.id);
        if (detailRes.code === 1000) {
          setHomeDetailData(detailRes.data);
        }
        // Refresh home list so device count updates
        fetchHomes();
        addLog(
          nextIsFake ? 'Bỏ trang bị thiết bị vật lý' : 'Trang bị thiết bị vật lý',
          `${device.label || device.name} (${homeDetailData.name})`,
          nextIsFake ? 'WARNING' : 'SUCCESS'
        );
      } else {
        alert(res.message || 'Lỗi khi cập nhật thiết bị');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến máy chủ.');
    } finally {
      setTogglingDeviceId(null);
    }
  };

  const fetchHomes = async () => {
    setLoadingHomes(true);
    try {
      const res = await adminService.adminGetHomes();
      if (res.code === 1000) {
        setHomesList(res.data || []);
      } else {
        console.error(res.message);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách ngôi nhà:', err);
    } finally {
      setLoadingHomes(false);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPageHomes(1);
  }, [searchTerm, homeOwnershipFilter]);

  const deleteHome = async (homeId) => {
    const targetHome = homesList.find(h => h.id === homeId);
    if (!targetHome) return;
    if (confirm(`Bạn chắc chắn muốn giải tán ngôi nhà "${targetHome.name}"?`)) {
      try {
        const res = await adminService.adminDeleteHome(homeId);
        if (res.code === 1000) {
          fetchHomes();
          addLog('Giải tán ngôi nhà', `${targetHome.name} (Chủ nhà: ${targetHome.owner})`, 'DANGER');
        } else {
          alert(res.message || 'Lỗi khi giải tán ngôi nhà');
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi kết nối đến máy chủ.');
      }
    }
  };

  const handleViewHomeDetail = async (homeId) => {
    setLoadingHomeDetail(true);
    setShowHomeDetailModal(true);
    setHomeDetailData(null);
    try {
      const res = await adminService.adminGetHomeDetail(homeId);
      if (res.code === 1000) {
        setHomeDetailData(res.data);
      } else {
        alert(res.message || 'Lỗi khi lấy chi tiết ngôi nhà');
        setShowHomeDetailModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến máy chủ.');
      setShowHomeDetailModal(false);
    } finally {
      setLoadingHomeDetail(false);
    }
  };

  // ================= FILTERS LOGIC =================
  const filteredHomes = homesList.filter(h => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term ||
      (h.ownerEmail || '').toLowerCase().includes(term) ||
      (h.ownerPhone || '').includes(term);

    const matchesOwnership = homeOwnershipFilter === 'ALL' ||
      (homeOwnershipFilter === 'OWNED' && h.linked) ||
      (homeOwnershipFilter === 'UNOWNED' && !h.linked);

    return matchesSearch && matchesOwnership;
  });

  // Pagination Logic
  const totalPagesHomes = Math.ceil(filteredHomes.length / itemsPerPageHomes) || 1;
  const paginatedHomes = filteredHomes.slice(
    (currentPageHomes - 1) * itemsPerPageHomes,
    currentPageHomes * itemsPerPageHomes
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
            placeholder="Tìm email, sđt chủ nhà..."
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
          <span className="text-slate-400 text-sm font-bold shrink-0">Chủ sở hữu:</span>
          <select
            value={homeOwnershipFilter}
            onChange={(e) => setHomeOwnershipFilter(e.target.value)}
            className="bg-black border border-white/10 text-slate-200 text-sm font-bold rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-blue-500 transition-all"
          >
            <option value="ALL">Tất cả</option>
            <option value="OWNED">Đã có chủ</option>
            <option value="UNOWNED">Chưa có chủ</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddHomeModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ml-auto outline-none"
        >
          <Plus className="w-4 h-4" /> Thêm ngôi nhà mới
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-sm font-extrabold uppercase tracking-wider">
              <th className="py-4 pr-4 pl-2">Tên ngôi nhà</th>
              <th className="py-4 px-4">Địa chỉ / Vị trí</th>
              <th className="py-4 px-4">Chủ sở hữu</th>
              <th className="py-4 px-4">SĐT chủ nhà</th>
              <th className="py-4 px-4 text-center">Liên kết</th>
              <th className="py-4 px-4 text-center">Thiết bị liên kết</th>
              <th className="py-4 pl-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm font-semibold">
            {loadingHomes ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                  Đang tải danh sách ngôi nhà...
                </td>
              </tr>
            ) : paginatedHomes.length > 0 ? paginatedHomes.map((home) => (
              <tr key={home.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 pr-4 pl-2 font-bold text-white">
                  <span className="text-base font-extrabold">{home.name}</span>
                </td>
                <td className="py-4 px-4 text-slate-300">{home.address || '—'}</td>
                <td className="py-4 px-4 text-slate-300">
                  {home.owner ? (
                    <div className="flex flex-col">
                      <span className="font-bold">{home.owner}</span>
                      <span className="text-slate-500 text-xs font-mono">{home.ownerEmail}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">Hệ thống chưa gán chủ</span>
                  )}
                </td>
                <td className="py-4 px-4 text-slate-300 font-mono text-sm">{home.ownerPhone || '—'}</td>
                <td className="py-4 px-4 text-center">
                  {home.linked ? (
                    <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold">
                      Đã liên kết
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold">
                      Chưa liên kết
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-center font-bold text-blue-400 font-mono text-sm">{home.devices}</td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleViewHomeDetail(home.id)}
                      className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors outline-none cursor-pointer"
                    >
                      Chi tiết
                    </button>
                    {home.linked ? (
                      <button
                        onClick={() => handleOpenLinkOwnerModal(home)}
                        className="px-3.5 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors outline-none cursor-pointer"
                      >
                        Đổi chủ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenLinkOwnerModal(home)}
                        className="px-3.5 py-2 bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors outline-none cursor-pointer"
                      >
                        Liên kết
                      </button>
                    )}
                    <button
                      onClick={() => deleteHome(home.id)}
                      className="p-2.5 bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 text-rose-400 rounded-lg transition-colors cursor-pointer outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-500 font-bold text-base">
                  Không tìm thấy ngôi nhà nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-1 mt-auto pt-4 border-t border-white/10 shrink-0">
        <button
          onClick={() => setCurrentPageHomes(prev => Math.max(prev - 1, 1))}
          disabled={currentPageHomes === 1}
          className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer outline-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPagesHomes }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPageHomes(pageNum)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer outline-none ${currentPageHomes === pageNum
              ? 'bg-blue-600 border border-blue-500 text-white shadow-md shadow-blue-500/20'
              : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => setCurrentPageHomes(prev => Math.min(prev + 1, totalPagesHomes))}
          disabled={currentPageHomes === totalPagesHomes}
          className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer outline-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ================= HOME DETAIL MODAL ================= */}
      {showHomeDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div onClick={() => setShowHomeDetailModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>

          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden font-sans">
            <button
              onClick={() => setShowHomeDetailModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            {loadingHomeDetail ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 text-sm font-bold">Đang tải chi tiết ngôi nhà...</p>
              </div>
            ) : homeDetailData ? (
              <>
                <div className="mb-6 shrink-0 border-b border-white/10 pb-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-3">Chi tiết ngôi nhà</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-bold text-slate-400">
                    <div>
                      <span className="text-slate-500 font-extrabold uppercase block">Tên ngôi nhà:</span>
                      <span className="text-sm text-white font-extrabold">{homeDetailData.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-extrabold uppercase block">Chủ sở hữu:</span>
                      <span className="text-sm text-white font-extrabold">{homeDetailData.ownerName || 'Chưa gán chủ'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-extrabold uppercase block">Số điện thoại:</span>
                      <span className="text-sm text-slate-200 font-mono">{homeDetailData.ownerPhone || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-extrabold uppercase block">Email liên hệ:</span>
                      <span className="text-sm text-slate-200 font-mono">{homeDetailData.ownerEmail || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-extrabold uppercase block">Ngày thiết lập:</span>
                      <span className="text-sm text-slate-200 font-mono">
                        {homeDetailData.createdAt ? new Date(homeDetailData.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                  {homeDetailData.rooms && homeDetailData.rooms.length > 0 ? (
                    homeDetailData.rooms.map((room) => (
                      <div key={room.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                          <HomeIcon className="w-5 h-5 text-blue-400" />
                          <h4 className="text-base font-black text-white">{room.name}</h4>
                        </div>

                        {(() => {
                          const realDevices = room.devices ? room.devices.filter(d => !d.isFake) : [];
                          return realDevices.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {realDevices.map((device) => (
                                <div key={device.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between hover:border-white/20 transition-all">
                                  <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-white/5 border border-white/10 rounded-lg shrink-0">
                                        {renderDeviceIcon(device.icon)}
                                      </div>
                                      <div>
                                        <h5 className="font-extrabold text-base text-white">
                                          {device.label || 'Không có nhãn'}
                                        </h5>
                                        <span className="text-xs text-slate-400 font-semibold block mt-0.5">
                                          Tên MQTT: {device.name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5 text-xs text-slate-400 font-semibold mb-3">
                                    <div className="flex justify-between">
                                      <span>Loại thiết bị:</span>
                                      <span className="text-slate-200 uppercase font-black">{device.deviceType}</span>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                                    <span>Tạo: {device.createdAt ? new Date(device.createdAt).toLocaleDateString('vi-VN') : '—'}</span>
                                    <span>Cập nhật: {device.updatedAt ? new Date(device.updatedAt).toLocaleDateString('vi-VN') : '—'}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-sm font-bold text-center py-4">Không có thiết bị thực tế nào hoạt động.</p>
                          );
                        })()}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                      <AlertTriangle className="w-8 h-8 mb-2 text-slate-600" />
                      <p className="text-base font-bold">Ngôi nhà này chưa thiết lập phòng nào.</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 shrink-0 pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfigDevicesModal(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer outline-none"
                  >
                    Cấu hình thiết bị
                  </button>
                  <button
                    onClick={() => setShowHomeDetailModal(false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all border border-white/5 cursor-pointer outline-none"
                  >
                    Đóng
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
                <p className="text-slate-400 text-sm font-bold">Không thể tải thông tin ngôi nhà.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CONFIG DEVICES SUB-MODAL ================= */}
      {showConfigDevicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div onClick={() => setShowConfigDevicesModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>

          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#161616] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden font-sans">
            <button
              onClick={() => setShowConfigDevicesModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 shrink-0 border-b border-white/10 pb-4">
              <h4 className="text-lg font-black text-white uppercase tracking-wider mb-1">Cấu hình module phần cứng</h4>
              <p className="text-xs text-slate-500 font-bold">
                Kích hoạt trang bị thiết bị vật lý thực tế hoặc chuyển đổi sang chế độ mô phỏng ảo cho ngôi nhà.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                      <th className="py-3 px-2">Phòng</th>
                      <th className="py-3 px-3">Tên thiết bị (Label)</th>
                      <th className="py-3 px-3">Mã MQTT</th>
                      <th className="py-3 px-3 text-center">Trạng thái trang bị</th>
                      <th className="py-3 pr-2 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-semibold">
                    {homeDetailData && homeDetailData.rooms && homeDetailData.rooms.length > 0 ? (
                      homeDetailData.rooms.flatMap(room => 
                        (room.devices || []).map(device => (
                          <tr key={device.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-2 text-slate-300 font-bold text-xs">{room.name}</td>
                            <td className="py-3 px-3 font-extrabold text-white">{device.label || 'Chưa đặt tên'}</td>
                            <td className="py-3 px-3 font-mono text-xs text-slate-500">{device.name}</td>
                            <td className="py-3 px-3 text-center">
                              {device.isFake ? (
                                <span className="inline-flex px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-xs font-black uppercase">
                                  Chỉ mô phỏng
                                </span>
                              ) : (
                                <span className="inline-flex px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-xs font-black uppercase">
                                  Đã trang bị (Thật)
                                </span>
                              )}
                            </td>
                            <td className="py-3 pr-2 text-right">
                              <button
                                disabled={togglingDeviceId === device.id}
                                onClick={() => handleToggleHardware(device)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none ${
                                  device.isFake
                                    ? 'bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-400'
                                    : 'bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400'
                                }`}
                              >
                                {togglingDeviceId === device.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" />
                                ) : device.isFake ? (
                                  'Bật thiết bị'
                                ) : (
                                  'Tắt thiết bị'
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      )
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-slate-500 font-bold text-sm">
                          Chưa có phòng hay thiết bị nào được thiết lập.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 shrink-0 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowConfigDevicesModal(false)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all border border-white/5 cursor-pointer outline-none"
              >
                Đóng cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= ADD HOME MODAL ================= */}
      {showAddHomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div onClick={() => setShowAddHomeModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

          <form onSubmit={handleAddHomeSubmit} className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="text-lg font-black text-white uppercase tracking-wider">Thêm ngôi nhà mới</h4>
              <button
                type="button"
                onClick={() => setShowAddHomeModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  Tên ngôi nhà:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Căn hộ Sunshine, Nhà riêng Hà Nội..."
                  value={addHomeName}
                  onChange={(e) => setAddHomeName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white font-semibold placeholder:text-slate-600 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddHomeModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all outline-none cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={savingNewHome || !addHomeName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none flex items-center gap-1.5"
              >
                {savingNewHome ? 'Đang tạo...' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= LINK OWNER MODAL ================= */}
      {showLinkOwnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div onClick={() => setShowLinkOwnerModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#161616] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 font-sans overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex flex-col">
                <h4 className="text-lg font-black text-white uppercase tracking-wider">
                  Liên kết chủ sở hữu
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ngôi nhà: <span className="text-blue-400 font-bold">{linkingHomeName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkOwnerModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm kiếm tài khoản theo Tên, Email hoặc Số điện thoại..."
                value={searchTermLink}
                onChange={(e) => setSearchTermLink(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white font-semibold placeholder:text-slate-600 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Users Table */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {loadingUnlinkedUsers ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-slate-400 font-bold text-sm">Đang tải danh sách người dùng...</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Tên người dùng</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Số điện thoại</th>
                      <th className="py-3 px-4">Khu vực</th>
                      <th className="py-3 px-2 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = unlinkedUsers.filter(u => {
                        const term = searchTermLink.toLowerCase().trim();
                        if (!term) return true;
                        return (
                          (u.name || '').toLowerCase().includes(term) ||
                          (u.email || '').toLowerCase().includes(term) ||
                          (u.phone || '').includes(term)
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan="5" className="py-16 text-center text-slate-500 font-bold text-sm">
                              {unlinkedUsers.length === 0 
                                ? 'Không có tài khoản người dùng chưa liên kết nào trong hệ thống.' 
                                : 'Không tìm thấy người dùng phù hợp.'}
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map(u => (
                        <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                          <td className="py-3 px-2 text-white font-bold">{u.name}</td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-sm">{u.email}</td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-sm">{u.phone || '—'}</td>
                          <td className="py-3 px-4 text-slate-400">{u.region || '—'}</td>
                          <td className="py-3 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => setConfirmLinkUser(u)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors outline-none cursor-pointer"
                            >
                              Chọn
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLinkOwnerModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all outline-none cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRM LINK SUB-MODAL ================= */}
      {confirmLinkUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div onClick={() => setConfirmLinkUser(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

          <div className="relative w-full max-w-md bg-[#181818] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="text-base font-black text-white uppercase tracking-wider">Xác nhận liên kết chủ sở hữu</h4>
              <button
                type="button"
                onClick={() => setConfirmLinkUser(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-slate-300 text-sm space-y-3">
              <p>Bạn có chắc chắn muốn liên kết người dùng này làm chủ sở hữu ngôi nhà không?</p>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div>
                  <span className="text-slate-500 text-xs font-bold uppercase block">Chủ sở hữu:</span>
                  <span className="text-white font-extrabold">{confirmLinkUser.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-bold uppercase block">Email:</span>
                  <span className="text-slate-300 font-mono text-xs">{confirmLinkUser.email}</span>
                </div>
                {confirmLinkUser.phone && (
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase block">Số điện thoại:</span>
                    <span className="text-slate-300 font-mono text-xs">{confirmLinkUser.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 text-xs font-bold uppercase block">Ngôi nhà liên kết:</span>
                  <span className="text-blue-400 font-extrabold">{linkingHomeName}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmLinkUser(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all outline-none cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLinkOwnerConfirmSubmit}
                disabled={linkingOwner}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none flex items-center gap-1.5"
              >
                {linkingOwner ? 'Đang xử lý...' : 'Xác nhận liên kết'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
