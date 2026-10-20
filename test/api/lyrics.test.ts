import handler from '../../pages/api/lyrics/[artist]/[song]';
import songs from '../../data/songs.json';
import { fakeRequest, fakeResponse } from '../fakeApi';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

describe('/api/lyrics/[artist]/[song]', () => {
  it('returns the lyrics for a matching artist and title on GET', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('GET', { artist: 'Coldplay', song: 'Yellow' }), res);

    expect(recorded.statusCode).toBe(200);
    expect(recorded.body).toEqual({ lyrics: songs[0].lyrics });
  });

  it('matches artist and title case-insensitively', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('GET', { artist: 'coldplay', song: 'yellow' }), res);

    expect(recorded.statusCode).toBe(200);
    expect(recorded.body).toEqual({ lyrics: songs[0].lyrics });
  });

  it('serves the corrected lauv lyrics', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('GET', { artist: 'Lauv', song: 'i like me better' }), res);

    expect(recorded.statusCode).toBe(200);
    expect(recorded.body).toEqual({ lyrics: songs[2].lyrics });
    expect(songs[2].lyrics.startsWith('To be young')).toBe(true);
  });

  it('returns 404 for an unknown song', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('GET', { artist: 'nobody', song: 'nothing' }), res);

    expect(recorded.statusCode).toBe(404);
    expect(recorded.body).toEqual({ error: 'Song not found' });
  });

  it('sets CORS headers on GET', async () => {
    const { res, recorded } = fakeResponse();

    await handler(fakeRequest('GET', { artist: 'Coldplay', song: 'Yellow' }), res);

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
