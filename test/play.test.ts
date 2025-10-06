import request from 'supertest';
import app from '../src/index';
import { events } from '../src/storage/events';

describe('POST /play', () => {
  beforeEach(() => { events.length = 0; });

  it('should add a new event', async () => {
    const res = await request(app)
      .post('/play')
      .send({
        user_id: 'user1',
        content_id: 'c1',
        device: 'web',
        timestamp: new Date(),
        playback_duration: 120
      });
    expect(res.status).toBe(200);
    expect(events.length).toBe(1);
  });

  it('should not add duplicate events', async () => {
    const event = {
      user_id: 'user1',
      content_id: 'c1',
      device: 'web',
      timestamp: new Date(),
      playback_duration: 120
    };
    await request(app).post('/play').send(event);
    await request(app).post('/play').send(event);
    expect(events.length).toBe(1);
  });
});
