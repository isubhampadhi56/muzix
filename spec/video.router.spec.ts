import request from 'supertest';
import express from 'express';
import { connectToDB, clearDB } from '../src/model';
import { router as playlistRouter } from '../src/route/playlist.router';
import { router as videoRouter } from '../src/route/video.router';

describe('Video Router - Integration Tests', () => {
  let app: express.Application;
  let server: any;
  let baseUrl: string;
  let testPlaylistId: string;

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

    // Create a test playlist for video tests
    const playlistResponse = await request(baseUrl)
      .post('/playlist')
      .send({ 
        name: 'Test Playlist for Videos ' + Date.now(), 
        location: 'test-location' 
      })
      .expect(200);
    
    testPlaylistId = playlistResponse.body.id;
  });

  afterAll(async () => {
    // Close the server after tests
    if (server) {
      server.close();
    }
  });

  describe('GET /videos', () => {
    it('should return all videos with playlistId', async () => {
      const response = await request(baseUrl)
        .get('/videos')
        .send({ playlistId: testPlaylistId })
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /videos', () => {
    it('should add a new video', async () => {
      const newVideo = { 
        url: 'https://youtube.com/watch?v=test123', 
        playlistId: testPlaylistId 
      };

      const response = await request(baseUrl)
        .post('/videos')
        .send(newVideo)
        .expect(200);

      expect(response.body.video).toBeDefined();
      expect(response.body.video.url).toBe(newVideo.url);
      expect(response.body.video.playlistId).toBe(testPlaylistId);
    });

    it('should require url and playlistId fields', async () => {
      const invalidVideo = { playlistId: testPlaylistId }; // Missing url

      const response = await request(baseUrl)
        .post('/videos')
        .send(invalidVideo)
        .expect(500); // Should return error for missing required field

      expect(response.body).toBeDefined();
    });
  });

  describe('PATCH /videos/move', () => {
    it('should move a video to a new position', async () => {
      // First add a video
      const newVideo = { 
        url: 'https://youtube.com/watch?v=move123', 
        playlistId: testPlaylistId 
      };

      const addResponse = await request(baseUrl)
        .post('/videos')
        .send(newVideo)
        .expect(200);

      const videoId = addResponse.body.video.id;

      // Then move it (to beginning of playlist)
      const moveRequest = {
        videoId: videoId,
        playlistId: testPlaylistId,
        prevRank: null, // Move to beginning
        nextRank: null  // No next video
      };

      const moveResponse = await request(baseUrl)
        .patch('/videos/move')
        .send(moveRequest)
        .expect(200);

      expect(moveResponse.body).toBeDefined();
      expect(moveResponse.body.id).toBe(videoId);
      expect(moveResponse.body.rank).toBeDefined();
    });

    it('should handle non-existent video', async () => {
      const moveRequest = {
        videoId: 'non-existent-id',
        playlistId: testPlaylistId,
        prevRank: null,
        nextRank: null
      };

      const response = await request(baseUrl)
        .patch('/videos/move')
        .send(moveRequest)
        .expect(500); // Should return error for non-existent video

      expect(response.body).toBeDefined();
    });
  });

  describe('DELETE /videos/:id', () => {
    it('should delete a video', async () => {
      // First add a video to delete
      const newVideo = { 
        url: 'https://youtube.com/watch?v=delete123', 
        playlistId: testPlaylistId 
      };

      const addResponse = await request(baseUrl)
        .post('/videos')
        .send(newVideo)
        .expect(200);

      const videoId = addResponse.body.video.id;

      // Then delete it
      const deleteResponse = await request(baseUrl)
        .delete(`/videos/${videoId}`)
        .send({ playlistId: testPlaylistId })
        .expect(200);

      expect(deleteResponse.body).toBeDefined();
    });
  });
});
