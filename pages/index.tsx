import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('https://your-app.vercel.app');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const tryEndpoint = (endpoint: string) => {
    const fullUrl = `${baseUrl}${endpoint}`;
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">🎵 Lyrics API</h1>
        <p className="subtitle">Get song lyrics by artist and song name</p>
      </div>

      <div className="endpoint">
        <h3>
          <span className="method-badge">GET</span>
          Get Lyrics by Artist and Song
        </h3>
        <div className="endpoint-url">/api/lyrics/{'{artist}'}/{'{song}'}</div>
        <div className="description">
          Retrieve only the lyrics for a specific song by providing the artist name and song title.
        </div>
        <button className="try-button" onClick={() => tryEndpoint('/api/lyrics/Coldplay/Yellow')}>
          Try it
        </button>
        <pre className="example">{`Example: GET /api/lyrics/Coldplay/Yellow

Response:
{
  "lyrics": "Look at the stars\\nLook how they shine for you\\nAnd everything you do\\nYeah, they were all yellow..."
}`}</pre>
      </div>

      <div className="endpoint">
        <h3>
          <span className="method-badge">GET</span>
          Get All Songs
        </h3>
        <div className="endpoint-url">/api/songs</div>
        <div className="description">
          Retrieve a list of all songs in the database (without lyrics).
        </div>
        <button className="try-button" onClick={() => tryEndpoint('/api/songs')}>Try it</button>
        <pre className="example">{`Response:
[
  {
    "id": "cm123abc",
    "title": "Yellow",
    "artist": "Coldplay",
    "album": "Parachutes",
    "year": 2000,
    "genre": "Alternative Rock",
    "duration": 269
  }
]`}</pre>
      </div>



    </div>
  );
};

export default Home;