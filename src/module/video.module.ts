import { videoRepo } from "../model"
import { z } from "zod";
const getVideoSchema = z.object({
    playlistId: z.string(),
    videoId: z.string()
})
const addVideoSchema = z.object({
    url: z.string(),
})
const getVideosSchema = z.object({
    playlistId: z.string()
})
const getAllVideo = async (reqBody:any) => {
    const reqData = await getVideosSchema.parseAsync(reqBody)
    const videos = await videoRepo.find({
        where:{
            playlist:{
                id:reqData.playlistId
            }
        }
    })
    return videos;
}
const getVideoById = async(reqBody:string) => {
    const reqData = await getVideoSchema.parseAsync(reqBody);
    const video = await videoRepo.find({
        where:{
            playlist:{
                id:reqData.playlistId
            },
            id: reqData.videoId
        }
    })
    return video
}
const addVideo = async(reqBody:any) =>{
    const reqData = await addVideoSchema.parseAsync(reqBody);
    const videoName = "";
    const video = await videoRepo.create({
        url: reqData.url,
        name: videoName
    })
    await videoRepo.save(video);
    return video;
}
const deleteVideo = async (reqBody:any)=>{
    const reqData = await getVideoSchema.parseAsync(reqBody);
    const video = getVideoById(reqBody);
    await videoRepo.delete({
        id: reqData.videoId,
        playlist:{
            id:reqData.playlistId
        }
    })
    return video
}
export{
    getAllVideo,
    getVideoById,
    addVideo,
    deleteVideo
}