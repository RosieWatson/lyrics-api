import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
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

    if (req.method === 'POST') {
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

    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}