import { events } from '../storage/events';
import { PlayEvent } from '../types/playEvents';

export const isDuplicate = (event: PlayEvent) =>
  events.some(
    (existingEvent) =>
      existingEvent.user_id === event.user_id &&
      existingEvent.content_id === event.content_id &&
      existingEvent.device === event.device &&
      existingEvent.timestamp.getTime() === event.timestamp.getTime(),
  );
