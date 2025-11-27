import { videoRepo } from "../model"
import { z } from "zod";
import YoutubeService from "../service/youtube.service";
import { v4 as uuidv4 } from "uuid";
import { generateKeyBetween } from "jittered-fractional-indexing";
const getVideoSchema = z.object({
    playlistId: z.string(),
    videoId: z.string()
})
const addVideoSchema = z.object({
    url: z.string(),
    playlistId: z.string(),
    prevRank:z.string().optional().nullable(),
    nextRank:z.string().optional().nullable()
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
        },
        order:{
            rank: "ASC"
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
    const prevRank = reqData?.prevRank || null;
    const nextRank = reqBody?.nextRank || null;
    const midRank = generateKeyBetween(prevRank,nextRank)
    const video = await videoRepo.create({
        id: uuidv4(),
        url: reqData.url,
        playlist:{
            id:reqData.playlistId     
        },
        rank:midRank
    })
    await videoRepo.save(video);
    return video;
}
const moveVideoSchema = z.object({
    videoId: z.string(),
    playlistId: z.string(),
    prevRank: z.string().optional().nullable(),
    nextRank: z.string().optional().nullable()
})

const moveVideo = async (reqBody: any) => {
    const reqData = await moveVideoSchema.parseAsync(reqBody);
    
    // Get the video to move
    const video = await videoRepo.findOne({
        where: {
            id: reqData.videoId,
            playlist: {
                id: reqData.playlistId
            }
        }
    });

    if (!video) {
        throw new Error("Video not found in the specified playlist");
    }

    // Calculate new rank using fractional indexing
    const prevRank = reqData?.prevRank || null;
    const nextRank = reqData?.nextRank || null;
    const newRank = generateKeyBetween(prevRank, nextRank);

    // Update the video with the new rank
    video.rank = newRank;
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
    deleteVideo,
    moveVideo
}
