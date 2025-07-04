import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const path = url?.split('?')[0] || '';
    const query = new URLSearchParams(url?.split('?')[1] || '');

    // Health check
    if (path === '/health') {
      return res.json({ status: 'OK', timestamp: new Date().toISOString() });
    }

    // Get all songs
    if (path === '/api/songs' && method === 'GET') {
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
      return res.json(songs);
    }

    // Search songs
    if (path === '/api/songs/search' && method === 'GET') {
      const q = query.get('q');
      if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
      }
      
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
      return res.json(songs);
    }

    // Get lyrics by artist and song
    const lyricsMatch = path.match(/^\/api\/lyrics\/([^\/]+)\/([^\/]+)$/);
    if (lyricsMatch && method === 'GET') {
      const [, artist, song] = lyricsMatch;
      
      const songData = await prisma.song.findFirst({
        where: {
          AND: [
            { artist: { equals: decodeURIComponent(artist), mode: 'insensitive' } },
            { title: { equals: decodeURIComponent(song), mode: 'insensitive' } }
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
        return res.status(404).json({ error: 'Song not found' });
      }
      
      return res.json(songData);
    }

    // Get song by ID
    const songMatch = path.match(/^\/api\/songs\/([^\/]+)$/);
    if (songMatch && method === 'GET') {
      const [, id] = songMatch;
      
      const song = await prisma.song.findUnique({
        where: { id }
      });
      
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      
      return res.json(song);
    }

    // Create song
    if (path === '/api/songs' && method === 'POST') {
      const { title, artist, album, year, genre, lyrics, duration } = req.body as {
        title: string;
        artist: string;
        album?: string;
        year?: number;
        genre?: string;
        lyrics: string;
        duration?: number;
      };
      
      if (!title || !artist || !lyrics) {
        return res.status(400).json({ error: 'Title, artist, and lyrics are required' });
      }
      
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
      
      return res.status(201).json(song);
    }

    // Route not found
    return res.status(404).json({ error: 'Not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}