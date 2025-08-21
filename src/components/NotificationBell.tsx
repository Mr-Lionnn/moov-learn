import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { notificationService } from '@/services/notificationService';
import { Announcement } from '@/types/announcement';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Announcement[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Request notification permission on mount
    const requestPermission = async () => {
      const permission = await notificationService.requestPermission();
      setHasPermission(permission === 'granted');
    };

    requestPermission();

    // Subscribe to new announcements
    if (user) {
      const unsubscribe = notificationService.subscribeToAnnouncements((announcement) => {
        setNotifications(prev => [announcement, ...prev.slice(0, 9)]); // Keep last 10 notifications
        
        // Show toast notification
        toast.success(`Nouvelle annonce: ${announcement.title}`, {
          description: announcement.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
          duration: 5000,
        });
      });

      return unsubscribe;
    }
  }, [user]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'critical': return 'bg-orange-500 text-white';
      case 'high': return 'bg-yellow-500 text-black';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {notifications.length > 9 ? '9+' : notifications.length}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                Tout effacer
              </Button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Aucune nouvelle notification
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {notifications.map((notification) => (
                <Card key={notification.id} className="relative">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold line-clamp-1">
                            {notification.title}
                          </h4>
                          <Badge className={`${getPriorityColor(notification.priority)} text-xs`}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.content.replace(/<[^>]*>/g, '')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearNotification(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!hasPermission && (
            <div className="p-3 border-t border-border bg-muted/50">
              <p className="text-xs text-muted-foreground text-center">
                Activez les notifications pour être alerté des nouvelles annonces
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={async () => {
                  const permission = await notificationService.requestPermission();
                  setHasPermission(permission === 'granted');
                }}
              >
                Activer les notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};