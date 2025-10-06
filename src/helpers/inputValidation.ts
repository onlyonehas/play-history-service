import { Response } from 'express';

export function validateUserId(user_id: string, res: Response): boolean {
  if (!user_id || user_id.trim() === '' || user_id.length < 4) {
    res.status(400).json({ error: 'Invalid or missing user_id' });
    return false;
  }
  return true;
}

export function validatePlayEventInput(
  user_id: string,
  content_id: string,
  device: string,
  timestamp: string,
  playback_duration: number,
  res: Response,
): boolean {
  if (!user_id || !content_id || !device || !timestamp || !playback_duration) {
    res.status(400).json({ error: 'Missing fields' });
    return false;
  }
  return true;
}
