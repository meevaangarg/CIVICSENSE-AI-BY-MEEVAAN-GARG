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
        center: [28.63, 77.20],
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

    // Clean OpenStreetMap tiles without API key
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    // Render Markers & Hotspot Radii
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      const bounds = L.latLngBounds([]);

      incidents.forEach((inc) => {
        let color = '#3B82F6';
        if (inc.department === 'MCD') color = '#F59E0B'; // Amber
        if (inc.department === 'PWD') color = '#2563EB'; // Blue
        if (inc.department === 'DJB') color = '#06B6D4'; // Cyan
        if (inc.department === 'DPCC') color = '#10B981'; // Emerald

        const isSelected = selectedIncident?.id === inc.id;
        const isMajorHotspot = inc.citizenReportsCount >= 25;

        // Custom HTML Marker Pin with report count badge
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              position: relative;
              background: ${color};
              width: ${isSelected ? '32px' : '26px'};
              height: ${isSelected ? '32px' : '26px'};
              border-radius: 50%;
              border: 2.5px solid #ffffff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-family: monospace;
              font-size: 11px;
              font-weight: bold;
              transition: all 0.2s ease;
            ">
              ${inc.department[0]}
              ${isMajorHotspot ? `
                <div style="
                  position: absolute;
                  top: -8px;
                  right: -8px;
                  background: #ef4444;
                  color: #ffffff;
                  border-radius: 999px;
                  font-size: 8px;
                  font-weight: 800;
                  padding: 1px 4px;
                  border: 1.5px solid #ffffff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  white-space: nowrap;
                ">
                  ${inc.citizenReportsCount}
                </div>
              ` : ''}
            </div>
          `,
          iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
          iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13],
        });

        const marker = L.marker(inc.coordinates, { icon: customIcon });

        // Cluster Radius Circle representing hotspot severity
        const circleRadius = 250 + inc.citizenReportsCount * 12;
        const circle = L.circle(inc.coordinates, {
          radius: circleRadius,
          color: color,
          fillColor: color,
          fillOpacity: isSelected ? 0.25 : 0.12,
          weight: isSelected ? 2 : 1,
        });

        marker.on('click', () => {
          onSelectIncident(inc);
        });

        marker.bindPopup(`
          <div style="font-size: 12px; font-family: sans-serif; min-width: 180px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 700; color: ${color}; font-family: monospace;">
                ${inc.department}
              </span>
              <span style="font-size: 10px; font-family: monospace; background: #fee2e2; color: #dc2626; padding: 1px 4px; border-radius: 4px;">
                ${inc.citizenReportsCount} Reports (Hotspot)
              </span>
            </div>
            <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px; line-height: 1.3;">
              ${inc.title}
            </div>
            <div style="color: #64748b; font-size: 11px;">
              📍 ${inc.ward}
            </div>
          </div>
        `);

        if (markersLayerRef.current) {
          circle.addTo(markersLayerRef.current);
          marker.addTo(markersLayerRef.current);
        }

        bounds.extend(inc.coordinates);
      });

      // Fit map to show all filtered hotspots when dataset changes
      if (incidents.length > 0 && map && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    }

    if (selectedIncident && map) {
      map.panTo(selectedIncident.coordinates, { animate: true });
    }
  }, [incidents, selectedIncident, isDark, onSelectIncident]);

  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Legend & Stats Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-[11px] font-mono text-slate-700 dark:text-slate-300 flex flex-wrap items-center gap-3 shadow-md">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> MCD (Waste)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> PWD (Roads)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> DJB (Water)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> DPCC (Air)</span>
        <span className="text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2">
          🔴 Red Badge = High-Density Hotspot
        </span>
      </div>
    </div>
  );
};
