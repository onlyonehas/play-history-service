import request from 'supertest';
import app from '../src/index';
import { events } from '../src/storage/events';

describe('GET /most-watched', () => {
  beforeEach(() => {
    events.length = 0;
    console.error = jest.fn();
  });

  it('should return the content ID with the highest play count across all events', async () => {
    const now = new Date();

    events.push(
      {
        user_id: 'u1',
        content_id: 'c1',
        device: 'web',
        timestamp: now,
        playback_duration: 100,
      },
      {
        user_id: 'u2',
        content_id: 'c1',
        device: 'tv',
        timestamp: now,
        playback_duration: 200,
      },
      {
        user_id: 'u3',
        content_id: 'c2',
        device: 'mobile',
        timestamp: now,
        playback_duration: 150,
      },
    );

    const res = await request(app).get('/most-watched');
    expect(res.status).toBe(200);
    expect(res.body[0]).toBe('c1');
  });

  it('should only include content watched within the specified time range', async () => {
    const now = new Date();
    const old = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);

    events.push(
      {
        user_id: 'u1',
        content_id: 'c1',
        device: 'web',
        timestamp: old,
        playback_duration: 100,
      },
      {
        user_id: 'u2',
        content_id: 'c2',
        device: 'tv',
        timestamp: now,
        playback_duration: 200,
      },
    );

    const from = new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString();
    const res = await request(app).get(`/most-watched?from=${from}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(['c2']);
  });

  it('should only include content watched within the specified from and to time range', async () => {
    const now = new Date();
    const old = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
    const mid = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3);

    events.push(
      {
        user_id: 'u1',
        content_id: 'c1',
        device: 'web',
        timestamp: old,
        playback_duration: 100,
      },
      {
        user_id: 'u2',
        content_id: 'c2',
        device: 'tv',
        timestamp: mid,
        playback_duration: 200,
      },
      {
        user_id: 'u3',
        content_id: 'c3',
        device: 'mobile',
        timestamp: now,
        playback_duration: 150,
      },
    );

    const from = new Date(
      now.getTime() - 1000 * 60 * 60 * 24 * 4,
    ).toISOString();
    const to = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString();

    const res = await request(app).get(`/most-watched?from=${from}&to=${to}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(['c2']); // Only 'c2' falls within the range
  });

  it('should return 400 for invalid from timestamp', async () => {
    const res = await request(app).get('/most-watched?from=not-a-date');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid from timestamp format');
  });

  it('should return 400 for invalid to timestamp', async () => {
    const res = await request(app).get('/most-watched?to=not-a-date');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid to timestamp format');
  });

  it('should return 500 for unexpected error', async () => {
    const originalEntries = Object.entries;
    Object.entries = () => {
      throw new Error('Unexpected');
    };

    const res = await request(app).get('/most-watched');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');

    Object.entries = originalEntries; // Restore after test
  });
});
