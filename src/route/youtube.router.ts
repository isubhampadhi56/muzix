import { Router } from 'express';
import YoutubeService from '../service/youtube.service';

const router = Router();

// Extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
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

// Get video info and streaming URL
router.get('/video/:videoIdOrUrl', async (req, res) => {
  try {
    const { videoIdOrUrl } = req.params;
    
    // Extract video ID if URL is provided
    let videoId = videoIdOrUrl;
    if (videoIdOrUrl.includes('youtube.com') || videoIdOrUrl.includes('youtu.be')) {
      const extractedId = extractVideoId(videoIdOrUrl);
      if (!extractedId) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }
      videoId = extractedId;
    }

    const youtubeService = await YoutubeService.getInstance();
    
    try {
      const videoData = await youtubeService.getStreamingUrl(videoId);
      res.json({
        success: true,
        data: videoData
      });
    } catch (youtubeError) {
      console.error('YouTube service error:', youtubeError);
      res.status(503).json({ 
        success: false, 
        error: 'YouTube service temporarily unavailable',
        message: 'Please try again later'
      });
    }
  } catch (error) {
    console.error('Error getting video stream:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get video stream',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search for videos
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const youtubeService = await YoutubeService.getInstance();
    const youtube = youtubeService.getYouTube();
    
    const searchResults = await youtube.search(q);
    
    const videos = searchResults.videos.map((video: any) => ({
      id: video.id,
      title: video.title.text,
      duration: video.duration?.seconds,
      thumbnail: video.thumbnails?.[0]?.url,
      channel: video.author.name
    }));

    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search videos' 
    });
  }
});

export default router;
