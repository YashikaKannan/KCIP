import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { crimeMapMarkers } from "@/data/mockData";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function MapView() {
  return (
    <MapContainer center={[14.5, 75.7]} zoom={7} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {crimeMapMarkers.map((m) => (
        <CircleMarker key={m.id} center={[m.lat, m.lng]} radius={14} pathOptions={{ color: "#2563EB", fillColor: "#2563EB", fillOpacity: 0.4 }}>
          <Popup><b>{m.title}</b><br />Type: {m.type}</Popup>
        </CircleMarker>
      ))}
      {crimeMapMarkers.map((m) => (
        <Marker key={"pin-" + m.id} position={[m.lat, m.lng]}>
          <Popup>{m.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
