import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Award,
  BookOpen,
  Users,
  Calendar,
  Trash2
} from "lucide-react";

interface NotificationCenterProps {
  onClose: () => void;
}

const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Formation terminée",
      message: "Vous avez terminé 'Fondamentaux des Réseaux TCP/IP' avec succès",
      time: "Il y a 5 minutes",
      read: false,
      icon: CheckCircle
    },
    {
      id: 2,
      type: "info",
      title: "Nouveau module disponible",
      message: "Le module 'Configuration Avancée des VLANs' est maintenant disponible",
      time: "Il y a 1 heure",
      read: false,
      icon: BookOpen
    },
    {
      id: 3,
      type: "warning",
      title: "Certification expirante",
      message: "Votre certification CCNA expire dans 30 jours",
      time: "Il y a 2 heures",
      read: true,
      icon: AlertCircle
    },
    {
      id: 4,
      type: "achievement",
      title: "Nouveau badge obtenu",
      message: "Félicitations ! Vous avez obtenu le badge 'Expert Sécurité'",
      time: "Hier",
      read: true,
      icon: Award
    },
    {
      id: 5,
      type: "reminder",
      title: "Session programmée",
      message: "Votre session 'Routage Avancé' commence dans 1 heure",
      time: "Hier",
      read: true,
      icon: Calendar
    },
    {
      id: 6,
      type: "team",
      title: "Nouveau membre dans l'équipe",
      message: "Thomas Moreau a rejoint votre équipe de formation",
      time: "Il y a 2 jours",
      read: true,
      icon: Users
    }
  ]);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-4 border-green-500 bg-green-50";
      case "warning":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "info":
        return "border-l-4 border-blue-500 bg-blue-50";
      case "achievement":
        return "border-l-4 border-purple-500 bg-purple-50";
      case "reminder":
        return "border-l-4 border-orange-500 bg-orange-50";
      case "team":
        return "border-l-4 border-indigo-500 bg-indigo-50";
      default:
        return "border-l-4 border-gray-500 bg-gray-50";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "info": return "text-blue-600";
      case "achievement": return "text-purple-600";
      case "reminder": return "text-orange-600";
      case "team": return "text-indigo-600";
      default: return "text-gray-600";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-4 sm:pt-16 px-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md sm:max-w-lg lg:max-w-xl h-[90vh] sm:h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle className="text-lg sm:text-xl">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-xs">{unreadCount}</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full text-sm">
              Marquer toutes comme lues
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4 sm:p-6 pt-0">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md group ${
                      getNotificationStyle(notification.type)
                    } ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <notification.icon 
                        className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 ${getIconColor(notification.type)}`} 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-2">
                            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
