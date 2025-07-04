import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f8fafc;
  color: #334155;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5em;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 10px 0 0 0;
  font-size: 1.1em;
  opacity: 0.9;
`;

const Endpoint = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MethodBadge = styled.span<{ method: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8em;
  margin-right: 10px;
  color: white;
  background: ${props => props.method === 'GET' ? '#10b981' : '#3b82f6'};
`;

const EndpointUrl = styled.div`
  font-family: 'Monaco', 'Menlo', monospace;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 0.9em;
`;

const Description = styled.div`
  margin: 15px 0;
  line-height: 1.5;
`;

const Example = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85em;
  margin: 10px 0;
  overflow-x: auto;
`;

const TryButton = styled.button`
  background: #059669;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin: 10px 0;
  
  &:hover {
    background: #047857;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  color: #64748b;
  font-size: 0.9em;
`;


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
    <Container>
      <Header>
        <Title>🎵 Lyrics API</Title>
        <Subtitle>Get song lyrics by artist and song name</Subtitle>
      </Header>

      <Endpoint>
        <h3>
          <MethodBadge method="GET">GET</MethodBadge>
          Get Lyrics by Artist and Song
        </h3>
        <EndpointUrl>/api/lyrics/{'{artist}'}/{'{song}'}</EndpointUrl>
        <Description>
          Retrieve only the lyrics for a specific song by providing the artist name and song title.
        </Description>
        <TryButton onClick={() => tryEndpoint('/api/lyrics/Coldplay/Yellow')}>
          Try it
        </TryButton>
        <Example>{`Example: GET /api/lyrics/Coldplay/Yellow

Response:
{
  "lyrics": "Look at the stars\\nLook how they shine for you\\nAnd everything you do\\nYeah, they were all yellow..."
}`}</Example>
      </Endpoint>

      <Endpoint>
        <h3>
          <MethodBadge method="GET">GET</MethodBadge>
          Get All Songs
        </h3>
        <EndpointUrl>/api/songs</EndpointUrl>
        <Description>
          Retrieve a list of all songs in the database (without lyrics).
        </Description>
        <TryButton onClick={() => tryEndpoint('/api/songs')}>Try it</TryButton>
        <Example>{`Response:
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
]`}</Example>
      </Endpoint>

      <Endpoint>
        <h3>
          <MethodBadge method="POST">POST</MethodBadge>
          Add New Song
        </h3>
        <EndpointUrl>/api/songs</EndpointUrl>
        <Description>
          Add a new song with lyrics to the database.
        </Description>
        <Example>{`POST /api/songs
Content-Type: application/json

{
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "year": 2024,
  "genre": "Genre",
  "lyrics": "Song lyrics here...",
  "duration": 180
}`}</Example>
      </Endpoint>

      <Footer>
        <p>Built with Fastify, Prisma, and deployed on Vercel</p>
        <p>Base URL: <code>{baseUrl}</code></p>
      </Footer>

    </Container>
  );
};

export default Home;