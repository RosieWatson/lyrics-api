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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { artist, song } = req.query as { artist: string; song: string };
    
    if (!artist || !song) {
      return res.status(400).json({ error: 'Artist and song parameters are required' });
    }

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
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}