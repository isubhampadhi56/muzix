import express from "express";
import path from "path";
import cors from "cors";
import { connectToDB } from "./model";
import { router as playlistRouter} from "./route/playlist.router";
import { router as videoRouter } from "./route/video.router";
// import youtubeRouter from "./route/youtube.router";
import { swaggerSpec, swaggerUi } from "./swagger";
const app = express()
const PORT = Number(process.env.PORT || 3000)

// Add body parsing middleware
app.use(express.json())
// Allow all CORS
app.use(cors()); // 👈 This enables Access-Control-Allow-Origin: *
app.use(express.urlencoded({ extended: true }))
app.use("/playlist",playlistRouter);
app.use("/videos",videoRouter);
// app.use("/youtube", youtubeRouter);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Serve the main page for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

async function main(){
  try {
    // Try to connect to database, but don't fail if it doesn't work
    await connectToDB()
    console.log("✅ Connected to database");
  } catch (error) {
    console.warn("⚠️ Database connection failed, but continuing without database:", error);
  }

  // Start the server regardless of database connection
  app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to use the YouTube player`);
  });
}

main();
