import express from "express";
import { connectToDB } from "./model";
import { router as playlistRouter} from "./route/playlist.router";
import { router as videoRouter } from "./route/video.router";
const app = express()
const PORT = process.env.PORT || 3000

// Add body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/playlist",playlistRouter);
app.use("/videos",videoRouter)
async function main(){
  try {
    await connectToDB()
    console.log("✅ Connected to database");

    // Now start the server
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database", error);
    process.exit(1); 
  }
}

main();
