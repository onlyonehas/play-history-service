import express from 'express';
import { PlayEvent, PlayEventInput } from '../src/types/playEvents';
import { events } from '../src/storage/events';
import { isDuplicate } from './helpers/checkDuplicate';

const app = express();
app.use(express.json());

app.post('/play', (req, res) => {
  try {
    const { user_id, content_id, device, timestamp, playback_duration }: PlayEventInput = req.body;
    if (!user_id || !content_id || !device || !timestamp || !playback_duration) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid timestamp format' });
    }

    const input: PlayEvent = { user_id, content_id, device, timestamp: date, playback_duration };
    if (!isDuplicate(input)) events.push(input);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default app;
