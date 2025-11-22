import { NextFunction, Request, Router,Response } from "express";
import { createPlaylist, deletePlayList, getAllPlaylist, getAllVideosInPlayList, getPlaylistById } from "../module/playlist.module";
export const router = Router();

/**
 * @swagger
 * /playlist:
 *   get:
 *     summary: Get all playlists
 *     description: Retrieve a list of all playlists
 *     tags: [Playlists]
 *     responses:
 *       200:
 *         description: A list of playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 */
router.get("/",async (req:Request,res: Response,next:NextFunction)=>{
    const playlists = await getAllPlaylist();
    res.json(playlists)
})
/**
 * @swagger
 * /playlist/{id}:
 *   get:
 *     summary: Get a playlist by ID
 *     description: Retrieve a specific playlist by its ID
 *     tags: [Playlists]
 *     parameters:
 *       - $ref: '#/components/parameters/PlaylistId'
 *     responses:
 *       200:
 *         description: Playlist found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       404:
 *         description: Playlist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id",async (req:Request,res: Response,next:NextFunction)=>{
    const playlist = await getPlaylistById(req.params.id)
    res.json(playlist)
})
/**
 * @swagger
 * /playlist:
 *   post:
 *     summary: Create a new playlist
 *     description: Create a new playlist with the provided data
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Playlist name
 *               location:
 *                 type: string
 *                 description: Playlist location (optional)
 *     responses:
 *       200:
 *         description: Playlist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 */
router.post("/",async(req:Request,res: Response,next:NextFunction)=>{
    await createPlaylist(req.body as any);
    res.json({});
})
/**
 * @swagger
 * /playlist/{id}/videos:
 *   get:
 *     summary: Get all videos in a playlist
 *     description: Retrieve all videos belonging to a specific playlist
 *     tags: [Playlists]
 *     parameters:
 *       - $ref: '#/components/parameters/PlaylistId'
 *     responses:
 *       200:
 *         description: List of videos in the playlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 */
router.get("/:id/videos",async (req,res,next)=>{
    const videos = await getAllVideosInPlayList(req.params.id)
    res.json(videos);
})

/**
 * @swagger
 * /playlist/{id}:
 *   delete:
 *     summary: Delete a playlist
 *     description: Delete a specific playlist by its ID
 *     tags: [Playlists]
 *     parameters:
 *       - $ref: '#/components/parameters/PlaylistId'
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 *       404:
 *         description: Playlist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id",async(req:Request,res: Response,next:NextFunction)=>{
    const playlist = await deletePlayList(req.params.id)
    res.json(playlist);
})
