import { useState, useEffect, useRef } from 'react';
import {
  Cpu, Download, Terminal, Wifi, Key, Server, Settings, Zap, Check, Play, RefreshCw, FileCode, X, Search
} from 'lucide-react';
import adminService from '../../services/api/admin';

export default function FirmwareBuilder({ addLog }) {
  const [homes, setHomes] = useState([]);
  const [selectedHomeId, setSelectedHomeId] = useState('');
  const [selectedNode, setSelectedNode] = useState('node1');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [mqttBroker] = useState('broker.emqx.io'); // Fixed/default broker
  const [mqttPort, setMqttPort] = useState('1883');
  const [mqttClientId, setMqttClientId] = useState('ESP32_TSmartHome_Node1');
  const [loadingHomes, setLoadingHomes] = useState(false);

  // Modal Home Selection States
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');

  // Terminal & Flashing Simulation States
  const [activeTab, setActiveTab] = useState('preview'); // 'preview', 'main', or 'console'
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const terminalEndRef = useRef(null);

  // Code content fetched from backend
  const [configContent, setConfigContent] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchHomesList = async () => {
      setLoadingHomes(true);
      try {
        const res = await adminService.adminGetHomes();
        if (res.code === 1000) {
          const linkedHomes = (res.data || []).filter(h => h.linked);
          setHomes(linkedHomes);
          if (linkedHomes.length > 0) {
            setSelectedHomeId(linkedHomes[0].id);
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách ngôi nhà:', err);
      } finally {
        setLoadingHomes(false);
      }
    };
    fetchHomesList();
  }, []);

  // Update client ID on node switch
  useEffect(() => {
    setMqttClientId(selectedNode === 'node1' ? 'ESP32_TSmartHome_Node1' : 'ESP32_TSmartHome_Node2');
  }, [selectedNode]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  useEffect(() => {
    if (!selectedHomeId) return;

    const fetchFirmwareCode = async () => {
      setIsGenerating(true);
      try {
        const payload = {
          homeId: selectedHomeId,
          node: selectedNode,
          wifiSsid,
          wifiPassword,
          mqttBroker,
          mqttPort: parseInt(mqttPort) || 1883,
          mqttClientId
        };
        const res = await adminService.adminGenerateFirmware(payload);
        if (res.code === 1000) {
          setConfigContent(res.data.configContent);
          setMainContent(res.data.mainContent);
        }
      } catch (err) {
        console.error('Lỗi khi sinh mã nguồn từ backend:', err);
      } finally {
        setIsGenerating(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFirmwareCode();
    }, 450);

    return () => clearTimeout(timer);
  }, [selectedHomeId, selectedNode, wifiSsid, wifiPassword, mqttBroker, mqttPort, mqttClientId]);

  const handleDownload = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    if (addLog) {
      addLog(`Xuất mã nguồn ${filename}`, `Node: ${selectedNode.toUpperCase()}`, 'INFO');
    }
  };

  const runCompilerSimulation = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setActiveTab('console');
    setCompileProgress(5);
    setTerminalLogs([]);

    const steps = [
      { msg: 'Khởi động trình biên dịch PlatformIO Core...', delay: 400, progress: 10 },
      { msg: 'Đang đọc cấu hình PlatformIO Project [env:esp32dev]...', delay: 800, progress: 20 },
      { msg: 'Đang phân giải và cài đặt các thư viện phụ thuộc...', delay: 1300, progress: 30 },
      { msg: '[Library Manager] Thư viện PubSubClient@^2.8 đã được liên kết.', delay: 1700, progress: 35 },
      { msg: '[Library Manager] Thư viện ArduinoJson@^7.0.4 đã được liên kết.', delay: 2000, progress: 40 },
      { msg: '[Library Manager] Thư viện ESP32Servo@^3.0.5 đã được liên kết.', delay: 2300, progress: 45 },
      { msg: 'Bắt đầu dịch mã nguồn src/main.cpp...', delay: 2800, progress: 55 },
      { msg: 'Đang biên dịch mã nguồn Config.h...', delay: 3300, progress: 65 },
      { msg: 'Đang thực hiện liên kết (Linking target .pio/build/esp32dev/firmware.bin)...', delay: 4000, progress: 80 },
      { msg: 'Kích thước Firmware: 874,210 bytes (29.1% bộ nhớ Flash). Biên dịch THÀNH CÔNG.', delay: 4500, progress: 90 },
      { msg: 'Đang tìm kiếm cổng Serial kết nối thiết bị... Phát hiện cổng COM4 (ESP32 DevKit V1).', delay: 5200, progress: 92 },
      { msg: 'Đang thực hiện tải code lên chip ESP32 (Flashing at 115200 baud)...', delay: 5800, progress: 94 },
      { msg: 'Writing at 0x00010000... (25%) -> (50%) -> (75%) -> (100%) [OK]', delay: 6800, progress: 97 },
      { msg: 'Đang khởi động lại chip ESP32 (Hard resetting via RTS pin)...', delay: 7500, progress: 99 },
      { msg: '[ESP32] Kết nối mạng WiFi SSID: "' + wifiSsid + '"... Thành công!', delay: 8200, progress: 100 },
      { msg: '[ESP32] NTP Time synchronized successfully.', delay: 8800, progress: 100 },
      { msg: '[ESP32] Đang kết nối tới MQTT Broker "' + mqttBroker + '" với Client ID "' + mqttClientId + '"...', delay: 9400, progress: 100 },
      { msg: '[ESP32] KẾT NỐI MQTT THÀNH CÔNG! Đang lắng nghe trên chủ đề lệnh điều khiển.', delay: 10000, progress: 100 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, step.msg]);
        setCompileProgress(step.progress);
        if (index === steps.length - 1) {
          setIsCompiling(false);
          if (addLog) {
            addLog(`Nạp code thành công`, `Cổng: COM4 - ${selectedNode.toUpperCase()}`, 'SUCCESS');
          }
        }
      }, step.delay);
    });
  };

  const selectedHomeName = homes.find(h => h.id === selectedHomeId)?.name || '';

  // Filter homes based on search query (Home Name, Owner, Phone, Email)
  const filteredHomes = homes.filter(home => {
    const query = homeSearchQuery.toLowerCase();
    return (
      (home.name && home.name.toLowerCase().includes(query)) ||
      (home.owner && home.owner.toLowerCase().includes(query)) ||
      (home.ownerPhone && home.ownerPhone.toLowerCase().includes(query)) ||
      (home.ownerEmail && home.ownerEmail.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
      {/* Left column - Configurations */}
      <div className="w-full lg:w-[380px] flex flex-col gap-4 overflow-y-auto shrink-0 bg-[#121212] border border-white/5 rounded-xl p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div>
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-3">1. Cấu hình vị trí</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Chọn ngôi nhà</label>
              {loadingHomes ? (
                <div className="flex items-center gap-2 py-2 bg-black border border-white/10 rounded-lg justify-center text-xs text-slate-400 font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  Đang tải danh sách...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsHomeModalOpen(true)}
                  className="w-full bg-black border border-white/10 text-slate-200 text-xs font-bold rounded-lg px-3 py-2.5 outline-none hover:bg-white/5 transition-all text-left flex justify-between items-center cursor-pointer"
                >
                  <span className="truncate">{selectedHomeName || 'Chọn ngôi nhà...'}</span>
                  <span className="text-[10px] text-blue-500 font-bold uppercase underline shrink-0 ml-2">Chọn</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-3">2. Lựa chọn Node</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedNode('node1')}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer outline-none ${
                selectedNode === 'node1'
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-md'
                  : 'bg-black border-white/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              Node 1 (Cảm biến)
            </button>
            <button
              type="button"
              onClick={() => setSelectedNode('node2')}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer outline-none ${
                selectedNode === 'node2'
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-md'
                  : 'bg-black border-white/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              Node 2 (Actuator/Đèn)
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">
            {selectedNode === 'node1' 
              ? 'Gồm: DHT22, MQ135, MAX9814 (Sound), PIR x2, Còi Buzzer, Cảm biến Lửa bếp, Rèm cửa Servo.'
              : 'Gồm: 6 kênh điều khiển Relay Đèn (Phòng khách, Ăn, Ban công, Hành lang), 2 Radar phụ.'}
          </p>
        </div>

        <div className="border-t border-white/5 pt-4">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-3">3. Cấu hình Kết nối</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-slate-400" /> Tên WiFi (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="Nhập tên WiFi"
                className="w-full bg-black border border-white/10 text-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Key className="w-3 h-3 text-slate-400" /> Mật khẩu WiFi
              </label>
              <input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Mật khẩu WiFi"
                className="w-full bg-black border border-white/10 text-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" /> MQTT Client ID
              </label>
              <input
                type="text"
                value={mqttClientId}
                onChange={(e) => setMqttClientId(e.target.value)}
                placeholder="Client ID"
                className="w-full bg-black border border-white/10 text-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 mt-auto">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-3">4. Thao tác nạp</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={runCompilerSimulation}
              disabled={isCompiling || isGenerating}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed outline-none"
            >
              <Zap className="w-4 h-4" /> Biên dịch & Nạp Code
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDownload('Config.h', configContent)}
                disabled={!configContent}
                className="py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3 h-3" /> Config.h
              </button>
              <button
                type="button"
                onClick={() => handleDownload('main.cpp', mainContent)}
                disabled={!mainContent}
                className="py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3 h-3" /> main.cpp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Terminal and Code previews */}
      <div className="flex-1 bg-[#121212] border border-white/5 rounded-xl flex flex-col overflow-hidden min-h-0">
        {/* Top Tabs */}
        <div className="flex bg-black/40 border-b border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all outline-none cursor-pointer ${
              activeTab === 'preview'
                ? 'border-blue-500 text-white bg-white/[0.02]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" /> Config.h
          </button>
          <button
            onClick={() => setActiveTab('main')}
            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all outline-none cursor-pointer ${
              activeTab === 'main'
                ? 'border-blue-500 text-white bg-white/[0.02]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" /> main.cpp
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all outline-none cursor-pointer ${
              activeTab === 'console'
                ? 'border-blue-500 text-white bg-white/[0.02]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" /> Trình biên dịch (COM4)
          </button>

          {(isCompiling || isGenerating) && (
            <div className="ml-auto pr-6 flex items-center gap-3">
              <span className="text-[10px] text-blue-400 font-extrabold animate-pulse">
                {isGenerating ? 'ĐANG SINH MÃ...' : `ĐANG BIÊN DỊCH ${compileProgress}%`}
              </span>
              {!isGenerating && (
                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${compileProgress}%` }}></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Content Panel */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full bg-[#0a0a0a]">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-slate-400 text-[10px] font-bold">
                <span>MÃ NGUỒN CẤU HÌNH CONFIG.H TẠO CHO {selectedNode.toUpperCase()} ({selectedHomeName || 'Demo Home'})</span>
                <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Khởi tạo từ Backend thành công
                </span>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap select-all font-mono leading-relaxed text-xs">
                {configContent || '// Đang sinh mã cấu hình...'}
              </pre>
            </div>
          )}

          {activeTab === 'main' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-slate-400 text-[10px] font-bold">
                <span>MÃ NGUỒN THỰC THI MAIN.CPP CHO {selectedNode.toUpperCase()} ({selectedHomeName || 'Demo Home'})</span>
                <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Khởi tạo từ Backend thành công
                </span>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap select-all font-mono leading-relaxed text-xs">
                {mainContent || '// Đang sinh mã nguồn...'}
              </pre>
            </div>
          )}

          {activeTab === 'console' && (
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                <div className="text-slate-500 font-extrabold border-b border-white/5 pb-2 mb-3 text-[10px] flex items-center gap-1.5 select-none">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span>TERMINAL OUTPUT CONSOLE (ESP32 CODES BUILDER)</span>
                </div>

                {terminalLogs.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 select-none py-12">
                    <Terminal className="w-8 h-8 opacity-40" />
                    <p className="font-bold">Trống. Bấm "Biên dịch & Nạp Code" để chạy giả lập PlatformIO.</p>
                  </div>
                )}

                {terminalLogs.map((logLine, i) => {
                  let textClass = 'text-slate-300';
                  if (logLine.includes('THÀNH CÔNG') || logLine.includes('KẾT NỐI MQTT THÀNH CÔNG') || logLine.includes('Thành công!')) {
                    textClass = 'text-emerald-400 font-extrabold';
                  } else if (logLine.includes('Lỗi') || logLine.includes('Cảnh báo')) {
                    textClass = 'text-rose-400 font-bold';
                  } else if (logLine.startsWith('⚙️') || logLine.startsWith('🔋') || logLine.startsWith('🛠️') || logLine.startsWith('⚡')) {
                    textClass = 'text-blue-400';
                  }

                  return (
                    <div key={i} className={`py-0.5 leading-relaxed font-mono text-[11px] ${textClass}`}>
                      {logLine}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Select Home Modal Overlay */}
      {isHomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Danh sách Ngôi nhà</h3>
              <button
                onClick={() => setIsHomeModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 bg-black/40 border-b border-white/5 shrink-0">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên nhà, tên chủ nhà, số điện thoại hoặc email..."
                  value={homeSearchQuery}
                  onChange={(e) => setHomeSearchQuery(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            {/* Modal Table Body */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Tên ngôi nhà</th>
                    <th className="pb-3">Tên chủ nhà</th>
                    <th className="pb-3">Số điện thoại</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHomes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500 font-bold">
                        Không tìm thấy ngôi nhà nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredHomes.map(home => (
                      <tr key={home.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-white max-w-[150px] truncate">{home.name}</td>
                        <td className="py-3.5 pr-2 font-semibold text-slate-300">{home.owner || 'Hệ thống'}</td>
                        <td className="py-3.5 pr-2 font-mono text-slate-400">{home.ownerPhone || 'N/A'}</td>
                        <td className="py-3.5 pr-2 font-mono text-slate-400 truncate max-w-[180px]">{home.ownerEmail || 'N/A'}</td>
                        <td className="py-3.5 text-center">
                          <button
                            onClick={() => {
                              setSelectedHomeId(home.id);
                              setIsHomeModalOpen(false);
                            }}
                            className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                              selectedHomeId === home.id
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                          >
                            {selectedHomeId === home.id ? 'Đang chọn' : 'Chọn'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
