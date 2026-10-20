import { NextApiRequest, NextApiResponse } from 'next';
import songs from '../../../../data/songs.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { artist, song } = req.query as { artist: string; song: string };
  const songData = songs.find(
    (s) => s.artist.toLowerCase() === artist.toLowerCase() && s.title.toLowerCase() === song.toLowerCase()
  );

  if (!songData) {
    return res.status(404).json({ error: 'Song not found' });
  }

  return res.json({ lyrics: songData.lyrics });
}
