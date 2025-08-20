export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'critical' | 'emergency';
export type AnnouncementVisibility = 'public' | 'private' | 'role_specific';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  priority: AnnouncementPriority;
  visibility: AnnouncementVisibility;
  target_roles?: string[];
  target_users?: string[];
  scheduled_at?: string;
  published_at?: string;
  expires_at?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementAttachment {
  id: string;
  announcement_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  created_at: string;
}

export interface AnnouncementView {
  id: string;
  announcement_id: string;
  user_id: string;
  viewed_at: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  visibility: AnnouncementVisibility;
  target_roles?: string[];
  target_users?: string[];
  scheduled_at?: string;
  expires_at?: string;
  is_published: boolean;
  attachments?: File[];
}