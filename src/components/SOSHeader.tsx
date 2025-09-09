import { Shield, AlertTriangle } from "lucide-react";

const SOSHeader = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-emergency text-emergency-foreground rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SOS Alert System</h1>
              <p className="text-sm text-muted-foreground">Emergency Response Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">System Online</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-emergency/10 text-emergency rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Emergency Mode</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SOSHeader;