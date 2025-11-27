import request from 'supertest';
import express from 'express';
import { connectToDB, clearDB } from '../src/model';
import { router as playlistRouter } from '../src/route/playlist.router';
import { router as videoRouter } from '../src/route/video.router';

describe('Playlist Router - Integration Tests', () => {
  let app: express.Application;
  let server: any;
  let baseUrl: string;

  beforeAll(async () => {
    // Create express app
    app = express();
    app.use(express.json());
    
    // Add routes
    app.use('/playlist', playlistRouter);
    app.use('/videos', videoRouter);
    
    // Connect to database
    try {
      await connectToDB();
      console.log("✅ Connected to database for tests");
      
      // Clear database after connection is established
      await clearDB();
    } catch (error) {
      console.warn("⚠️ Database connection failed, but continuing tests:", error);
    }

    // Start server
    const PORT = process.env.PORT || 4000;
    server = app.listen(PORT);
    baseUrl = `http://localhost:${PORT}`;
  });

  afterAll(async () => {
    // Close the server after tests
    if (server) {
      server.close();
    }
  });

  describe('GET /playlist', () => {
    it('should return all playlists', async () => {
      const response = await request(baseUrl)
        .get('/playlist')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /playlist', () => {
    it('should create a new playlist', async () => {
      const newPlaylist = { 
        name: 'Test Playlist ' + Date.now(), 
        location: 'test-location' 
      };

      const response = await request(baseUrl)
        .post('/playlist')
        .send(newPlaylist)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should require name field', async () => {
      const invalidPlaylist = { location: 'test-location' };

      const response = await request(baseUrl)
        .post('/playlist')
        .send(invalidPlaylist)
        .expect(500); // Should return error for missing required field

      expect(response.body).toBeDefined();
    });
  });

  describe('GET /playlist/:id/videos', () => {
    it('should return videos for a playlist', async () => {
      // First create a playlist
      const newPlaylist = { 
        name: 'Test Playlist for Videos ' + Date.now(), 
        location: 'test-location' 
      };

      const playlistResponse = await request(baseUrl)
        .post('/playlist')
        .send(newPlaylist)
        .expect(200);

      // Get videos for the playlist (should be empty initially)
      const videosResponse = await request(baseUrl)
        .get(`/playlist/${playlistResponse.body.id}/videos`)
        .expect(200);

      expect(videosResponse.body).toBeInstanceOf(Array);
    });

    it('should handle non-existent playlist', async () => {
      const response = await request(baseUrl)
        .get('/playlist/non-existent-id/videos')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('DELETE /playlist/:id', () => {
    it('should delete a playlist', async () => {
      // First create a playlist to delete
      const newPlaylist = { 
        name: 'Playlist to Delete ' + Date.now(), 
        location: 'test-location' 
      };

      const createResponse = await request(baseUrl)
        .post('/playlist')
        .send(newPlaylist)
        .expect(200);

      // Then delete it
      const deleteResponse = await request(baseUrl)
        .delete(`/playlist/${createResponse.body.id}`)
        .expect(200);

      expect(deleteResponse.body).toBeDefined();
    });
  });
});
