'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DeviceLog } from '@prisma/client';

// Fix Leaflet's default icon path issues in Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapView({ logs }: { logs: DeviceLog[] }) {
  // Get the most recent location to center the map
  const center = logs.length > 0 
    ? [logs[0].latitude, logs[0].longitude] as [number, number]
    : [13.7563, 100.5018] as [number, number]; // Default to Bangkok

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-xl z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {logs.map((log) => (
          <Marker 
            key={log.id} 
            position={[log.latitude, log.longitude]}
            icon={customIcon}
          >
            <Popup className="rounded-xl">
              <div className="text-sm">
                <strong className="block text-zinc-900 mb-1">{log.app_name}</strong>
                <span className={`px-2 py-0.5 rounded text-xs ${log.event_type === 'OPENED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {log.event_type}
                </span>
                <br/>
                <span className="text-zinc-500 text-xs mt-2 block">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                <span className="text-zinc-500 text-[10px] block mt-1">
                  Device: {log.device_id}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
