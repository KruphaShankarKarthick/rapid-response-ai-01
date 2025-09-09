import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Battery, Radio, Clock, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  sosId: string;
  type: "MEDICAL" | "POLICE" | "FIRE";
  latitude: number;
  longitude: number;
  time: string;
  battery: number;
  mode: "LoRa" | "GSM";
  status: "PENDING" | "ASSIGNED" | "RESOLVED";
}

interface AlertCardProps {
  alert: Alert;
  onStatusUpdate: (id: string, status: string) => void;
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
    case "PENDING": return "bg-pending text-pending-foreground";
    case "ASSIGNED": return "bg-assigned text-assigned-foreground";
    case "RESOLVED": return "bg-resolved text-resolved-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const AlertCard = ({ alert, onStatusUpdate }: AlertCardProps) => {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg border-l-4",
      alert.status === "PENDING" && "border-l-pending bg-pending/5",
      alert.status === "ASSIGNED" && "border-l-assigned bg-assigned/5", 
      alert.status === "RESOLVED" && "border-l-resolved bg-resolved/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(alert.type)}</span>
            <div>
              <h3 className="font-semibold text-foreground">SOS #{alert.sosId}</h3>
              <p className="text-sm text-muted-foreground">{alert.type} Emergency</p>
            </div>
          </div>
          <Badge className={getStatusColor(alert.status)}>
            {alert.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Location:</span>
          </div>
          <span className="font-mono text-foreground">{alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</span>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Time:</span>
          </div>
          <span className="text-foreground">{new Date(alert.time).toLocaleString()}</span>
          
          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Battery:</span>
          </div>
          <span className={cn(
            "font-medium",
            alert.battery > 20 ? "text-success" : "text-destructive"
          )}>{alert.battery}%</span>
          
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Network:</span>
          </div>
          <Badge variant="outline" className="w-fit">
            {alert.mode}
          </Badge>
        </div>
        
        {alert.status === "PENDING" && (
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(alert.id, "ASSIGNED")}
              className="flex-1"
            >
              <User className="w-4 h-4 mr-1" />
              Assign
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
              onClick={() => onStatusUpdate(alert.id, "RESOLVED")}
            >
              <Phone className="w-4 h-4 mr-1" />
              Resolve
            </Button>
          </div>
        )}
        
        {alert.status === "ASSIGNED" && (
          <Button
            size="sm"
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
            onClick={() => onStatusUpdate(alert.id, "RESOLVED")}
          >
            Mark as Resolved
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertCard;