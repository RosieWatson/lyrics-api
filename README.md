# Lyrics API

[https://song--lyrics.vercel.app](https://song--lyrics.vercel.app)

A RESTful API for retrieving song lyrics built with Fastify and Prisma.

## Features

- Get lyrics by artist and song name
- Search songs by title or artist
- Create new songs with lyrics
- PostgreSQL database with Prisma ORM
- Docker support for easy deployment

## API Endpoints

### Get Lyrics by Artist and Song
```
GET /api/lyrics/{artist}/{song}
```
Returns lyrics for a specific song by artist and song name.

### Get All Songs
```
GET /api/songs
```
Returns all songs (without lyrics).

### Get Song by ID
```
GET /api/songs/{id}
```
Returns a specific song with lyrics.

### Search Songs
```
GET /api/songs/search?q={query}
```
Search songs by title or artist.

### Create Song
```
POST /api/songs
```
Create a new song with lyrics.

### Health Check
```
GET /health
```
Returns API health status.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Prisma Postgres:
   - Create a project at [Prisma Data Platform](https://console.prisma.io/)
   - Get your connection string and API key

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your Prisma Postgres credentials:
```
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
DIRECT_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
```

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Push database schema:
```bash
npm run db:push
```

6. Seed database:
```bash
npm run db:seed
```

7. Start development server:
```bash
npm run dev
```

## Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`.

## Database Schema

The API uses a PostgreSQL database with the following schema:

- `id`: Unique identifier
- `title`: Song title
- `artist`: Artist name
- `album`: Album name (optional)
- `year`: Release year (optional)
- `genre`: Music genre (optional)
- `lyrics`: Song lyrics
- `duration`: Song duration in seconds (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp