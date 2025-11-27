import { Router } from "express";
import { addVideo, deleteVideo, getAllVideo, getVideoById, moveVideo } from "../module/video.module";
export const router = Router();

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Get all videos
 *     description: Retrieve a list of all videos (requires playlistId in request body)
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playlistId
 *             properties:
 *               playlistId:
 *                 type: string
 *                 description: Playlist ID to filter videos
 *     responses:
 *       200:
 *         description: A list of videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 */
router.get("/",async (req,res,next)=>{
    const videos = await getAllVideo(req.body);
    res.json(videos);
})
/**
 * @swagger
 * /videos/{id}:
 *   get:
 *     summary: Get a video by ID
 *     description: Retrieve a specific video by its ID (requires playlistId in request body)
 *     tags: [Videos]
 *     parameters:
 *       - $ref: '#/components/parameters/VideoId'
 *     responses:
 *       200:
 *         description: Video found with stream URLs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       404:
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id",async (req,res,next)=>{
    const videoId = req.params.id;
    const video = await getVideoById(videoId);
    res.json(video);
})
/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Add a new video
 *     description: Add a new YouTube video to the system with fractional indexing for ordering
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - playlistId
 *             properties:
 *               url:
 *                 type: string
 *                 description: YouTube video URL
 *               playlistId:
 *                  type: string
 *                  description: PlaylistId of Playlist
 *               prevRank:
 *                 type: string
 *                 description: Rank of the previous video (for inserting between videos)
 *                 nullable: true
 *               nextRank:
 *                 type: string
 *                 description: Rank of the next video (for inserting between videos)
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Video added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 */
router.post("/",async (req,res,next)=>{
    const video = await addVideo(req.body);
    res.json({video});
})
/**
 * @swagger
 * /videos:
 *   put:
 *     summary: Update a video
 *     description: Update video information (currently not implemented)
 *     tags: [Videos]
 *     responses:
 *       501:
 *         description: Not implemented
 */
router.put("/",(req,res,next)=>{

})

/**
 * @swagger
 * /videos/move:
 *   patch:
 *     summary: Move a video to a new position in playlist
 *     description: Move a video to a new position using fractional indexing for ordering
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoId
 *               - playlistId
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: ID of the video to move
 *               playlistId:
 *                 type: string
 *                 description: Playlist ID that contains the video
 *               prevRank:
 *                 type: string
 *                 description: Rank of the previous video (for inserting between videos)
 *                 nullable: true
 *               nextRank:
 *                 type: string
 *                 description: Rank of the next video (for inserting between videos)
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Video moved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       404:
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/move",async (req,res,next)=>{
    const video = await moveVideo(req.body);
    res.json(video);
})

/**
 * @swagger
 * /videos/{id}:
 *   delete:
 *     summary: Delete a video
 *     description: Delete a specific video by its ID (requires playlistId in request body)
 *     tags: [Videos]
 *     parameters:
 *       - $ref: '#/components/parameters/VideoId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playlistId
 *             properties:
 *               playlistId:
 *                 type: string
 *                 description: Playlist ID that contains the video
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id",(req,res,next)=>{
    const videoId = req.params.id;
    const video = deleteVideo({...req.body,videoId});
    res.json(video);
})
