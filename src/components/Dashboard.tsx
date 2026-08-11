'use client';

import { useState } from 'react';
import { DeviceLog } from '@prisma/client';
import { LogIn, LogOut, Smartphone, MonitorSmartphone, LayoutGrid } from 'lucide-react';
import dynamic from 'next/dynamic';
import { logout } from '@/app/actions';

// Leaflet map requires window object, so we disable SSR
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div className="h-[400px] w-full rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse flex items-center justify-center text-zinc-500">Loading Map...</div> });

export default function Dashboard({ logs }: { logs: DeviceLog[] }) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Extract unique devices
  const uniqueDevices = Array.from(new Set(logs.map(log => log.device_id))).sort();

  // Filter logs based on selected device
  const filteredLogs = selectedDevice ? logs.filter(log => log.device_id === selectedDevice) : logs;

  const totalLogs = filteredLogs.length;
  
  // Calculate most used app for filtered logs
  const appCounts = filteredLogs.reduce((acc, log) => {
    acc[log.app_name] = (acc[log.app_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedApp = Object.keys(appCounts).length > 0 
    ? Object.keys(appCounts).reduce((a, b) => appCounts[a] > appCounts[b] ? a : b)
    : 'None';

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900/40 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col p-4 md:p-6 shrink-0 md:sticky md:top-0 md:h-screen">
        <div className="flex items-center gap-2 mb-8">
          <Smartphone className="text-indigo-500" />
          <h1 className="text-xl font-bold tracking-tight text-white">
            Activity Tracker
          </h1>
        </div>
        
        <div className="space-y-1 flex-1">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-3">Devices</div>
          
          <button 
            onClick={() => setSelectedDevice(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDevice === null ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
          >
            <LayoutGrid size={18} />
            All Devices
          </button>
          
          {uniqueDevices.map(device => (
            <button 
              key={device}
              onClick={() => setSelectedDevice(device)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDevice === device ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
            >
              <MonitorSmartphone size={18} />
              {device}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-zinc-800/50 pt-4">
          <button 
            onClick={async () => {
              await logout();
              window.location.reload();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-zinc-800/50 pb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {selectedDevice ? selectedDevice : 'All Devices'} Overview
            </h2>
            <p className="text-zinc-400 mt-1">Real-time device usage and location monitoring</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-wider">Total Logs</h3>
              <p className="text-4xl font-semibold text-white">{totalLogs}</p>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-wider">Most Used App</h3>
              <p className="text-4xl font-semibold text-white truncate">{mostUsedApp}</p>
            </div>
          </div>

          {/* Map and Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-zinc-200">Location Map</h3>
              <MapView logs={filteredLogs} />
            </div>

            {/* Table Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-zinc-200">Recent Events</h3>
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800/50 sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium">Device & App</th>
                      <th className="px-6 py-4 font-medium">Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                          No activity logged yet.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b border-zinc-800/30 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{log.app_name}</div>
                            <div className="text-xs text-zinc-500">{log.device_id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              log.event_type === 'OPENED' 
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {log.event_type}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
