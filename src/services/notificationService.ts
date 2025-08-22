import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/announcement';

export interface NotificationService {
  subscribeToAnnouncements: (callback: (announcement: Announcement) => void) => () => void;
  sendNotification: (title: string, message: string, options?: NotificationOptions) => void;
  requestPermission: () => Promise<NotificationPermission>;
}

class AnnouncementNotificationService implements NotificationService {
  private subscription: any = null;

  subscribeToAnnouncements(callback: (announcement: Announcement) => void) {
    try {
      // Subscribe to real-time changes in announcements table
      this.subscription = supabase
        .channel('announcements-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'announcements',
            filter: 'is_published=eq.true'
          },
          (payload) => {
            console.log('New announcement received:', payload);
            const announcement = payload.new as Announcement;
            callback(announcement);
            
            // Send browser notification if permissions are granted
            this.sendNotification(
              announcement.title,
              announcement.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
              {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: announcement.id,
                requireInteraction: announcement.priority === 'emergency' || announcement.priority === 'critical'
              }
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'announcements',
            filter: 'is_published=eq.true'
          },
          (payload) => {
            console.log('Announcement updated:', payload);
            const announcement = payload.new as Announcement;
            // Only notify if announcement was just published
            if (payload.old && payload.old.is_published === false && announcement.is_published === true) {
              callback(announcement);
              
              this.sendNotification(
                announcement.title,
                announcement.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
                {
                  icon: '/favicon.ico',
                  badge: '/favicon.ico',
                  tag: announcement.id,
                  requireInteraction: announcement.priority === 'emergency' || announcement.priority === 'critical'
                }
              );
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to announcement updates');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Error subscribing to announcement updates');
          }
        });
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
    }

    // Return unsubscribe function
    return () => {
      if (this.subscription) {
        supabase.removeChannel(this.subscription);
        this.subscription = null;
      }
    };
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  sendNotification(title: string, message: string, options?: NotificationOptions) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(title, {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Auto close after 10 seconds unless it requires interaction
    if (!options?.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 10000);
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

export const notificationService = new AnnouncementNotificationService();