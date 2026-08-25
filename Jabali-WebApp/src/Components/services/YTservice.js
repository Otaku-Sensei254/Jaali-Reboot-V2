// src/services/YTService.js
const API_KEY = 'AIzaSyDqJarZ1_5V15jrq9DEsorGA99rAFDlQSE';

// Cache to avoid redundant API calls
const videoCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const getVideoDetails = async (videoId) => {
  // Check cache first
  const cached = videoCache.get(videoId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;
    
    const duration = formatDuration(contentDetails.duration);
    const thumbnail = getBestThumbnail(snippet.thumbnails);
    
    const videoData = {
      videoId: videoId,
      title: snippet.title,
      description: snippet.description,
      duration: duration,
      thumbnail: thumbnail,
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      viewCount: video.statistics?.viewCount || '0'
    };

    // Cache the result
    videoCache.set(videoId, {
      data: videoData,
      timestamp: Date.now()
    });

    return videoData;
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    
    // Return fallback data
    return getFallbackVideoData(videoId);
  }
};

// Get multiple videos with batch processing
export const getMultipleVideoDetails = async (videoIds) => {
  const uniqueIds = [...new Set(videoIds)];
  const results = [];

  for (const videoId of uniqueIds) {
    try {
      const videoData = await getVideoDetails(videoId);
      results.push(videoData);
    } catch (error) {
      console.error(`Error fetching details for video ${videoId}:`, error);
      results.push(getFallbackVideoData(videoId));
    }
  }

  return results;
};

// Helper function to get the best available thumbnail
const getBestThumbnail = (thumbnails) => {
  return thumbnails.maxres?.url || 
         thumbnails.standard?.url ||
         thumbnails.high?.url || 
         thumbnails.medium?.url ||
         thumbnails.default?.url ||
         '/fallback-thumbnail.jpg';
};

// Fallback data when API fails
const getFallbackVideoData = (videoId) => ({
  videoId: videoId,
  title: 'Video Loading...',
  description: 'Unable to load video details at this time.',
  duration: '0:00',
  thumbnail: '/fallback-thumbnail.jpg',
  channelTitle: 'Unknown Channel',
  publishedAt: new Date().toISOString(),
  viewCount: '0'
});

// Helper function to convert ISO 8601 duration to readable format
const formatDuration = (isoDuration) => {
  if (!isoDuration) return '0:00';
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return '0:00';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};