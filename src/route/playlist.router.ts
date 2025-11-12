import { NextFunction, Request, Router,Response } from "express";
import { createPlaylist, deletePlayList, getAllPlaylist, getPlaylistById } from "../module/playlist.module";
export const router = Router();

router.get("/",async (req:Request,res: Response,next:NextFunction)=>{
    const playlists = await getAllPlaylist();
    res.json(playlists)
})
router.get("/:id",async (req:Request,res: Response,next:NextFunction)=>{
    const playlist = await getPlaylistById(req.params.id)
    res.json(playlist)
})
router.post("/",async(req:Request,res: Response,next:NextFunction)=>{
    await createPlaylist(req.body as any);
    res.json({});
})
// router.put("/",(req,res,next)=>{

// })

router.delete("/:id",async(req:Request,res: Response,next:NextFunction)=>{
    const playlist = await deletePlayList(req.params.id)
    res.json(playlist);
})
