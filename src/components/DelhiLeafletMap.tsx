import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { CivicIncident } from '../data/civicData';

interface DelhiLeafletMapProps {
  incidents: CivicIncident[];
  selectedIncident: CivicIncident | null;
  onSelectIncident: (incident: CivicIncident) => void;
  isDark: boolean;
}

export const DelhiLeafletMap: React.FC<DelhiLeafletMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  isDark,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map centered on Delhi
      const map = L.map(mapContainerRef.current, {
        center: [28.6139, 77.2090],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      });

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Free OpenStreetMap tiles (No API key needed)
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Render Markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      incidents.forEach((inc) => {
        let color = '#3B82F6';
        if (inc.department === 'MCD') color = '#F59E0B';
        if (inc.department === 'PWD') color = '#3B82F6';
        if (inc.department === 'DJB') color = '#06B6D4';
        if (inc.department === 'DPCC') color = '#10B981';

        const isSelected = selectedIncident?.id === inc.id;

        // Custom HTML Marker Pin
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              background: ${color};
              width: ${isSelected ? '28px' : '22px'};
              height: ${isSelected ? '28px' : '22px'};
              border-radius: 50%;
              border: 2px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-family: monospace;
              font-size: 10px;
              font-weight: bold;
              transition: all 0.2s ease;
            ">
              ${inc.department[0]}
            </div>
          `,
          iconSize: [isSelected ? 28 : 22, isSelected ? 28 : 22],
          iconAnchor: [isSelected ? 14 : 11, isSelected ? 14 : 11],
        });

        const marker = L.marker(inc.coordinates, { icon: customIcon });

        // Cluster Radius Circle
        const circle = L.circle(inc.coordinates, {
          radius: 120,
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 1,
        });

        marker.on('click', () => {
          onSelectIncident(inc);
        });

        marker.bindPopup(`
          <div style="font-size: 12px; font-family: sans-serif;">
            <div style="font-weight: bold; color: ${color}; margin-bottom: 2px;">
              ${inc.department} · ${inc.trackingCode}
            </div>
            <div style="font-weight: 600; margin-bottom: 4px;">
              ${inc.title}
            </div>
            <div style="color: #64748b; font-size: 11px;">
              ${inc.ward}
            </div>
          </div>
        `);

        if (markersLayerRef.current) {
          circle.addTo(markersLayerRef.current);
          marker.addTo(markersLayerRef.current);
        }
      });
    }

    // Auto-center on selected incident
    if (selectedIncident && map) {
      map.panTo(selectedIncident.coordinates, { animate: true });
    }
  }, [incidents, selectedIncident, isDark, onSelectIncident]);

  return (
    <div className="relative w-full h-[420px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-3 shadow-md">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> MCD</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> PWD</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> DJB</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> DPCC</span>
      </div>
    </div>
  );
};
