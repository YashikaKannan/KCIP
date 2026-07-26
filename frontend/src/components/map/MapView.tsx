import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { useMemo, useState } from "react";
import { crimeMapMarkers, districts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flame, MapPin } from "lucide-react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const TYPE_COLORS: Record<string, string> = {
  Theft: "#2563EB",
  Assault: "#DC2626",
  Cybercrime: "#7C3AED",
  Homicide: "#0F172A",
  Fraud: "#DB2777",
  Narcotics: "#059669",
};

interface MapViewProps {
  districtFilter?: string;
  typeFilter?: string;
  mode?: "markers" | "cluster" | "heat";
}

export default function MapView({ districtFilter = "all", typeFilter = "all", mode = "markers" }: MapViewProps) {
  const [showLabels, setShowLabels] = useState(true);

  const filtered = useMemo(
    () =>
      crimeMapMarkers.filter(
        (m) =>
          (typeFilter === "all" || m.type === typeFilter) &&
          (districtFilter === "all" || m.title.toLowerCase().includes(districtFilter.toLowerCase()))
      ),
    [districtFilter, typeFilter]
  );

  // Group by ~grid cells for a lightweight cluster/heat approximation
  const clusters = useMemo(() => {
    const buckets = new Map<string, { lat: number; lng: number; count: number; types: Set<string> }>();
    filtered.forEach((m) => {
      const key = `${m.lat.toFixed(1)}_${m.lng.toFixed(1)}`;
      const b = buckets.get(key) ?? { lat: m.lat, lng: m.lng, count: 0, types: new Set() };
      b.count += 1;
      b.types.add(m.type);
      buckets.set(key, b);
    });
    return [...buckets.values()];
  }, [filtered]);

  const legendTypes = Object.keys(TYPE_COLORS);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[14.5, 75.7]}
        zoom={7}
        minZoom={6}
        maxZoom={14}
        scrollWheelZoom
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {mode === "heat" && clusters.map((c, i) => (
          <CircleMarker
            key={`heat-${i}`}
            center={[c.lat, c.lng]}
            radius={Math.min(40, 14 + c.count * 8)}
            pathOptions={{
              color: "transparent",
              fillColor: c.count > 2 ? "#DC2626" : c.count > 1 ? "#F59E0B" : "#2563EB",
              fillOpacity: 0.35,
            }}
          />
        ))}

        {mode === "cluster" && clusters.map((c, i) => (
          <CircleMarker
            key={`c-${i}`}
            center={[c.lat, c.lng]}
            radius={12 + c.count * 4}
            pathOptions={{ color: "#2563EB", fillColor: "#2563EB", fillOpacity: 0.7, weight: 2 }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={showLabels}>
              <span className="font-semibold">{c.count}</span>
            </Tooltip>
            <Popup>
              <div className="min-w-[160px]">
                <div className="font-semibold">{c.count} incidents</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {[...c.types].join(", ")}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {mode === "markers" && filtered.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={9}
            pathOptions={{
              color: TYPE_COLORS[m.type] ?? "#2563EB",
              fillColor: TYPE_COLORS[m.type] ?? "#2563EB",
              fillOpacity: 0.75,
              weight: 2,
            }}
          >
            {showLabels && (
              <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                <span className="font-medium">{m.type}</span>
              </Tooltip>
            )}
            <Popup>
              <div className="min-w-[180px]">
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: TYPE_COLORS[m.type] ?? "#2563EB" }}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {m.type}
                  </span>
                </div>
                <div className="font-semibold">{m.title}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {m.lat.toFixed(3)}, {m.lng.toFixed(3)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <Card className="absolute left-3 top-3 z-[500] max-w-[220px] p-3 shadow-md">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <MapPin className="h-3 w-3" /> Legend
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {legendTypes.map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] }} />
              {t}
            </div>
          ))}
        </div>
        <div className="mt-2 border-t border-border pt-2 text-[11px]">
          <div className="font-semibold">{filtered.length} incidents shown</div>
          <div className="text-muted-foreground">Mode: {mode}</div>
        </div>
      </Card>

      <Card className="absolute right-3 top-3 z-[500] p-1.5 shadow-md">
        <Button
          variant={showLabels ? "default" : "outline"}
          size="sm"
          className="h-7 text-[11px]"
          onClick={() => setShowLabels((s) => !s)}
        >
          <Flame className="mr-1 h-3 w-3" />
          Labels {showLabels ? "On" : "Off"}
        </Button>
      </Card>

      {/* Approximate district labels */}
      {mode === "markers" && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[400] hidden max-w-xs text-[10px] text-muted-foreground md:block">
          {districts.slice(0, 4).join(" • ")}…
        </div>
      )}
    </div>
  );
}
