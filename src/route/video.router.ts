import { Router } from "express";
import { addVideo, deleteVideo, getAllVideo, getVideoById } from "../module/video.module";
export const router = Router();
router.get("/",async (req,res,next)=>{
    const videos = await getAllVideo(req.body);
    return videos;
})
router.get("/:id",async (req,res,next)=>{
    const video = await getVideoById(req.body);
    return video;
})
router.post("/",async (req,res,next)=>{
    const video = await addVideo(req.body);
    return video;
})
router.put("/",(req,res,next)=>{

})

router.delete("/:id",(req,res,next)=>{
    const video = deleteVideo(req.body);
    return video;
})
