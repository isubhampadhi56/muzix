import { videoRepo } from "../model"
import { z } from "zod";
import YoutubeService from "../service/youtube.service";
const getVideoSchema = z.object({
    playlistId: z.string(),
    videoId: z.string()
})
const addVideoSchema = z.object({
    url: z.string(),
    playlistId: z.string()
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
const getVideoById = async(videoId:string) => {
    if(!videoId.trim()){
        throw new Error("Invalid Video ID");
    }
    // const reqData = await getVideoSchema.parseAsync(reqBody);
    const currVideo = await videoRepo.findOne({
        where:{
            // playlist:{
            //     id:reqData.playlistId
            // },
            id: videoId
        }
    })
    if(currVideo){
        const {audio,video} = await (await YoutubeService.getInstance()).getStreamUrl(currVideo.url);
        return{
            ...currVideo,
            audio,
            video
        }
    }
    return null;
}
const addVideo = async(reqBody:any) =>{
    const reqData = await addVideoSchema.parseAsync(reqBody);
    const videoName = "";
    const video = await videoRepo.create({
        url: reqData.url,
        name: videoName,
        playlist:{
            id:reqData.playlistId     
        }
    })
    await videoRepo.save(video);
    return video;
}
const deleteVideo = async (reqBody:any)=>{
    const reqData = await getVideoSchema.parseAsync(reqBody);
    const video = getVideoById(reqBody.videoId);
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