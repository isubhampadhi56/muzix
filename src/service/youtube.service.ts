import { spawn } from 'cross-spawn';
import path from 'path';
import fs from "fs";
class YoutubeService {
    private static instance: YoutubeService;
    private initializationPromise: Promise<void> | null = null;

    private constructor() {
        // Initialize asynchronously
        this.initializationPromise = this.initialize();
    }

    private async initialize(): Promise<void> {
        const filePath = path.join(process.cwd(), "yt-dlp");
        console.log(process.cwd())
        if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
        }
        console.log('YouTube service initialized successfully');
    }

    static async getInstance(): Promise<YoutubeService> {
        if (!YoutubeService.instance) {
            YoutubeService.instance = new YoutubeService();
        }
        
        // Wait for initialization to complete
        if (YoutubeService.instance.initializationPromise) {
            await YoutubeService.instance.initializationPromise;
        }
        
        return YoutubeService.instance;
    }
    extractVideoId(url: string): string | null {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
            /youtube\.com\/watch\?.*v=([^&?#]+)/,
            /youtu\.be\/([^&?#]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
            return match[1];
            }
        }
        return null;
        }    
    async  getStreamUrl(videoUrl: string, maxHeight = 1080): Promise<{video: string, audio: string}> {
        return new Promise((resolve, reject) => {
            // yt-dlp command arguments
            const args = [
            '-f', `bv[ext=mp4][height<=${maxHeight}]+ba[ext=m4a]`,
            '-g', // get direct URLs
            videoUrl
            ];

            const yt = spawn('./yt-dlp', args);

            let stdout = '';
            let stderr = '';

            yt.stdout.on('data', (data) => {
            stdout += data.toString();
            });

            yt.stderr.on('data', (data) => {
            stderr += data.toString();
            });

            yt.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`yt-dlp failed: ${stderr}`));
            } else {
                const [videoUrl, audioUrl] = stdout.trim().split('\n');
                resolve({ video: videoUrl, audio: audioUrl });
            }
            });
        });
    }
    
}

export default YoutubeService;
