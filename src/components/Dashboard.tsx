'use client';

import { DeviceLog } from '@prisma/client';
import { LogIn, LogOut, Smartphone } from 'lucide-react';
import dynamic from 'next/dynamic';
import { logout } from '@/app/actions';

// Leaflet map requires window object, so we disable SSR
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div className="h-[400px] w-full rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse flex items-center justify-center text-zinc-500">Loading Map...</div> });

export default function Dashboard({ logs }: { logs: DeviceLog[] }) {
  const totalLogs = logs.length;
  
  // Calculate most used app
  const appCounts = logs.reduce((acc, log) => {
    acc[log.app_name] = (acc[log.app_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedApp = Object.keys(appCounts).length > 0 
    ? Object.keys(appCounts).reduce((a, b) => appCounts[a] > appCounts[b] ? a : b)
    : 'None';

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Smartphone className="text-indigo-500" /> Activity Tracker
            </h1>
            <p className="text-zinc-400 mt-1">Real-time device usage and location monitoring</p>
          </div>
          <button 
            onClick={async () => {
              await logout();
              window.location.reload();
            }}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition-colors flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Logs</h3>
            <p className="text-4xl font-semibold text-white">{totalLogs}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-zinc-400 text-sm font-medium mb-2">Most Used App</h3>
            <p className="text-4xl font-semibold text-white">{mostUsedApp}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Location Map</h2>
            <MapView logs={logs} />
          </div>

          {/* Table Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Events</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
                    <tr>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium">Device & App</th>
                      <th className="px-6 py-4 font-medium">Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                          No activity logged yet.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{log.app_name}</div>
                            <div className="text-xs text-zinc-500">{log.device_id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
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
      </div>
    </div>
  );
}
