import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Alert {
  id: string;
  sosId: string;
  type: "MEDICAL" | "POLICE" | "FIRE";
  latitude: number;
  longitude: number;
  status: "PENDING" | "ASSIGNED" | "RESOLVED";
}

interface MapViewProps {
  alerts: Alert[];
}

// Fix default markers in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getTypeIcon = (type: string) => {
  switch (type) {
    case "MEDICAL": return "🚑";
    case "POLICE": return "🚔";
    case "FIRE": return "🚒";
    default: return "🚨";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "#ef4444"; // red
    case "ASSIGNED": return "#f59e0b"; // orange
    case "RESOLVED": return "#10b981"; // green
    default: return "#6b7280"; // gray
  }
};

// Custom marker component
const createCustomIcon = (type: string, status: string) => {
  const color = getStatusColor(status);
  const emoji = getTypeIcon(type);
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color}; 
        width: 32px; 
        height: 32px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        border: 2px solid white; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        font-size: 16px;
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to fit bounds when alerts change
const FitBounds = ({ alerts }: { alerts: Alert[] }) => {
  const map = useMap();

  useEffect(() => {
    if (alerts.length > 0) {
      const group = new L.FeatureGroup(
        alerts.map(alert => 
          L.marker([alert.latitude, alert.longitude])
        )
      );
      map.fitBounds(group.getBounds().pad(0.1));
    } else {
      // Default view centered on Delhi
      map.setView([28.6139, 77.2090], 10);
    }
  }, [alerts, map]);

  return null;
};

const MapView = ({ alerts }: MapViewProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-primary" />
          <span>Alert Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-96 mx-6 mb-6 overflow-hidden rounded-lg">
          <MapContainer
            center={[28.6139, 77.2090]} // Delhi center
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <FitBounds alerts={alerts} />
            
            {alerts.map((alert) => (
              <Marker
                key={alert.id}
                position={[alert.latitude, alert.longitude]}
                icon={createCustomIcon(alert.type, alert.status)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{alert.type} Alert</h3>
                    <p className="text-sm text-gray-600">SOS ID: {alert.sosId}</p>
                    <p className="text-sm">Status: {alert.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
            <h4 className="text-sm font-semibold text-foreground mb-2">Alert Status</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-muted-foreground">Assigned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Resolved</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location info */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Coverage Area: Emergency Response Zone</span>
            </div>
            <span>{alerts.length} active locations</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;