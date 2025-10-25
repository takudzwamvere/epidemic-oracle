// components/Map.tsx
'use client';
import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon paths for Next.js
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

interface Prediction {
  province: string;
  predicted_cases: number;
  current_cases: number;
  hospitalizations: number;
  deaths: number;
  risk_level: string;
  lat: number;
  lng: number;
  confidence: number;
  growth_rate: string;
  trend: string;
}

interface MapProps {
  predictions: Prediction[];
}

const Map: React.FC<MapProps> = ({ predictions = [] }) => {
  // Fallback center (Zimbabwe)
  const center: [number, number] = [-19.0154, 29.1549];

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Array.isArray(predictions) && predictions.length > 0 ? (
        predictions.map((province, i) => (
          <Circle
            key={i}
            center={[province.lat, province.lng]}
            radius={50000} // 50km radius
            pathOptions={{
              fillColor: getRiskColor(province.risk_level),
              fillOpacity: 0.6,
              color: getRiskColor(province.risk_level),
              weight: 2,
              opacity: 0.8
            }}
          >
            <Popup>
              <div>
                <strong>{province.province}</strong><br />
                Predicted Cases: {province.predicted_cases.toLocaleString()}<br />
                Current Cases: {province.current_cases.toLocaleString()}<br />
                Risk Level: <span style={{ color: getRiskColor(province.risk_level) }}>{province.risk_level}</span><br />
                Confidence: {province.confidence}%
              </div>
            </Popup>
          </Circle>
        ))
      ) : (
        <></>
      )}
    </MapContainer>
  );
};

export default Map;