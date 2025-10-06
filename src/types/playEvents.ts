export interface PlayEvent {
  user_id: string;
  content_id: string;
  device: string;
  timestamp: Date;
  playback_duration: number;
}