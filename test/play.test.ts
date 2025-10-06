import request from 'supertest';
import app from '../src/index';
import { events } from '../src/storage/events';
import { PlayEventInput } from '../src/types/playEvents';
import * as checkDuplicate from '../src/helpers/checkDuplicate';

describe('POST /play', () => {
  beforeEach(() => {
    events.length = 0;
  });

  it('should add a new play event', async () => {
    const event: PlayEventInput = {
      user_id: 'user1',
      content_id: 'c1',
      device: 'web',
      timestamp: new Date().toISOString(),
      playback_duration: 120,
    };
    const res = await request(app).post('/play').send(event);
    expect(res.status).toBe(201);
    expect(events.length).toBe(1);
  });

  it('should not add duplicate events', async () => {
    const event: PlayEventInput = {
      user_id: 'user1',
      content_id: 'c1',
      device: 'web',
      timestamp: new Date().toISOString(),
      playback_duration: 120,
    };
    await request(app).post('/play').send(event);
    await request(app).post('/play').send(event);
    expect(events.length).toBe(1);
  });

  it('should throw an error for missing fields', async () => {
    const res = await request(app).post('/play').send({
      user_id: 'user1',
      device: 'web',
      timestamp: new Date(),
      playback_duration: 120,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing fields');
  });

  it('should throw an error if date is not valid', async () => {
    const res = await request(app).post('/play').send({
      user_id: 'user1',
      content_id: 'c1',
      device: 'web',
      timestamp: 'invalid-date',
      playback_duration: 120,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid timestamp format');
  });
  it('should return 500 if an unexpected error occurs', async () => {
    const spy = jest
      .spyOn(checkDuplicate, 'isDuplicate')
      .mockImplementation(() => {
        throw new Error('Unexpected');
      });

    const event: PlayEventInput = {
      user_id: 'user1',
      content_id: 'c1',
      device: 'web',
      timestamp: new Date().toISOString(),
      playback_duration: 120,
    };

    const res = await request(app).post('/play').send(event);
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');

    spy.mockRestore();
  });
});
