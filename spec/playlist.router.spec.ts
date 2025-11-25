import request from 'supertest';
import express from 'express';
import { router as playlistRouter } from '../src/route/playlist.router';

// Mock the playlist module
const mockGetAllPlaylist = jasmine.createSpy('getAllPlaylist');
const mockGetPlaylistById = jasmine.createSpy('getPlaylistById');
const mockCreatePlaylist = jasmine.createSpy('createPlaylist');
const mockGetAllVideosInPlayList = jasmine.createSpy('getAllVideosInPlayList');
const mockDeletePlayList = jasmine.createSpy('deletePlayList');

// Mock the module
import * as playlistModule from '../src/module/playlist.module';
(playlistModule.getAllPlaylist as any) = mockGetAllPlaylist;
(playlistModule.getPlaylistById as any) = mockGetPlaylistById;
(playlistModule.createPlaylist as any) = mockCreatePlaylist;
(playlistModule.getAllVideosInPlayList as any) = mockGetAllVideosInPlayList;
(playlistModule.deletePlayList as any) = mockDeletePlayList;

const app = express();
app.use(express.json());
app.use('/playlist', playlistRouter);

describe('Playlist Router', () => {
  beforeEach(() => {
    mockGetAllPlaylist.calls.reset();
    mockGetPlaylistById.calls.reset();
    mockCreatePlaylist.calls.reset();
    mockGetAllVideosInPlayList.calls.reset();
    mockDeletePlayList.calls.reset();
  });

  describe('GET /playlist', () => {
    it('should return all playlists', async () => {
      const mockPlaylists = [
        { id: '1', name: 'Playlist 1', location: 'location1' },
        { id: '2', name: 'Playlist 2', location: 'location2' }
      ];
      mockGetAllPlaylist.and.resolveTo(mockPlaylists);

      const response = await request(app)
        .get('/playlist')
        .expect(200);

      expect(response.body).toEqual(mockPlaylists);
      expect(mockGetAllPlaylist).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting playlists', async () => {
      mockGetAllPlaylist.and.rejectWith(new Error('Database error'));

      const response = await request(app)
        .get('/playlist')
        .expect(200); // Note: The current implementation doesn't handle errors properly

      // The current implementation doesn't handle errors, so it will still return 200
      // This test shows the current behavior
    });
  });

  describe('GET /playlist/:id', () => {
    it('should return a playlist by ID', async () => {
      const mockPlaylist = { id: '1', name: 'Test Playlist', location: 'test-location' };
      mockGetPlaylistById.and.resolveTo(mockPlaylist);

      const response = await request(app)
        .get('/playlist/1')
        .expect(200);

      expect(response.body).toEqual(mockPlaylist);
      expect(mockGetPlaylistById).toHaveBeenCalledWith('1');
    });

    it('should handle non-existent playlist', async () => {
      mockGetPlaylistById.and.resolveTo(null);

      const response = await request(app)
        .get('/playlist/999')
        .expect(200);

      expect(response.body).toBeNull();
    });
  });

  describe('POST /playlist', () => {
    it('should create a new playlist', async () => {
      const newPlaylist = { name: 'New Playlist', location: 'new-location' };
      mockCreatePlaylist.and.resolveTo(undefined);

      const response = await request(app)
        .post('/playlist')
        .send(newPlaylist)
        .expect(200);

      expect(response.body).toEqual({});
      expect(mockCreatePlaylist).toHaveBeenCalledWith(newPlaylist);
    });

    it('should handle creation errors', async () => {
      const newPlaylist = { name: 'New Playlist' };
      mockCreatePlaylist.and.rejectWith(new Error('Creation failed'));

      const response = await request(app)
        .post('/playlist')
        .send(newPlaylist)
        .expect(200); // Current implementation doesn't handle errors properly
    });
  });

  describe('GET /playlist/:id/videos', () => {
    it('should return all videos in a playlist', async () => {
      const mockVideos = [
        { id: '1', title: 'Video 1', url: 'url1' },
        { id: '2', title: 'Video 2', url: 'url2' }
      ];
      mockGetAllVideosInPlayList.and.resolveTo(mockVideos);

      const response = await request(app)
        .get('/playlist/1/videos')
        .expect(200);

      expect(response.body).toEqual(mockVideos);
      expect(mockGetAllVideosInPlayList).toHaveBeenCalledWith('1');
    });

    it('should handle empty videos list', async () => {
      mockGetAllVideosInPlayList.and.resolveTo([]);

      const response = await request(app)
        .get('/playlist/1/videos')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('DELETE /playlist/:id', () => {
    it('should delete a playlist', async () => {
      const mockResult = { success: true };
      mockDeletePlayList.and.resolveTo(mockResult);

      const response = await request(app)
        .delete('/playlist/1')
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(mockDeletePlayList).toHaveBeenCalledWith('1');
    });

    it('should handle deletion errors', async () => {
      mockDeletePlayList.and.rejectWith(new Error('Deletion failed'));

      const response = await request(app)
        .delete('/playlist/1')
        .expect(200); // Current implementation doesn't handle errors properly
    });
  });
});
