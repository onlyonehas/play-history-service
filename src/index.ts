import express from 'express';


import { PlayEvent } from '../src/types/playEvents';
import { events } from '../src/storage/events';

const isDuplicate = (event: PlayEvent) =>
  events.some(e =>
    e.user_id === event.user_id &&
    e.content_id === event.content_id &&
    e.device === event.device &&
    e.timestamp.getTime() === event.timestamp.getTime()
  );

const app = express();
app.use(express.json());

app.post('/play', (req, res) => {
  const { user_id, content_id, device, timestamp, playback_duration } = req.body;
  if (!user_id || !content_id || !device || !timestamp || !playback_duration) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const event: PlayEvent = { user_id, content_id, device, timestamp: new Date(timestamp), playback_duration };
  if (!isDuplicate(event)) events.push(event);
  res.status(200).json({ success: true });
});

export default app;
