import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import airportData from '../data/airports.json';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const airportIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const userPositionIcon = new L.Icon({
  iconUrl: `${import.meta.env.BASE_URL}marker-icon-red.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

interface Props {
  onOpenAirportPlan: (id: string) => void;
  onBackHome: () => void;
}

function LocateControl({ onLocated }: { onLocated: (pos: L.LatLng) => void }) {
  const map = useMap();

  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 13 });

    map.once('locationfound', (e: L.LocationEvent) => {
      onLocated(e.latlng);
    });

    map.once('locationerror', (e: L.ErrorEvent) => {
      alert('Erreur de géolocalisation : ' + e.message);
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        right: 10,
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleClick}
        style={{
          padding: '8px 12px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        📍 Me localiser
      </button>
    </div>
  );
}

export default function MapView({ onOpenAirportPlan, onBackHome }: Props) {
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <MapContainer center={[45, 2]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {airportData.map((airport) => (
          <Marker
            key={airport.id}
            position={airport.position}
            icon={airportIcon}
          >
            <Popup>
              <strong>{airport.name}</strong><br />
              <a
                onClick={() => onOpenAirportPlan(airport.id)}
                style={{ cursor: 'pointer', color: '#1976d2' }}
              >
                Voir le plan
              </a>
            </Popup>
          </Marker>
        ))}

        {userPosition && (
          <Marker position={userPosition} icon={userPositionIcon}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        {/* Intégré dans la carte */}
        <LocateControl onLocated={setUserPosition} />
      </MapContainer>

      <button
        onClick={onBackHome}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          padding: '10px 15px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Retour
      </button>
    </div>
  );
}
