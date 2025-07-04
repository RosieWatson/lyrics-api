import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient().$extends(withAccelerate());

interface Song {
  title: string;
  artist: string;
  album: string;
  year: number;
  genre: string;
  duration: number;
  lyrics: string;
}

async function main() {
  // Read songs from JSON file
  const songsPath = path.join(__dirname, 'songs.json');
  const songsData = fs.readFileSync(songsPath, 'utf8');
  const songs: Song[] = JSON.parse(songsData);

  console.log(`Seeding ${songs.length} songs...`);

  // Create all songs
  for (const song of songs) {
    const createdSong = await prisma.song.create({
      data: {
        title: song.title,
        artist: song.artist,
        album: song.album,
        year: song.year,
        genre: song.genre,
        duration: song.duration,
        lyrics: song.lyrics
      }
    });
    
    console.log(`Created: ${createdSong.title} by ${createdSong.artist}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });