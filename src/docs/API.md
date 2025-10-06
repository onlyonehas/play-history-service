# Play History Service – API Reference

## POST /play

Ingest a new play event.

**Request body:**

```json
{
  "user_id": "string",
  "content_id": "string",
  "device": "string",
  "timestamp": "ISO 8601 string",
  "playback_duration": 120
}
```

Responses:

```
201 Created – Event added
200 OK – Duplicate ignored
400 Bad Request – Missing required fields
```
