import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Html, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import {
  Thermometer, Camera, DoorClosed, Activity, Flame,
  Lightbulb, Wind, Mic, AppWindow, Tv, Sun, Bell, Blinds, Radar, Cpu, AlertTriangle, CheckCircle2
} from 'lucide-react';

const RADAR_BLOCKS_3D = [
  { id: 5, position: [-3.2, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 4, position: [-2.0, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 3, position: [-0.8, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 2, position: [0.4, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 1, position: [1.6, 0.02, 4.3], args: [1.2, 0.9] },
  { id: 10, position: [-3.2, 0.02, 3.18], args: [1.2, 1.1] },
  { id: 9, position: [-2.0, 0.02, 3.18], args: [1.2, 1.1] },
  { id: 8, position: [-0.8, 0.02, 3.18], args: [1.2, 1.1] },
  { id: 7, position: [0.4, 0.02, 3.18], args: [1.2, 1.1] },
  { id: 6, position: [1.6, 0.02, 3.18], args: [1.2, 1.1] },
  { id: 15, position: [-3.2, 0.02, 1.5], args: [1.2, 1.4] },
  { id: 14, position: [-2.0, 0.02, 1.5], args: [1.2, 1.4] },
  { id: 13, position: [-0.8, 0.02, 1.5], args: [1.2, 1.4] },
  { id: 12, position: [0.4, 0.02, 1.5], args: [1.2, 1.4] },
  { id: 11, position: [1.6, 0.02, 1.5], args: [1.2, 1.4] },
];

const HALLWAY_RADAR_BLOCKS_3D = [
  { id: 'hallway_1', position: [0.14, 0.02, -2.28], args: [1.2, 1.8] },
  { id: 'hallway_2', position: [0.06, 0.02, -1.25], args: [1.4, 1.8] }
];

function HouseModel() {
  const { scene } = useGLTF('/web.glb');
  return <primitive object={scene} />;
}

export default function Map3D({
  devices,
  activeFilter,
  selectedSensor,
  onDeviceClick,
  radarTargets
}) {
  const getTypeColor = (device) => {
    if (device.isFake) return 'bg-slate-800/40 text-slate-500 border-slate-700/50';

    switch (device.deviceType) {
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
      <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />
        
        <Suspense fallback={<Html center><div className="text-white font-bold animate-pulse text-xs uppercase tracking-widest bg-slate-900/80 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full">Đang tải mô hình...</div></Html>}>
          <group scale={1.3} rotation={[0, Math.PI, 0]} position={[0, 0, 0]}>
            <HouseModel />

            {/* 3D RADAR TARGET BLOCKS */}
            {RADAR_BLOCKS_3D.map(block => {
              const isActive = Object.values(radarTargets).includes(block.id);
              return (
                <mesh key={`block-3d-${block.id}`} position={block.position} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={block.args} />
                  <meshBasicMaterial color={isActive ? "#f43f5e" : "#6366f1"} transparent opacity={isActive ? 0.4 : 0.02} depthWrite={false} />
                </mesh>
              )
            })}

            {/* 3D HALLWAY RADAR BLOCKS */}
            {HALLWAY_RADAR_BLOCKS_3D.map(block => {
              const isActive = Object.values(radarTargets).includes(block.id);
              return (
                <mesh key={`block-hw-3d-${block.id}`} position={block.position} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={block.args} />
                  <meshBasicMaterial color={isActive ? "#f43f5e" : "#6366f1"} transparent opacity={isActive ? 0.4 : 0.02} depthWrite={false} />
                </mesh>
              )
            })}

            {/* 3D MARKERS */}
            {filteredSensors.map((sensor) => {
              const MarkerIcon = getDeviceIcon(sensor);
              const isSelected = selectedSensor?.id === sensor.id;
              const hasWarning = sensor.status === 'Nguy hiểm' || sensor.status === 'Cảnh báo';
              const colorClass = getTypeColor(sensor);

              return (
                <Html key={sensor.id} position={[sensor.pos3dX, sensor.pos3dY || 1.2, sensor.pos3dZ]} center zIndexRange={[100, 0]}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!sensor.isFake) onDeviceClick(e, sensor);
                    }}
                    className={`relative transition-all duration-300 outline-none ${
                      sensor.isFake 
                        ? 'opacity-30 grayscale cursor-default pointer-events-none' 
                        : 'group cursor-pointer pointer-events-auto hover:scale-150'
                    } ${isSelected ? 'scale-150 z-20' : ''}`}
                  >
                    {hasWarning && !sensor.isFake && (
                      <div className="absolute inset-0 rounded-full animate-ping opacity-60 bg-rose-500"></div>
                    )}

                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white shadow-xl border-2 transition-all 
                      ${isSelected 
                        ? 'border-white ring-4 ring-white/30' 
                        : (sensor.state === true && !sensor.isFake)
                          ? 'border-emerald-500/70 ring-4 ring-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          : 'border-white/60'
                      } 
                      ${hasWarning && !sensor.isFake ? 'bg-rose-600 border-white/60' : colorClass}`}
                    >
                      <MarkerIcon className="w-4 h-4 drop-shadow-md" />
                    </div>

                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900/95 backdrop-blur text-white text-[10px] font-bold rounded-lg transition-opacity whitespace-nowrap border border-slate-700 shadow-2xl pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {sensor.label || sensor.name}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-t border-l border-slate-700 rotate-45"></div>
                    </div>
                  </button>
                </Html>
              );
            })}
          </group>
          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
        </Suspense>
        
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} maxDistance={40} />
      </Canvas>
    </div>
  );
}
