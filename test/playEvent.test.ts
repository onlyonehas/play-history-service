import { PlayEvent } from '../src/types/playEvents';

describe('PlayEvent model', () => {
  it('should have all required fields', () => {
    const event: PlayEvent = {
      user_id: 'user1',
      content_id: 'content1',
      device: 'web',
      timestamp: new Date(),
      playback_duration: 120
    };
    expect(event.user_id).toBe('user1');
    expect(event.playback_duration).toBe(120);
  });
});
