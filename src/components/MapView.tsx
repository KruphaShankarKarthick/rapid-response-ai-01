import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // Fetch Mapbox token on component mount
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          setTokenError(true);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        setTokenError(true);
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.2090, 28.6139], // Delhi center
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      setIsMapLoaded(false);
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each alert
    alerts.forEach(alert => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = `w-10 h-10 flex items-center justify-center rounded-full border-2 shadow-lg cursor-pointer hover:scale-110 transition-transform ${getStatusColor(alert.status)}`;
      el.innerHTML = `<span class="text-lg">${getTypeIcon(alert.type)}</span>`;
      el.title = `${alert.type} - SOS #${alert.sosId}`;

      // Create marker and add to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([alert.longitude, alert.latitude])
        .addTo(map.current!);

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${alert.type} Alert</h3>
            <p class="text-sm text-gray-600">SOS ID: ${alert.sosId}</p>
            <p class="text-sm">Status: ${alert.status}</p>
          </div>
        `);

      marker.setPopup(popup);
      markers.current.push(marker);
    });

    // Fit map to show all markers if there are alerts
    if (alerts.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      alerts.forEach(alert => {
        bounds.extend([alert.longitude, alert.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [alerts, isMapLoaded]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-primary" />
          <span>Alert Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tokenError ? (
          <div className="mx-6 mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive">
              Mapbox token not configured. Please contact administrator.
            </p>
          </div>
        ) : !mapboxToken ? (
          <div className="mx-6 mb-6 p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        ) : (
          <div className="relative h-96 mx-6 mb-6 overflow-hidden rounded-lg">
            <div ref={mapContainer} className="absolute inset-0" />
            
            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
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
          </div>
        )}
        
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