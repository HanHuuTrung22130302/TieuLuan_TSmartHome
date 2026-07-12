import { useEffect, useRef, useState } from 'react';
import { X, Minus, Square, Minimize2, Pin, PinOff } from 'lucide-react';

export default function DesktopWindow({
  id,
  title,
  isOpen,
  minimized,
  maximized,
  pinned,
  x,
  y,
  width,
  height,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onPin,
  onFocus,
  onDrag,
  onResize,
  children
}) {
  const windowRef = useRef(null);
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const windowStartPosRef = useRef({ x: 0, y: 0 });

  // Focus window on click
  const handleMouseDown = (e) => {
    onFocus(id);
  };

  // Drag handlers
  const handleDragStart = (e) => {
    // Only drag with left click on the titlebar
    if (e.button !== 0) return;
    
    // Focus first
    onFocus(id);
    if (maximized) return; // Do not drag maximized windows

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    windowStartPosRef.current = { x, y };
    
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      const newX = windowStartPosRef.current.x + dx;
      const newY = windowStartPosRef.current.y + dy;
      
      // Notify parent to update x & y coordinates
      onDrag(id, newX, newY);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, onDrag, x, y]);

  // Monitor resize to report back new size
  useEffect(() => {
    if (!windowRef.current || maximized) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        // Check if there is actual size change to avoid infinite render loops
        if (Math.abs(newW - width) > 2 || Math.abs(newH - height) > 2) {
          onResize(id, Math.round(newW), Math.round(newH));
        }
      }
    });

    resizeObserver.observe(windowRef.current);
    return () => resizeObserver.disconnect();
  }, [id, width, height, onResize, maximized]);

  if (!isOpen || minimized) return null;

  const style = maximized
    ? {
        position: 'absolute',
        top: '60px', // leave room for top bar
        left: '12px',
        right: '12px',
        bottom: '88px', // leave room for dock
        zIndex: pinned ? zIndex + 10000 : zIndex,
      }
    : {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: pinned ? zIndex + 10000 : zIndex,
        resize: 'both',
        overflow: 'hidden',
      };

  return (
    <div
      ref={windowRef}
      style={style}
      onMouseDown={handleMouseDown}
      className={`flex flex-col bg-slate-900/80 backdrop-blur-xl border ${
        pinned ? 'border-amber-500/40 shadow-[0_20px_50px_rgba(245,158,11,0.15)]' : 'border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
      } rounded-3xl min-w-[280px] min-h-[180px] pointer-events-auto transition-shadow duration-300 select-none`}
      // e.stopPropagation() prevents passing drag events to underlying maps/desktop
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* WINDOW HEADER */}
      <div
        ref={dragRef}
        onMouseDown={handleDragStart}
        className={`flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0 cursor-grab active:cursor-grabbing rounded-t-3xl ${
          isDragging ? 'bg-white/5' : 'bg-slate-950/20'
        }`}
      >
        {/* macOS like traffic lights */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center group relative cursor-pointer"
            title="Đóng"
          >
            <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(id);
            }}
            className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center group relative cursor-pointer"
            title="Thu nhỏ"
          >
            <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(id);
            }}
            className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center group relative cursor-pointer"
            title="Phóng to"
          >
            {maximized ? (
              <Minimize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Square className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Title */}
        <span className="text-xs font-black tracking-wide text-slate-300 uppercase truncate px-4 pointer-events-none select-none">
          {title}
        </span>

        {/* Action icons like Pinned */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin(id);
            }}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              pinned ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={pinned ? "Bỏ ghim cửa sổ" : "Ghim cửa sổ trên cùng"}
          >
            {pinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* WINDOW BODY */}
      <div className="flex-1 min-h-0 overflow-y-auto w-full select-text cursor-default">
        {children}
      </div>
    </div>
  );
}
