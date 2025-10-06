import request from 'supertest';
import app from '../src/index';
import { events } from '../src/storage/events';

describe('GET /history/:user_id', () => {
  beforeEach(() => { events.length = 0; });

  it('should return events for given user_id sorted', async () => {
    const now = new Date();
    const older = new Date(now.getTime() - 1000);

    events.push(
      { user_id: 'user1', content_id: 'panorama', device: 'web', timestamp: older, playback_duration: 100 },
    );

    const res = await request(app).get('/history/user1');
    expect(res.status).toBe(200);
    expect(res.body[0].content_id).toBe('panorama');
  });

  it('should return events for given user_id sorted by most recent', async () => {
    const now = new Date();
    const older = new Date(now.getTime() - 1000);

    events.push(
      { user_id: 'user1', content_id: 'panorama', device: 'web', timestamp: older, playback_duration: 100 },
      { user_id: 'user1', content_id: 'bluey', device: 'tv', timestamp: now, playback_duration: 200 }
    );

    const res = await request(app).get('/history/user1');
    expect(res.status).toBe(200);
    expect(res.body[0].content_id).toBe('bluey');
  });

  it.only('should return 400 when invalid user_id', async () => {
    const res = await request(app).get('/history/%20');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid or missing user_id');
  });

  it('should return 500 when unexpected error', async () => {
    const originalFilter = Array.prototype.filter;
    Array.prototype.filter = () => { throw new Error('Unexpected'); };
    const res = await request(app).get('/history/user1');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
    Array.prototype.filter = originalFilter;
  });
});
