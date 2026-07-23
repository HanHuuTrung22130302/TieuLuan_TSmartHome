import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  Thermometer, Camera, DoorClosed, Activity, Flame,
  Lightbulb, Wind, ZoomIn, ZoomOut, Maximize,
  Mic, AppWindow, Tv, Sun, Bell, Blinds, Radar, Cpu
} from 'lucide-react';

const RADAR_BLOCKS = [
  { id: 1, left: 35.40, top: 79.72, width: 5.95, height: 9.55 },
  { id: 2, left: 41.35, top: 79.72, width: 5.95, height: 9.55 },
  { id: 3, left: 47.27, top: 76.55, width: 5.56, height: 11.26 },
  { id: 4, left: 52.83, top: 76.55, width: 5.56, height: 11.26 },
  { id: 5, left: 58.39, top: 76.55, width: 5.69, height: 11.26 },
  { id: 6, left: 35.40, top: 70.17, width: 5.95, height: 9.55 },
  { id: 7, left: 41.35, top: 70.17, width: 5.95, height: 9.55 },
  { id: 8, left: 47.27, top: 65.29, width: 5.56, height: 11.26 },
  { id: 9, left: 52.83, top: 65.29, width: 5.56, height: 11.26 },
  { id: 10, left: 58.39, top: 65.29, width: 5.69, height: 11.26 },
  { id: 11, left: 35.40, top: 60.62, width: 5.95, height: 9.55 },
  { id: 12, left: 41.35, top: 60.62, width: 5.95, height: 9.55 },
  { id: 13, left: 47.27, top: 54.03, width: 5.56, height: 11.26 },
  { id: 14, left: 52.83, top: 54.03, width: 5.56, height: 11.26 },
  { id: 15, left: 58.39, top: 54.03, width: 5.69, height: 11.26 },
];

const HALLWAY_RADAR_BLOCKS = [
  { id: 'hallway_1', label: 'H1', left: 48.78, top: 22.56, width: 4.25, height: 12.57, clipPath: 'polygon(20.94% 96.10%, 92.00% 100%, 100% 0%, 0% 1.99%)' },
  { id: 'hallway_2', label: 'H2', left: 44.25, top: 35.74, width: 7.00, height: 15.85, clipPath: 'polygon(0% 0.76%, 6.86% 100%, 87.29% 98.49%, 100% 0%)' }
];

export default function Map2D({
  devices,
  activeFilter,
  selectedSensor,
  onDeviceClick,
  radarTargets,
  transformRef
}) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'environment': return 'bg-sky-500 shadow-sky-500/50';
      case 'security': return 'bg-rose-500 shadow-rose-500/50';
      case 'safety': return 'bg-amber-500 shadow-amber-500/50';
      case 'appliance': return 'bg-violet-500 shadow-violet-500/50';
      case 'radar': return 'bg-indigo-500 shadow-indigo-500/50';
      default: return 'bg-slate-500 shadow-slate-500/50';
    }
  };

  const getDeviceIcon = (device) => {
    const nameStr = (device.label || device.name || '').toLowerCase();
    const type = device.deviceType;

    if (nameStr.includes('radar')) return Radar;
    if (nameStr.includes('pir') || nameStr.includes('chuyển động')) return Activity;
    if (nameStr.includes('dht') || nameStr.includes('nhiệt') || nameStr.includes('ẩm')) return Thermometer;
    if (nameStr.includes('mq') || nameStr.includes('khí')) return Wind;
    if (nameStr.includes('audio') || nameStr.includes('âm thanh')) return Mic;
    if (nameStr.includes('camera')) return Camera;
    if (nameStr.includes('door') || nameStr.includes('cửa')) return DoorClosed;
    if (nameStr.includes('rèm') || nameStr.includes('blind')) return Blinds;
    if (nameStr.includes('tv')) return Tv;
    if (nameStr.includes('còi') || nameStr.includes('buzzer')) return Bell;
    if (nameStr.includes('sáng') || nameStr.includes('sun')) return Sun;
    if (nameStr.includes('window') || nameStr.includes('sổ')) return AppWindow;

    if (type === 'safety') return Flame;
    if (type === 'appliance') return Lightbulb;
    if (type === 'environment') return Wind;
    return Cpu;
  };

  const filteredSensors = devices.filter(s => activeFilter === 'all' || s.deviceType === activeFilter);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950">
      {/* Grid Pattern Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10"
        style={{ backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      <div className="absolute inset-0 z-10">
        <TransformWrapper ref={transformRef} centerOnInit={false} initialScale={1.1} initialPositionX={100} initialPositionY={50} minScale={0.3} maxScale={5} wheel={{ step: 0.001, smoothStep: 1 }} pinch={{ step: 1 }} limitToBounds={false}>
          {() => (
            <TransformComponent wrapperClass="!w-screen !h-screen" contentClass="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                <div className="relative inline-block max-w-[90vw] max-h-[90vh]">
                   <img src="/apartment_map.png" alt="Bản đồ căn hộ" className="max-w-full max-h-[90vh] w-auto h-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] pointer-events-none" />

                  {/* RADAR TARGETS OVERLAY */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    {RADAR_BLOCKS.map(block => {
                      const isActive = Object.values(radarTargets).includes(block.id);
                      return (
                        <div
                          key={`block-${block.id}`}
                          className={`absolute border transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-rose-500/40 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] z-20 backdrop-blur-[1px]' : 'bg-indigo-500/5 border-indigo-500/10 z-0'}`}
                          style={{ left: `${block.left}%`, top: `${block.top}%`, width: `${block.width}%`, height: `${block.height}%` }}
                        >
                          {isActive && <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>}
                        </div>
                      )
                    })}
                    {HALLWAY_RADAR_BLOCKS.map(block => {
                      const isActive = Object.values(radarTargets).includes(block.id);
                      return (
                        <div
                          key={`block-${block.id}`}
                          className={`absolute border transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-rose-500/40 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] z-20 backdrop-blur-[1px]' : 'bg-indigo-500/5 border-indigo-500/10 z-0'}`}
                          style={{ left: `${block.left}%`, top: `${block.top}%`, width: `${block.width}%`, height: `${block.height}%`, clipPath: block.clipPath }}
                        >
                          {isActive && <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>}
                        </div>
                      );
                    })}
                  </div>

                  {/* DEVICE MARKERS */}
                  {filteredSensors.map((sensor) => {
                    const Icon = getDeviceIcon(sensor);
                    const isSelected = selectedSensor?.id === sensor.id;
                    const hasWarning = sensor.status === 'Nguy hiểm' || sensor.status === 'Cảnh báo';
                    const isOn = sensor.state === true;

                    return (
                      <button
                        key={sensor.id}
                        onClick={(e) => !sensor.isFake && onDeviceClick(e, sensor)}
                        style={{ left: `${sensor.pos2dX}%`, top: `${sensor.pos2dY}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${
                          sensor.isFake 
                            ? 'opacity-30 grayscale cursor-default pointer-events-none' 
                            : 'group hover:scale-150 hover:z-20 cursor-pointer pointer-events-auto'
                        }`}
                      >
                        {hasWarning && (
                          <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-rose-500"></div>
                        )}

                        <div className={`relative flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-white shadow-2xl border-2 
                          ${isSelected 
                            ? 'border-white ring-4 ring-white/30' 
                            : (isOn && !sensor.isFake)
                              ? 'border-emerald-500/70 ring-4 ring-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                              : 'border-white/60'
                          } 
                          ${hasWarning ? 'bg-rose-600' : getTypeColor(sensor.deviceType)}`}
                        >
                          <Icon className="w-3 h-3 md:w-4 md:h-4 drop-shadow-md" />
                        </div>

                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 rounded bg-slate-900/90 backdrop-blur-sm text-[10px] text-white font-bold tracking-tight transition-opacity whitespace-nowrap border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none">
                          {sensor.label || sensor.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </TransformComponent>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}
