import { useState, useEffect } from "react";
import SOSHeader from "@/components/SOSHeader";
import AlertStats from "@/components/AlertStats";
import AlertCard from "@/components/AlertCard";
import MapView from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockAlerts = [
  {
    id: "1",
    sosId: "SOS001",
    type: "MEDICAL" as const,
    latitude: 28.6139,
    longitude: 77.2090,
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    battery: 85,
    mode: "LoRa" as const,
    status: "PENDING" as const
  },
  {
    id: "2", 
    sosId: "SOS002",
    type: "FIRE" as const,
    latitude: 28.7041,
    longitude: 77.1025,
    time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    battery: 62,
    mode: "GSM" as const,
    status: "ASSIGNED" as const
  },
  {
    id: "3",
    sosId: "SOS003", 
    type: "POLICE" as const,
    latitude: 28.5355,
    longitude: 77.3910,
    time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    battery: 45,
    mode: "LoRa" as const,
    status: "RESOLVED" as const
  },
  {
    id: "4",
    sosId: "SOS004",
    type: "MEDICAL" as const,
    latitude: 28.6289,
    longitude: 77.3762,
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    battery: 92,
    mode: "GSM" as const,
    status: "PENDING" as const
  },
  {
    id: "5",
    sosId: "SOS005",
    type: "FIRE" as const,
    latitude: 28.6448,
    longitude: 77.1675,
    time: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    battery: 28,
    mode: "LoRa" as const,
    status: "ASSIGNED" as const
  }
];

const Index = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: newStatus as any } : alert
    ));
    
    toast({
      title: "Status Updated",
      description: `Alert ${id} marked as ${newStatus.toLowerCase()}`,
    });
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    toast({
      title: "Data Refreshed",
      description: "Alert data has been updated",
    });
  };

  // Calculate stats
  const totalAlerts = alerts.length;
  const pendingAlerts = alerts.filter(a => a.status === "PENDING").length;
  const assignedAlerts = alerts.filter(a => a.status === "ASSIGNED").length; 
  const resolvedAlerts = alerts.filter(a => a.status === "RESOLVED").length;

  return (
    <div className="min-h-screen bg-background">
      <SOSHeader />
      
      <main className="container mx-auto px-6 py-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Emergency Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <AlertStats 
          totalAlerts={totalAlerts}
          pendingAlerts={pendingAlerts}
          assignedAlerts={assignedAlerts}
          resolvedAlerts={resolvedAlerts}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Alerts</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-pending/10 text-pending border-pending">
                      {pendingAlerts} Pending
                    </Badge>
                    <Badge variant="outline" className="bg-assigned/10 text-assigned border-assigned">
                      {assignedAlerts} Assigned
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">🛡️</div>
                    <p className="text-lg font-medium">No active alerts</p>
                    <p className="text-sm">All clear - monitoring for emergencies</p>
                  </div>
                ) : (
                  alerts
                    .sort((a, b) => {
                      const statusOrder = { "PENDING": 0, "ASSIGNED": 1, "RESOLVED": 2 };
                      return statusOrder[a.status] - statusOrder[b.status];
                    })
                    .map(alert => (
                      <AlertCard 
                        key={alert.id} 
                        alert={alert} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <MapView alerts={alerts} />
          </div>
        </div>

        {/* Backend Integration Notice */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Ready for Backend Integration</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This dashboard is ready to connect to a real backend! To enable live alert data, real-time updates, 
                  and persistent storage, connect your project to Supabase using Lovable's native integration.
                </p>
                <p className="text-xs text-muted-foreground">
                  Click the green Supabase button in the top right to get started with authentication, database storage, 
                  and real-time subscriptions for your SOS alert system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;