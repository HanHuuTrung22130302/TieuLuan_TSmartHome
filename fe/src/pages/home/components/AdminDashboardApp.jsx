import { useState } from 'react';
import { Users, Home, Cpu, Terminal, Settings } from 'lucide-react';
import UserManagement from '../../admin/UserManagement';
import HomeManagement from '../../admin/HomeManagement';
import DeviceManagement from '../../admin/DeviceManagement';
import AuditLogs from '../../admin/AuditLogs';
import FirmwareBuilder from '../../admin/FirmwareBuilder';

export default function AdminDashboardApp() {
  const [activeTab, setActiveTab] = useState('users');
  const currentEmail = localStorage.getItem('email');
  const currentUserId = localStorage.getItem('userId');
  const addLog = () => {};

  const tabs = [
    { id: 'users', label: 'Quản lý Users', icon: Users },
    { id: 'homes', label: 'Quản lý Homes', icon: Home },
    { id: 'devices', label: 'Quản lý Thiết bị', icon: Cpu },
    { id: 'logs', label: 'Quản lý Log', icon: Terminal },
    { id: 'firmware', label: 'Nạp Firmware', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full text-slate-800 font-sans bg-slate-50 overflow-hidden">
      
      {/* Navigation sidebar */}
      <div className="w-full md:w-52 border-r border-[#E2E8F0] bg-white p-3 flex flex-col gap-1 shrink-0 overflow-y-auto">
        <div className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-2">
          Hệ thống Quản trị
        </div>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all text-left cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-[#2563EB]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {activeTab === tab.id && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-[#2563EB] rounded-r"></span>}
              <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#2563EB]' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main content body panel */}
      <div className="flex-1 bg-[#F8FAFC] p-6 overflow-y-auto min-h-0 text-slate-700">
        <div className="h-full bg-white border border-slate-100 rounded-2xl p-4 shadow-sm overflow-x-auto min-w-[600px] md:min-w-0">
          {activeTab === 'users' && (
            <UserManagement
              currentEmail={currentEmail}
              currentUserId={currentUserId}
              addLog={addLog}
            />
          )}

          {activeTab === 'homes' && (
            <HomeManagement
              addLog={addLog}
            />
          )}

          {activeTab === 'devices' && (
            <DeviceManagement
              addLog={addLog}
            />
          )}

          {activeTab === 'logs' && (
            <AuditLogs />
          )}

          {activeTab === 'firmware' && (
            <FirmwareBuilder
              addLog={addLog}
            />
          )}
        </div>
      </div>
      
    </div>
  );
}
