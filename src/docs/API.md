# Play History Service – API Reference

## POST /play

Add a play event for a user.

**Request Body:**

```json
{
  "user_id": "user123", // min 4 characters
  "content_id": "movie456",
  "device": "web", // "web", "mobile", or "tv"
  "timestamp": "2025-10-06T12:00:00Z",
  "playback_duration": 120
}
```

**Success Response:**

- 201 Created

```json
{ "success": true }
```

**Error Responses:**

- 400 Bad Request: `{ "error": "Missing fields" }`
- 400 Bad Request: `{ "error": "Invalid timestamp format" }`
- 400 Bad Request: `{ "error": "user_id must be at least 4 characters long" }`
- 500 Internal Server Error: `{ "error": "Internal server error" }`

---

## GET /history/:user_id

Get a user's play history (most recent first).

**Path Parameter:**

- `user_id` (min 4 characters)

**Success Response:**

- 200 OK

```json
[
  {
    "user_id": "user123",
    "content_id": "movie456",
    "device": "web",
    "timestamp": "2025-10-06T12:00:00.000Z",
    "playback_duration": 120
  }
]
```

**Error Responses:**

- 400 Bad Request: `{ "error": "Invalid or missing user_id" }`
- 500 Internal Server Error: `{ "error": "Internal server error" }`

---

## GET /most-watched?from=&to=

Get the most watched content IDs in a given time range.

**Query Parameters:**

- `from` (ISO date string, optional)
- `to` (ISO date string, optional)

**Success Response:**

- 200 OK

```json
["movie456", "movie123"]
```

**Error Responses:**

- 400 Bad Request: `{ "error": "Invalid from timestamp format" }`
- 400 Bad Request: `{ "error": "Invalid to timestamp format" }`
- 500 Internal Server Error: `{ "error": "Internal server error" }`
