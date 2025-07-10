
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, AlertTriangle } from "lucide-react";

interface AdminNotificationsProps {
  actionableNotifications: any[];
  onNotificationClick: (notification: any) => void;
}

const AdminNotifications = ({ actionableNotifications, onNotificationClick }: AdminNotificationsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications Actionnables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionableNotifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune notification urgente</p>
          ) : (
            actionableNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onNotificationClick(notification)}
              >
                <div className={`p-2 rounded-full ${
                  notification.type === 'deadline' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {notification.type === 'deadline' ? <Clock className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <Badge variant={notification.type === 'deadline' ? 'destructive' : 'default'}>
                    {notification.type === 'deadline' ? 'Délai' : 'Attention'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
