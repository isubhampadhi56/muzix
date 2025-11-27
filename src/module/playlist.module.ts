import { playlistRepo, videoRepo } from "../model"
import { z } from "zod";
const createPlaylistSchema = z.object({
    name: z.string(),
    location: z.string().optional()
})
const getAllPlaylist = async ()=>{
    const playlists = await playlistRepo.find({});
    return playlists;
}
const getPlaylistById = async (playlistId:string)=>{
    const playlist = await playlistRepo.findOne({
        where:{
            id: playlistId
        }
    })
}
const createPlaylist = async (reqBody: any)=>{
    const reqData = await createPlaylistSchema.parseAsync(reqBody)
    const playlist = await playlistRepo.create({
        ...reqData
    })
    await playlistRepo.save(playlist);
    return playlist
}
const deletePlayList = async (playlistId:string) =>{
    const playlist = getPlaylistById(playlistId);
    if(!playlist){
        throw Error("playlist does not exist")
    }
    await playlistRepo.delete({id:playlistId})
}
const updatePlayList = (reqBody:any)=>{
    
}
const getAllVideosInPlayList = async (playlistId:string) =>{
    const videos = await videoRepo.find({
        where:{
            playlist:{
                id:playlistId
            }
        },
        order:{
            rank: "ASC"
        }
    })
    return videos;
}
export{
    getAllPlaylist,
    getPlaylistById,
    createPlaylist,
    deletePlayList,
    getAllVideosInPlayList
}