import { useEffect } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { MapPin, PhoneCall } from 'lucide-react';
import { STATIC_TRANSLATIONS } from '../data/translations.js';
import 'leaflet/dist/leaflet.css';

const AMBULANCE_ROUTE = [
  [18.5209, 73.8557],
  [18.5204, 73.8567],
  [18.5194, 73.8610],
  [18.5179, 73.8663],
  [18.5169, 73.8710]
];

function getRoutePosition(progress) {
  const normalizedProgress = Math.min(100, Math.max(0, progress)) / 100;
  const routeIndex = normalizedProgress * (AMBULANCE_ROUTE.length - 1);
  const startIndex = Math.min(Math.floor(routeIndex), AMBULANCE_ROUTE.length - 2);
  const segmentProgress = routeIndex - startIndex;
  const start = AMBULANCE_ROUTE[startIndex];
  const end = AMBULANCE_ROUTE[startIndex + 1];

  return [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress
  ];
}

function MapCenterController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) map.flyTo(center, 16, { duration: 0.8 });
  }, [center, map]);

  return null;
}

export default function AmbulanceRouteMap({
  progress,
  active,
  destinationHospital,
  etaMinutes,
  userLocation,
  mapCenter,
  onCenterOnUserLocation,
  language,
  driver,
  phone,
  vehicleNo
}) {
  const translate = (phrase) => STATIC_TRANSLATIONS[phrase]?.[language] || phrase;
  const ambulancePosition = active ? getRoutePosition(progress) : [18.5204, 73.8567];

  return (
    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-black text-cyan-400 tracking-wider">{translate('Live GPS Tracking')}</span>
          <h3 className="text-lg font-bold text-white">{translate('Emergency Route to Hospital')}</h3>
          <p className="text-xs text-slate-400">
            {translate('Pune District Fire & Emergency Hub')} → {destinationHospital}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCenterOnUserLocation}
            className="bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            aria-label={translate('Center map on my location')}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{translate('Center on My Location')}</span>
          </button>
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-2 rounded-xl font-black whitespace-nowrap">
            {translate('ETA:')} {etaMinutes} {translate('MINS')}
          </span>
        </div>
      </div>

      <div className="relative z-0 h-[320px] sm:h-[400px] w-full border-y border-slate-800">
        <MapContainer
          center={[18.5190, 73.8635]}
          zoom={14}
          scrollWheelZoom
          className="h-full w-full bg-slate-950"
        >
          <TileLayer
            attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> &copy; <a href="https://www.wikimedia.org">Wikimedia</a>'}
            url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
          />
          <MapCenterController center={mapCenter} />
          <Polyline
            positions={AMBULANCE_ROUTE}
            pathOptions={{ color: '#22d3ee', weight: 5, opacity: 0.9 }}
          />
          <CircleMarker
            center={AMBULANCE_ROUTE[0]}
            radius={7}
            pathOptions={{ color: '#f8fafc', fillColor: '#64748b', fillOpacity: 1, weight: 2 }}
          >
            <Popup>{translate('Pune District Fire & Emergency Hub')}</Popup>
          </CircleMarker>
          <CircleMarker
            center={AMBULANCE_ROUTE[AMBULANCE_ROUTE.length - 1]}
            radius={8}
            pathOptions={{ color: '#d1fae5', fillColor: '#10b981', fillOpacity: 1, weight: 2 }}
          >
            <Popup>{destinationHospital}</Popup>
          </CircleMarker>
          <CircleMarker
            center={ambulancePosition}
            radius={9}
            pathOptions={{ color: '#cffafe', fillColor: '#06b6d4', fillOpacity: 1, weight: 3 }}
          >
            <Popup>
              {translate('Ambulance GPS')}<br />
              {ambulancePosition[0].toFixed(4)}° N, {ambulancePosition[1].toFixed(4)}° E
            </Popup>
          </CircleMarker>
          {userLocation && (
            <CircleMarker
              center={userLocation}
              radius={8}
              pathOptions={{ color: '#dbeafe', fillColor: '#3b82f6', fillOpacity: 1, weight: 3 }}
            >
              <Popup>{translate('Your Location')}</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>

      <div className="px-4 sm:px-5 py-3 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
        <span className="text-cyan-300 font-mono">
          {translate('Ambulance GPS:')} {ambulancePosition[0].toFixed(4)}° N, {ambulancePosition[1].toFixed(4)}° E
        </span>
        <span className="text-slate-400">{translate('Speed: 58 km/h • Siren Active')}</span>
        <span className="text-emerald-300">
          {translate(userLocation ? 'Your location is shown on the map.' : 'User location not shared.')}
        </span>
      </div>

      <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black">
            108
          </div>
          <div>
            <p className="text-xs font-bold text-white">{driver} ({translate('EMS Paramedic')})</p>
            <p className="text-[10px] text-slate-400">
              {translate('Vehicle:')} <strong className="text-cyan-400">{vehicleNo}</strong>
            </p>
          </div>
        </div>
        <a
          href={`tel:${phone}`}
          className="bg-emerald-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
        >
          <PhoneCall className="w-3.5 h-3.5" /> {translate('Call Paramedic')}
        </a>
      </div>
    </div>
  );
}