import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  // Create Yellow by Coldplay
  const yellowSong = await prisma.song.create({
    data: {
      title: 'Yellow',
      artist: 'Coldplay',
      album: 'Parachutes',
      year: 2000,
      genre: 'Alternative Rock',
      duration: 269, // 4:29 in seconds
      lyrics: `Look at the stars
Look how they shine for you
And everything you do
Yeah, they were all yellow
I came along
I wrote a song for you
And all the things you do
And it was called, "Yellow"
So then I took my turn
Oh, what a thing to have done
And it was all yellow
Your skin, oh yeah, your skin and bones
Turn into something beautiful
And you know, you know I love you so
You know I love you so
I swam across
I jumped across for you
Oh, what a thing to do
'Cause you were all yellow
I drew a line
I drew a line for you
Oh, what a thing to do
And it was all yellow
And your skin, oh yeah, your skin and bones
Turn into something beautiful
And you know, for you, I'd bleed myself dry
For you, I'd bleed myself dry
It's true
Look how they shine for you
Look how they shine for you
Look how they shine for
Look how they shine for you
Look how they shine for you
Look how they shine
Look at the stars
Look how they shine for you
And all the things that you do`
    }
  });

  console.log('Created song:', yellowSong);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });