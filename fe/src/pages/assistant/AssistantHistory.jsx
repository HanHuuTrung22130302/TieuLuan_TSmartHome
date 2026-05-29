import { useState, useEffect, useRef } from 'react';
import { MessageSquare, User, Bot, Clock, Cpu, Layers, HelpCircle, RefreshCw } from 'lucide-react';
import { getAssistantHistory } from '../../services/api/assistant';

export default function AssistantHistory() {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const chatContainerRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const previousScrollHeightRef = useRef(0);

  // 1. Hàm gọi API lấy dữ liệu theo Page Lazy Loading
  const fetchChatHistory = async (pageToFetch, isAppendTop = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await getAssistantHistory(pageToFetch);
      if (response && response.code === 1000) {
        const newData = Array.isArray(response.data) ? response.data : response.data.content || [];
        
        if (newData.length === 0) {
          setHasMore(false);
          setIsLoading(false);
          return;
        }

        if (isAppendTop) {
          // Ghi nhớ chiều cao trước khi thêm dữ liệu cũ vào đỉnh
          if (chatContainerRef.current) {
            previousScrollHeightRef.current = chatContainerRef.current.scrollHeight;
          }
          setHistoryLogs(prev => [...newData, ...prev]);
        } else {
          setHistoryLogs(newData);
        }

        if (newData.length < 20) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử hội thoại:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Khởi tạo trang 0 lần đầu tiên
  useEffect(() => {
    fetchChatHistory(0, false);
  }, []);

  // 2. Lắng nghe Custom Event để tự động chèn tin nhắn mới vừa gõ (Real-time Append Bottom)
  useEffect(() => {
    const handleNewChatEvent = (e) => {
      const { user, ai } = e.detail;
      // Đẩy cả cặp chat người dùng và AI vào cuối mảng danh sách
      setHistoryLogs(prev => [...prev, user, ai]);
      
      // Cuộn mượt xuống đáy để nhìn thấy tin nhắn mới nhất
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    };

    window.addEventListener('tsmarthome_new_chat', handleNewChatEvent);
    return () => window.removeEventListener('tsmarthome_new_chat', handleNewChatEvent);
  }, []);

  // 3. Xử lý vị trí thanh cuộn (Scroll Management)
  useEffect(() => {
    if (!chatContainerRef.current || historyLogs.length === 0) return;

    if (isFirstLoadRef.current) {
      // Lần đầu mở trang -> Kéo tuột xuống đáy xem tin mới nhất giống Messenger
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      isFirstLoadRef.current = false;
    } else if (previousScrollHeightRef.current > 0) {
      // Khi Lazy loading tin cũ ở đỉnh thành công -> Giữ nguyên vị trí cuộn mắt nhìn không bị giật
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      const scrollOffset = newScrollHeight - previousScrollHeightRef.current;
      chatContainerRef.current.scrollTop = scrollOffset;
      previousScrollHeightRef.current = 0;
    }
  }, [historyLogs]);

  // 4. Bắt sự kiện cuộn ngược lên đỉnh để kích hoạt Lazy Loading trang tiếp theo
  const handleScroll = () => {
    if (!chatContainerRef.current || isLoading || !hasMore) return;

    const { scrollTop } = chatContainerRef.current;
    
    // Khi người dùng cuộn kịch lên biên đỉnh (scrollTop === 0)
    if (scrollTop === 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchChatHistory(nextPage, true); // true ứng với push tin vào đầu mảng
    }
  };

  const handleRefresh = () => {
    setPage(0);
    setHasMore(true);
    isFirstLoadRef.current = true;
    fetchChatHistory(0, false);
  };

  const formatChatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getActionIcon = (actionType) => {
    if (actionType === 'CONTROL_DEVICE') return <Cpu className="w-3 h-3 text-emerald-400" />;
    if (actionType === 'BULK_CONTROL') return <Layers className="w-3 h-3 text-violet-400" />;
    return <HelpCircle className="w-3 h-3 text-amber-400" />;
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white p-4 md:p-6 overflow-hidden flex flex-col font-sans">
      
      {/* HEADER ĐIỀU HƯỚNG PANEL */}
      <div className="flex items-center justify-between mb-4 shrink-0 bg-[#121212] border border-white/5 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-wider uppercase text-slate-200">Trợ lý TSmartHome</h3>
            <p className="text-[11px] text-slate-500 font-bold mt-0.5">Cuộn ngược lên trên để xem lịch sử trò chuyện cũ hơn (Lazyloading)</p>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all outline-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading && page === 0 ? 'animate-spin text-blue-500' : ''}`} />
        </button>
      </div>

      {/* KHUNG PHÒNG CHAT CHÍNH CHIẾM HẾT MÀN HÌNH */}
      <div className="flex-1 flex flex-col bg-[#121212] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden min-h-0 mb-20">
        
        {/* List danh sách Logs cuộn bên trong */}
<div 
  ref={chatContainerRef}
  onScroll={handleScroll}
  className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
>
  {/* Trạng thái đang tải tin cũ ở đỉnh đầu */}
  {isLoading && hasMore && page > 0 && (
    <div className="text-center py-2 flex items-center justify-center gap-2 text-xs text-slate-500 font-bold">
      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" /> Đang tải tin cũ hơn...
    </div>
  )}

  {historyLogs.length > 0 ? (
    // 💡 ĐÃ SỬA: Thay đổi từ "max-w-2xl mx-auto" thành "w-full flex flex-col gap-3" để tràn viền 2 bên
    <div className="w-full flex flex-col gap-3">
      {historyLogs.map((log) => {
        const isAI = log.isAssistant;
        
        return (
          <div 
            key={log.id} 
            className={`flex items-end gap-2 max-w-[85%] ${isAI ? 'self-start flex-row' : 'self-end flex-row-reverse'}`}
          >
            {/* Ảnh Đại Diện hình tròn bé góc dưới bong bóng */}
            {isAI ? (
              <div className="w-7 h-7 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mb-1">
                <Bot className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center shrink-0 mb-1">
                <User className="w-4 h-4" />
              </div>
            )}

            {/* Khối bọc Bong bóng và mốc Giờ nhỏ */}
            <div className={`flex flex-col gap-0.5 ${isAI ? 'items-start' : 'items-end'}`}>
              
              {/* Thẻ Bong Bóng chứa chữ */}
              <div 
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-pre-wrap shadow-md border ${
                  isAI 
                    ? 'bg-slate-900 border-white/5 text-slate-200 rounded-bl-sm' 
                    : 'bg-blue-600 border-blue-500/30 text-white rounded-br-sm'
                }`}
              >
                <p className="leading-relaxed">{log.message}</p>
              </div>

              {/* Thời gian hiển thị nhỏ chân tin nhắn như Messenger */}
              <div className="flex items-center gap-1.5 px-1 mt-0.5 text-[9px] font-mono text-slate-500 font-bold">
                {isAI && getActionIcon(log.actionType)}
                <span>{formatChatTime(log.createdAt)}</span>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  ) : (
    !isLoading && (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
        <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-xs font-bold text-slate-400">Chưa có lịch sử hội thoại nào.</p>
      </div>
    )
  )}
</div>
        
      </div>
    </div>
  );
}