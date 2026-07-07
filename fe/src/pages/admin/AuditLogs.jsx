import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import adminService from '../../services/api/admin';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Date Range Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination State (1-indexed to match UserManagement)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        // Send currentPage - 1 to backend (backend requires 0-indexed page)
        const res = await adminService.adminGetLogs(searchTerm, currentPage - 1, pageSize, startDate, endDate);
        if (res && res.code === 1000 && res.data) {
          setLogs(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalElements(res.data.totalElements || 0);
        }
      } catch (e) {
        console.error('Lỗi khi tải nhật ký thao tác:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [searchTerm, currentPage, startDate, endDate]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
    setSearchTerm(searchInput);
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    try {
      const date = new Date(dateTimeStr);
      const pad = (n) => String(n).padStart(2, '0');
      const day = pad(date.getDate());
      const month = pad(date.getMonth() + 1);
      const year = date.getFullYear();
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      return `[${day}/${month}/${year} ${hours}:${minutes}:${seconds}]`;
    } catch (e) {
      return `[${dateTimeStr}]`;
    }
  };

  const filteredAudits = logs.filter(a => {
    return roleFilter === 'ALL' || a.type === roleFilter;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Specific Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/5 border border-white/5 rounded-xl shrink-0 font-sans">
        {/* Local Search Input */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg pl-4 pr-1.5 py-1.5 w-full sm:w-[450px] md:w-[500px] transition-all focus-within:border-blue-500/50">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm kiếm nhật ký thao tác theo email hoặc hành động..."
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500 font-bold"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-all cursor-pointer shadow-md shadow-blue-600/10 shrink-0 outline-none"
            title="Tìm kiếm"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2 font-sans text-sm">
          <span className="text-slate-400 font-bold">Từ ngày:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1); // Reset page on date change
            }}
            className="bg-black border border-white/10 text-slate-200 font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 font-sans text-sm">
          <span className="text-slate-400 font-bold">Đến ngày:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1); // Reset page on date change
            }}
            className="bg-black border border-white/10 text-slate-200 font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 font-sans">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1); // Reset page on filter change
            }}
            className="bg-black border border-white/10 text-slate-200 text-sm font-bold rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-blue-500 transition-all"
          >
            <option value="ALL">Tất cả Mức độ</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="DANGER">DANGER</option>
          </select>
        </div>
      </div>

      {/* Logs Content List */}
      <div className="font-mono text-xs text-slate-400 space-y-2 flex-1 overflow-y-auto min-h-0 bg-black/40 p-4 border border-white/5 rounded-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-bold text-sm font-sans">
            Đang tải dữ liệu...
          </div>
        ) : filteredAudits.length > 0 ? filteredAudits.map((audit) => (
          <div key={audit.id} className="flex flex-wrap items-center gap-3 p-2 rounded hover:bg-white/[0.02] transition-colors leading-relaxed text-sm border-b border-white/[0.02]">
            <span className="text-slate-500 shrink-0 font-bold select-none font-mono">
              {formatDateTime(audit.createdAt)}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider shrink-0 ${
              audit.type === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              audit.type === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              audit.type === 'DANGER' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {audit.type}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
              audit.executed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {audit.executed ? 'Thành công' : 'Thất bại'}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-slate-200 font-bold">{audit.email}</span>
              <span className="text-slate-400 mx-2">—</span>
              <span className="text-blue-400 font-bold">{audit.action}</span>
              <span className="text-slate-500 mx-2">&gt;</span>
              <span className="text-slate-300 italic font-sans text-xs">{audit.target}</span>
            </div>
          </div>
        )) : (
          <div className="py-12 text-center text-slate-600 font-bold text-sm font-sans">
            Không tìm thấy nhật ký thao tác nào phù hợp.
          </div>
        )}
      </div>

      {/* Pagination Controls (Matches UserManagement styling exactly) */}
      <div className="flex justify-center items-center gap-1 mt-auto pt-4 border-t border-white/10 shrink-0">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer outline-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer outline-none ${
              currentPage === pageNum
                ? 'bg-blue-600 border border-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
          className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer outline-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
