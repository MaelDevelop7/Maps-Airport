import { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import airportData from '../data/airports.json';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface Props {
  airportCode: string;
  onBack: () => void;
}

interface Point {
  id: number;
  label: string;
  x: number;
  y: number;
}

export default function AirportPlan({ airportCode, onBack }: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const airport = airportData.find(
    (a) => a.id.toLowerCase() === airportCode.toLowerCase()
  );

  if (!airport) return <p>Aéroport non trouvé</p>;

  // Charger les marqueurs depuis le bon fichier
  useEffect(() => {
    import(`../data/${airportCode.toUpperCase()}.json`)
      .then((mod) => setPoints(mod.default))
      .catch((err) => {
        console.error('Erreur chargement des points :', err);
        setPoints([]);
      });
  }, [airportCode]);

  // Charger la taille de l'image dynamiquement
  useEffect(() => {
    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}${airport.image}`;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      console.error('Erreur chargement de l’image du plan');
      setImageSize(null);
    };
  }, [airport.image]);

  if (!imageSize) return <p>Chargement du plan...</p>;

  const bounds: L.LatLngBoundsExpression = [[0, 0], [imageSize.height, imageSize.width]];

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        style={{ height: '100%', width: '100%' }}
        maxZoom={3}
        minZoom={-1}
      >
        <ImageOverlay url={`${import.meta.env.BASE_URL}${airport.image}`} bounds={bounds} />

        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.y, point.x]}
            icon={defaultIcon}
          >
            <Popup>{point.label}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <button
        onClick={onBack}
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
