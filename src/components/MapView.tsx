import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

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
    case "PENDING": return "border-pending bg-pending/20";
    case "ASSIGNED": return "border-assigned bg-assigned/20";
    case "RESOLVED": return "border-resolved bg-resolved/20";
    default: return "border-muted bg-muted/20";
  }
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
        <div className="relative h-96 bg-muted/20 rounded-lg mx-6 mb-6 overflow-hidden">
          {/* Simulated map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-60"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          {/* Map center indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-6 h-6 border-2 border-primary/30 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
          </div>
          
          {/* Alert markers positioned randomly for demo */}
          {alerts.slice(0, 8).map((alert, index) => (
            <div 
              key={alert.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getStatusColor(alert.status)} border-2 rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform`}
              style={{
                left: `${30 + (index * 8) + Math.sin(index) * 20}%`,
                top: `${25 + (index * 6) + Math.cos(index) * 15}%`
              }}
              title={`${alert.type} - SOS #${alert.sosId}`}
            >
              <span className="text-lg">{getTypeIcon(alert.type)}</span>
            </div>
          ))}
          
          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h4 className="text-sm font-semibold text-foreground mb-2">Alert Status</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pending border border-pending"></div>
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-assigned border border-assigned"></div>
                <span className="text-muted-foreground">Assigned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-resolved border border-resolved"></div>
                <span className="text-muted-foreground">Resolved</span>
              </div>
            </div>
          </div>
          
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="w-8 h-8 bg-card hover:bg-muted rounded-lg shadow-md flex items-center justify-center text-foreground font-bold">
              +
            </button>
            <button className="w-8 h-8 bg-card hover:bg-muted rounded-lg shadow-md flex items-center justify-center text-foreground font-bold">
              −
            </button>
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