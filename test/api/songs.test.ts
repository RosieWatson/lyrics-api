import handler from '../../pages/api/songs';
import { fakeRequest, fakeResponse } from '../fakeApi';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

describe('/api/songs', () => {
  it('returns every song without lyrics on GET', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('GET'), res);

    expect(recorded.statusCode).toBe(200);
    expect(recorded.body).toEqual([
      {
        id: 'cmcp03i8k00013o0wmes5dc8y',
        title: 'Yellow',
        artist: 'Coldplay',
        album: 'Parachutes',
        year: 2000,
        genre: 'Alternative Rock',
        duration: 269,
      },
      {
        id: 'cmcp03ibv00023o0wai4q2ehq',
        title: 'Adventure of a Lifetime',
        artist: 'Coldplay',
        album: 'A Head Full of Dreams',
        year: 2015,
        genre: 'Funk Pop',
        duration: 255,
      },
      {
        id: 'cmcp03idr00033o0wxxnhzyj0',
        title: 'I Like Me Better',
        artist: 'Lauv',
        album: 'I Met You When I Was 18. (The Playlist)',
        year: 2017,
        genre: 'Pop',
        duration: 197,
      },
    ]);
  });

  it('sets CORS headers on GET', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('GET'), res);

    expect(recorded.headers).toEqual(corsHeaders);
  });

  it('answers OPTIONS with an empty 200', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('OPTIONS'), res);

    expect(recorded.statusCode).toBe(200);
    expect(recorded.body).toBeUndefined();
    expect(recorded.headers).toEqual(corsHeaders);
  });

  it('rejects POST with 405', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('POST'), res);

    expect(recorded.statusCode).toBe(405);
    expect(recorded.body).toEqual({ error: 'Method not allowed' });
  });
});
