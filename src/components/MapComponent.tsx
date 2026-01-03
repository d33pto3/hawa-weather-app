import { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { center } from "../utils";

// Leaflet marker icon fix for Vite/Webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  onLocationSelect: ({ lat, lng }: { lat: string; lng: string }) => void;
}

// Controller component to move map center
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12);
  }, [center, map]);
  return null;
};

const LocationMarker = ({
  onLocationSelect,
  markerPosition,
  setMarkerPosition,
}: any) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition({ lat, lng });
      onLocationSelect({ lat: lat.toString(), lng: lng.toString() });
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
};

const MapComponent: FC<MapComponentProps> = ({ onLocationSelect }) => {
  const { t } = useTranslation();
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([center.lat, center.lng]);

  // Debounced search for suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
          );
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Suggestion error:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectSuggestion = (suggestion: any) => {
    const { lat, lon, display_name } = suggestion;
    const newLat = parseFloat(lat);
    const newLon = parseFloat(lon);
    
    setMapCenter([newLat, newLon]);
    setMarkerPosition({ lat: newLat, lng: newLon });
    onLocationSelect({ lat: lat.toString(), lng: lon.toString() });
    
    setSearchQuery(display_name);
    setShowSuggestions(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  const mapContainerStyle = {
    width: "100%",
    height: "350px",
  };

  return (
    <div className="flex flex-col gap-2 mt-3 relative">
      <form onSubmit={handleSearch} className="flex gap-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
          placeholder={t('search_location')}
          className="flex-grow text-xs uppercase p-2 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-1 text-xs font-bold uppercase transition-all font-main"
        >
          GO
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-[38px] left-0 right-0 z-[2000] border-2 border-[var(--border-color)] bg-[var(--bg-primary)] shadow-xl divide-y divide-[var(--border-color)]">
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => handleSelectSuggestion(s)}
              className="p-2 text-[10px] uppercase font-bold cursor-pointer hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors line-clamp-2"
            >
              {s.display_name}
            </div>
          ))}
        </div>
      )}
      
      <div className="overflow-hidden border-2 border-[var(--border-color)]">
        <MapContainer
          center={mapCenter}
          zoom={7}
          style={mapContainerStyle}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} />
          <LocationMarker
            onLocationSelect={onLocationSelect}
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
