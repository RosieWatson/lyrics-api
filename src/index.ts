import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient().$extends(withAccelerate())
const fastify = Fastify({
  logger: true
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Get all songs
fastify.get('/api/songs', async (request, reply) => {
  try {
    const songs = await prisma.song.findMany({
      select: {
        id: true,
        title: true,
        artist: true,
        album: true,
        year: true,
        genre: true,
        duration: true
      }
    });
    return songs;
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch songs' });
  }
});

// Get song by ID with lyrics
fastify.get('/api/songs/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  
  try {
    const song = await prisma.song.findUnique({
      where: { id }
    });
    
    if (!song) {
      reply.code(404).send({ error: 'Song not found' });
      return;
    }
    
    return song;
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch song' });
  }
});

// Get lyrics by artist and song name
fastify.get('/api/lyrics/:artist/:song', async (request, reply) => {
  const { artist, song } = request.params as { artist: string; song: string };
  
  try {
    const songData = await prisma.song.findFirst({
      where: {
        AND: [
          { artist: { equals: artist, mode: 'insensitive' } },
          { title: { equals: song, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        artist: true,
        album: true,
        year: true,
        lyrics: true
      }
    });
    
    if (!songData) {
      reply.code(404).send({ error: 'Song not found' });
      return;
    }
    
    return songData;
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch lyrics' });
  }
});

// Search songs by title or artist
fastify.get('/api/songs/search', async (request, reply) => {
  const { q } = request.query as { q?: string };
  
  if (!q) {
    reply.code(400).send({ error: 'Query parameter "q" is required' });
    return;
  }
  
  try {
    const songs = await prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { artist: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        artist: true,
        album: true,
        year: true,
        genre: true,
        duration: true
      }
    });
    
    return songs;
  } catch (error) {
    reply.code(500).send({ error: 'Failed to search songs' });
  }
});

// Create a new song
fastify.post('/api/songs', async (request, reply) => {
  const { title, artist, album, year, genre, lyrics, duration } = request.body as {
    title: string;
    artist: string;
    album?: string;
    year?: number;
    genre?: string;
    lyrics: string;
    duration?: number;
  };
  
  if (!title || !artist || !lyrics) {
    reply.code(400).send({ error: 'Title, artist, and lyrics are required' });
    return;
  }
  
  try {
    const song = await prisma.song.create({
      data: {
        title,
        artist,
        album,
        year,
        genre,
        lyrics,
        duration
      }
    });
    
    reply.code(201).send(song);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to create song' });
  }
});

// Export handler for Vercel
export default async function handler(req: any, res: any) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  const start = async () => {
    try {
      const port = parseInt(process.env.PORT || '3000');
      await fastify.listen({ port, host: '0.0.0.0' });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  
  start();
}