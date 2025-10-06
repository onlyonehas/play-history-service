import express from 'express';
import { PlayEvent, PlayEventInput } from '../src/types/playEvents';
import { events } from '../src/storage/events';
import { isDuplicate } from './helpers/checkDuplicate';
import { validateUserId } from './helpers/inputValidation';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  const docPath = path.join(__dirname, 'docs', 'API.md');
  res.type('text/markdown').send(fs.readFileSync(docPath, 'utf8'));
});

app.post('/play', (req, res) => {
  try {
    const {
      user_id,
      content_id,
      device,
      timestamp,
      playback_duration,
    }: PlayEventInput = req.body;
    if (
      !user_id ||
      !content_id ||
      !device ||
      !timestamp ||
      !playback_duration
    ) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid timestamp format' });
    }

    const input: PlayEvent = {
      user_id,
      content_id,
      device,
      timestamp: date,
      playback_duration,
    };
    if (!isDuplicate(input)) events.push(input);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/history/:user_id', (req, res) => {
  try {
    const { user_id }: { user_id: PlayEventInput['user_id'] } = req.params;

    if (!validateUserId(user_id, res)) return;

    const history = events
      .filter((existingEvent) => existingEvent?.user_id === user_id)
      .sort(
        (eventA: PlayEvent, eventB: PlayEvent) =>
          eventB.timestamp.getTime() - eventA.timestamp.getTime(),
      );

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/most-watched', (req, res) => {
  try {
    const { from, to } = req.query;
    if (from && isNaN(new Date(from as string).getTime())) {
      return res.status(400).json({ error: 'Invalid from timestamp format' });
    }
    if (to && isNaN(new Date(to as string).getTime())) {
      return res.status(400).json({ error: 'Invalid to timestamp format' });
    }

    const fromDate = from ? new Date(from as string) : new Date(0);
    const toDate = to ? new Date(to as string) : new Date();

    const counts: Record<string, number> = {};

    for (const event of events) {
      if (event.timestamp >= fromDate && event.timestamp <= toDate) {
        counts[event.content_id] = (counts[event.content_id] || 0) + 1;
      }
    }

    const mostWatched = Object.entries(counts)
      .sort(
        ([, firstContentCount], [, secondContentCount]) =>
          secondContentCount - firstContentCount,
      )
      .map(([content_id]) => content_id);

    res.json(mostWatched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;
