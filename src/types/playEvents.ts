export interface PlayEvent {
  user_id: string;
  content_id: string;
  device: string;
  timestamp: Date;
  playback_duration: number;
}
export type PlayEventInput = {
  user_id: string;
  content_id: string;
  device: 'web' | 'mobile' | 'tv';
  timestamp: string;
  playback_duration: number;
};
