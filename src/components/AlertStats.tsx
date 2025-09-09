import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

interface AlertStatsProps {
  totalAlerts: number;
  pendingAlerts: number;
  assignedAlerts: number;
  resolvedAlerts: number;
}

const AlertStats = ({ totalAlerts, pendingAlerts, assignedAlerts, resolvedAlerts }: AlertStatsProps) => {
  const stats = [
    {
      title: "Total Alerts",
      value: totalAlerts,
      icon: AlertTriangle,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Pending",
      value: pendingAlerts,
      icon: Clock,
      color: "text-pending",
      bgColor: "bg-pending/10"
    },
    {
      title: "Assigned",
      value: assignedAlerts,
      icon: Users,
      color: "text-assigned",
      bgColor: "bg-assigned/10"
    },
    {
      title: "Resolved",
      value: resolvedAlerts,
      icon: CheckCircle,
      color: "text-resolved",
      bgColor: "bg-resolved/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.title === "Total Alerts" && "Last 24 hours"}
              {stat.title === "Pending" && "Awaiting response"}
              {stat.title === "Assigned" && "In progress"}
              {stat.title === "Resolved" && "Completed today"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AlertStats;