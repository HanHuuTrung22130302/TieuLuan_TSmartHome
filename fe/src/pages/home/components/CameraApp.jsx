import { useState, useEffect } from 'react';
import { Camera, Wifi, RefreshCw, Video, Shield, Calendar, Image as ImageIcon } from 'lucide-react';
import { getSecuritySidebar, getCameraCaptures } from '../../../services/api/security';

export default function CameraApp() {
  const [cameras, setCameras] = useState([]);
  const [activeCamId, setActiveCamId] = useState(null);
  const [captures, setCaptures] = useState([]);
  const [cameraErrors, setCameraErrors] = useState({});
  const [cameraKeys, setCameraKeys] = useState({});
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'captures'

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const response = await getSecuritySidebar();
        if (response && response.code === 1000) {
          const list = response.data.filter(d => d.streamUrl);
          setCameras(list);
          if (list.length > 0) {
            setActiveCamId(list[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSecurityData();
  }, []);

  useEffect(() => {
    if (activeTab === 'captures') {
      const fetchCaptures = async () => {
        try {
          const activeHomeId = localStorage.getItem('activeHomeId') || sessionStorage.getItem('activeHomeId');
          if (activeHomeId) {
            const res = await getCameraCaptures(activeHomeId, 'all', 0, 10);
            if (res && res.code === 1000) {
              setCaptures(res.data);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchCaptures();
    }
  }, [activeTab]);

  const activeCamera = cameras.find(c => c.id === activeCamId);

  const handleReloadCamera = (id) => {
    setCameraErrors(prev => ({ ...prev, [id]: false }));
    setCameraKeys(prev => ({ ...prev, [id]: Date.now() }));
  };

  const handleCameraError = (id) => {
    setCameraErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col h-full text-white font-sans p-4 gap-4">
      {/* App tab selectors */}
      <div className="flex bg-black/40 rounded-xl p-0.5 border border-white/5 shrink-0">
        <button 
          onClick={() => setActiveTab('live')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${activeTab === 'live' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Video className="w-3.5 h-3.5" /> Luồng trực tiếp
        </button>
        <button 
          onClick={() => setActiveTab('captures')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${activeTab === 'captures' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Ảnh chụp cảnh báo
        </button>
      </div>

      {activeTab === 'live' ? (
        <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
          {/* Cameras list (left on desktop, top on mobile) */}
          <div className="w-full md:w-44 shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pr-1 pb-1">
            {cameras.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCamId(c.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left w-full cursor-pointer shrink-0 md:shrink ${
                  activeCamId === c.id 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-bold truncate">{c.label || c.name}</span>
              </button>
            ))}
            {cameras.length === 0 && (
              <div className="text-[10px] text-slate-500 p-2">Không tìm thấy Camera nào.</div>
            )}
          </div>

          {/* Active Camera Viewport */}
          <div className="flex-1 bg-black border border-white/10 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center">
            {activeCamera ? (
              !cameraErrors[activeCamera.id] ? (
                <img
                  key={cameraKeys[activeCamera.id] || activeCamera.id}
                  src={activeCamera.streamUrl}
                  alt={activeCamera.label}
                  className="w-full h-full object-cover scale-105"
                  onError={() => handleCameraError(activeCamera.id)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <Wifi className="w-10 h-10 text-slate-600 mb-3 opacity-50" />
                  <p className="text-slate-400 text-xs font-bold mb-4">Camera đang ngoại tuyến.</p>
                  <button
                    onClick={() => handleReloadCamera(activeCamera.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Thử lại
                  </button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600 text-xs text-center p-4">
                <Shield className="w-10 h-10 mb-2 opacity-20" />
                <p>Vui lòng chọn camera để xem.</p>
              </div>
            )}

            {activeCamera && (
              <>
                <div className="absolute top-3 left-3 bg-black/50 px-2 py-0.5 rounded-lg flex items-center gap-1.5 border border-white/10">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                  <span className="text-[8px] font-bold text-white tracking-widest uppercase">LIVE</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 pointer-events-none">
                  <p className="text-[10px] font-bold text-white leading-none">{activeCamera.label || activeCamera.name}</p>
                  <p className="text-[8px] text-slate-400 font-mono mt-1">{activeCamera.roomName || 'Hệ thống'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Captures History */
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          {captures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {captures.map(cap => (
                <div key={cap.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-md flex flex-col">
                  <div className="h-32 bg-black overflow-hidden relative">
                    <img 
                      src={cap.captureUrl} 
                      alt="capture" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[8px] font-mono text-white flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" /> {new Date(cap.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-[11px] font-bold text-white truncate">{cap.deviceName || cap.deviceId}</h4>
                    <p className="text-[8px] text-slate-500 font-semibold uppercase mt-1 tracking-wider">{cap.roomName || 'Cảnh báo hệ thống'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs">
              <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
              <p>Chưa có ảnh chụp cảnh báo nào được lưu.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
