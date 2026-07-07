import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import UserManagement from './UserManagement';
import HomeManagement from './HomeManagement';
import DeviceManagement from './DeviceManagement';
import AuditLogs from './AuditLogs';
import FirmwareBuilder from './FirmwareBuilder';

export default function AdminDashboard({ tab = 'users' }) {
  const currentEmail = localStorage.getItem('email');
  const currentUserId = localStorage.getItem('userId');

  const addLog = () => {};


  return (
    <div className="h-full bg-[#0a0a0a] text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-hidden font-sans flex flex-col">
      {/* ================= MAIN PANEL VIEW ================= */}
      <div className="bg-[#121212] border border-white/5 rounded-xl p-6 shadow-2xl overflow-hidden flex-1 flex flex-col font-sans">
        {tab === 'users' && (
          <UserManagement
            currentEmail={currentEmail}
            currentUserId={currentUserId}
            addLog={addLog}
          />
        )}

        {tab === 'homes' && (
          <HomeManagement
            addLog={addLog}
          />
        )}

        {tab === 'devices' && (
          <DeviceManagement
            addLog={addLog}
          />
        )}

        {tab === 'logs' && (
          <AuditLogs />
        )}

        {tab === 'firmware' && (
          <FirmwareBuilder
            addLog={addLog}
          />
        )}
      </div>
    </div>
  );
}
