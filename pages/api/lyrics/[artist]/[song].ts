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
  const matchingSong = songs.find((candidate) => {
    const isSameArtist = candidate.artist.toLowerCase() === artist.toLowerCase();
    const isSameTitle = candidate.title.toLowerCase() === song.toLowerCase();
    return isSameArtist && isSameTitle;
  });

  if (!matchingSong) {
    return res.status(404).json({ error: 'Song not found' });
  }

  return res.json({ lyrics: matchingSong.lyrics });
}
