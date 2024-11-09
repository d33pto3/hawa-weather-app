import { FC, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { center } from "../utils";

interface MapComponentProps {
  onLocationSelect: ({ lat, lng }: { lat: string; lng: string }) => void;
}

const MapComponent: FC<MapComponentProps> = ({ onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"], // Optionally add more libraries if needed
  });

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const onMapClick = (e: any) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    console.log(e);
    setMarkerPosition({ lat, lng });
    onLocationSelect({ lat, lng });
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={7}
        onClick={onMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
