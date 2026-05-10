/**
 * Telegram Avatar Service
 * Provides functions to get user profile photos from Telegram
 * Uses multiple strategies: Bot API, Web API, and fallback to placeholder
 */

import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = "https://api.telegram.org";

// In-memory cache for avatar URLs (will be persisted to DB in next phase)
const avatarCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get user profile photo from Telegram by username
 * Tries multiple strategies to get the avatar
 */
export async function getTelegramAvatarUrl(username: string): Promise<string> {
  if (!username) {
    return getPlaceholderAvatar(username);
  }

  try {
    const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
    
    // Check cache first
    const cached = avatarCache.get(cleanUsername);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[TelegramAvatarService] Cache hit for ${cleanUsername}`);
      return cached.url;
    }

    // Strategy 1: Try to get avatar from Telegram Web API (works for public profiles)
    let avatarUrl = await getAvatarFromWebApi(cleanUsername);
    
    if (avatarUrl) {
      // Cache the URL
      avatarCache.set(cleanUsername, { url: avatarUrl, timestamp: Date.now() });
      console.log(`[TelegramAvatarService] Successfully fetched avatar for @${cleanUsername} from Web API`);
      return avatarUrl;
    }

    // Strategy 2: Try Bot API if we have token
    if (TELEGRAM_BOT_TOKEN) {
      const userInfo = await getUserInfoByUsername(cleanUsername);
      
      if (userInfo && userInfo.id) {
        const photos = await getUserProfilePhotos(userInfo.id);
        
        if (photos && photos.total_count > 0) {
          const photoFileId = photos.photos[0][0].file_id;
          const fileInfo = await getFile(photoFileId);
          
          if (fileInfo && fileInfo.file_path) {
            avatarUrl = `${TELEGRAM_API_URL}/file/bot${TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;
            avatarCache.set(cleanUsername, { url: avatarUrl, timestamp: Date.now() });
            console.log(`[TelegramAvatarService] Successfully fetched avatar for @${cleanUsername} from Bot API`);
            return avatarUrl;
          }
        }
      }
    }
    
    // Fallback to placeholder if no photos found
    console.log(`[TelegramAvatarService] No profile photos found for @${cleanUsername}, using placeholder`);
    return getPlaceholderAvatar(cleanUsername);
  } catch (error) {
    console.error(`[TelegramAvatarService] Error getting avatar for ${username}:`, error instanceof Error ? error.message : 'Unknown error');
    return getPlaceholderAvatar(username);
  }
}

/**
 * Get avatar from Telegram Web API
 * This works for public profiles without requiring bot interaction
 * Returns the direct CDN URL that can be used in img src
 */
async function getAvatarFromWebApi(username: string): Promise<string | null> {
  try {
    const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
    
    // Try different resolutions in order of preference
    const resolutions = [320, 200, 160, 100];
    
    for (const resolution of resolutions) {
      const avatarUrl = `https://t.me/i/userpic/${resolution}/${cleanUsername}.jpg`;
      
      try {
        // Use GET request with minimal data to check if image exists
        // Telegram blocks HEAD requests, so we use GET with responseType
        const response = await axios.get(avatarUrl, { 
          timeout: 5000,
          responseType: 'arraybuffer',
          maxRedirects: 5,
          validateStatus: (status) => status >= 200 && status < 400
        });
        
        if (response.status === 200 && response.data && response.data.byteLength > 100) {
          console.log(`[TelegramAvatarService] Found avatar at resolution ${resolution} for @${cleanUsername}`);
          // Return the highest resolution URL that works
          return `https://t.me/i/userpic/320/${cleanUsername}.jpg`;
        }
      } catch (err) {
        // This resolution didn't work, try next one
        continue;
      }
    }
    
    console.debug(`[TelegramAvatarService] No working avatar resolution found for @${cleanUsername}`);
    return null;
  } catch (error) {
    console.error(`[TelegramAvatarService] Error in getAvatarFromWebApi for @${username}:`, error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Get user info by username using Telegram Bot API
 * This endpoint requires the bot to know about the user
 */
async function getUserInfoByUsername(username: string): Promise<any> {
  try {
    // Try using getChat endpoint (requires bot to be in chat with user)
    const response = await axios.post(
      `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/getChat`,
      { chat_id: `@${username}` },
      { timeout: 5000 }
    );
    
    if (response.data.ok) {
      return response.data.result;
    }
  } catch (error) {
    // getChat might fail if bot hasn't interacted with user
    console.debug(`[TelegramAvatarService] getChat failed for @${username}`);
  }
  
  return null;
}

/**
 * Get user profile photos from Telegram Bot API
 */
async function getUserProfilePhotos(userId: number): Promise<any> {
  try {
    const response = await axios.post(
      `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/getUserProfilePhotos`,
      { 
        user_id: userId,
        limit: 1  // Get only the most recent photo
      },
      { timeout: 5000 }
    );
    
    if (response.data.ok) {
      return response.data.result;
    }
  } catch (error) {
    console.error(`[TelegramAvatarService] Error getting profile photos for user ${userId}:`, error);
  }
  
  return null;
}

/**
 * Get file info from Telegram Bot API
 */
async function getFile(fileId: string): Promise<any> {
  try {
    const response = await axios.post(
      `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/getFile`,
      { file_id: fileId },
      { timeout: 5000 }
    );
    
    if (response.data.ok) {
      return response.data.result;
    }
  } catch (error) {
    console.error(`[TelegramAvatarService] Error getting file info for ${fileId}:`, error);
  }
  
  return null;
}

/**
 * Generate a placeholder avatar URL using DiceBear service
 * This provides a consistent, unique avatar for each username
 */
export function getPlaceholderAvatar(username: string): string {
  if (!username) {
    return "https://api.dicebear.com/7.x/avataaars/svg?seed=default&scale=80";
  }

  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
  
  // Use DiceBear API to generate consistent avatars
  // This creates a unique avatar based on the username
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanUsername)}&scale=80`;
}

/**
 * Get initials from username for display
 */
export function getUserInitials(username: string): string {
  if (!username) return "?";
  
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
  const parts = cleanUsername.split(/[._-]/);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return cleanUsername.substring(0, 2).toUpperCase();
}

/**
 * Clear avatar cache (for testing or manual refresh)
 */
export function clearAvatarCache(): void {
  avatarCache.clear();
  console.log('[TelegramAvatarService] Avatar cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: avatarCache.size,
    entries: Array.from(avatarCache.keys())
  };
}
