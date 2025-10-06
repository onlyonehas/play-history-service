# Play History Service

The Play History Service is a backend service for a streaming platform that tracks what content each user has watched.
It provides APIs so other teams or services can access users viewing history data for analytics, recommendations, or personalisation features.

## Architecture

This service is built with **TypeScript** and **Express.js**. It exposes RESTful APIs to track and retrieve user play history.

**Key Technologies & Tools:**

- Express.js (API framework)
- TypeScript (type-safe models and code)
- ESLint (code linting)
- Prettier (code formatting)

## Database Schema

Current implementation uses an in-memory array for simplicity, but can easily be extended to use a persistent database (e.g., Postgres, DynamoDB, MongoDB) to ensure data durability.

## API Endpoints

- `POST /play` - Ingest a new play event.
- `GET /history/{user_id}` - Retrieve a user’s play history, sorted by most
  recent.
- GET `/most-watched?from=&to=` - Return the most watched content IDs
  in a given time range

Refer to [API documentation](./src/docs/API.md) for details.

## Testing

Run unit tests with Jest:

```sh
npm test
```

## Contributing

Open Pull requests to review.
Please follow coding standards and write tests for new features.
