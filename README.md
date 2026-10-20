# Lyrics API

live: _deploy URL to come_

a tiny read-only API for song lyrics, built with Next.js and deployed to Vercel. the songs live in `data/songs.json`, so there's no database and no env vars.

## endpoints

### `GET /api/songs`

returns every song, without lyrics.

```json
[
  {
    "id": "cmcp03i8k00013o0wmes5dc8y",
    "title": "Yellow",
    "artist": "Coldplay",
    "album": "Parachutes",
    "year": 2000,
    "genre": "Alternative Rock",
    "duration": 269
  }
]
```

### `GET /api/lyrics/{artist}/{song}`

returns the lyrics for one song. artist and song match case-insensitively, so `/api/lyrics/coldplay/yellow` works too.

```json
{
  "lyrics": "Look at the stars\nLook how they shine for you\nAnd everything you do\nYeah, they were all yellow\n..."
}
```

an unknown song gives a `404` with `{"error": "Song not found"}`, and anything other than `GET` or `OPTIONS` gives a `405` with `{"error": "Method not allowed"}`.

## local dev

```bash
npm install
npm run dev    # http://localhost:3000
npm test
npm run build
```

## deploy

import the repo into Vercel. it detects Next.js on its own, so there's nothing to configure.
