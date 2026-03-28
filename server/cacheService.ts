import { loadTripsFromGoogleDrive } from "./googleDriveService";
import { trackAndNotifyChanges } from "./changeTracker";

interface CacheData {
  trips: any[];
  lastUpdated: number;
}

let cache: CacheData = {
  trips: [],
  lastUpdated: 0,
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Get cached trips data
 * Returns cached data if available, otherwise loads from Google Drive
 */
export async function getCachedTrips() {
  const now = Date.now();
  
  // If cache is fresh, return it
  if (cache.trips.length > 0 && now - cache.lastUpdated < CACHE_DURATION) {
    console.log("[Cache] Returning cached trips data");
    return cache.trips;
  }
  
  // Otherwise, load from Google Drive and update cache
  console.log("[Cache] Cache expired or empty, loading from Google Drive");
  return await refreshCache();
}

/**
 * Manually refresh the cache
 */
export async function refreshCache() {
  try {
    console.log("[Cache] Refreshing cache from Google Drive");
    const trips = await loadTripsFromGoogleDrive();
    cache = {
      trips,
      lastUpdated: Date.now(),
    };
    console.log(`[Cache] Cache updated at ${new Date(cache.lastUpdated).toISOString()}`);
    
    // Track changes and send notifications
    await trackAndNotifyChanges(trips);
    
    return trips;
  } catch (error) {
    console.error("[Cache] Error refreshing cache:", error);
    // Return stale cache if available
    if (cache.trips.length > 0) {
      console.log("[Cache] Returning stale cache due to error");
      return cache.trips;
    }
    throw error;
  }
}

/**
 * Initialize scheduled sync at specific times: 8:00, 12:00, 16:00, 20:00 UTC
 */
export function initializeScheduledSync() {
  const syncTimes = [8, 12, 16, 20]; // Hours in UTC
  
  function scheduleNextSync() {
    const now = new Date();
    const currentHourUTC = now.getUTCHours();
    const currentMinutesUTC = now.getUTCMinutes();
    const currentSecondsUTC = now.getUTCSeconds();
    
    // Find the next sync time
    let nextSyncHour = syncTimes.find(h => h > currentHourUTC);
    let nextSyncDate: Date;
    
    if (nextSyncHour !== undefined) {
      // Sync time is today
      nextSyncDate = new Date();
      nextSyncDate.setUTCHours(nextSyncHour, 0, 0, 0);
    } else {
      // Sync time is tomorrow
      nextSyncDate = new Date();
      nextSyncDate.setUTCDate(nextSyncDate.getUTCDate() + 1);
      nextSyncDate.setUTCHours(syncTimes[0], 0, 0, 0);
    }
    
    const timeUntilSync = nextSyncDate.getTime() - now.getTime();
    
    console.log(`[Scheduler] Next sync scheduled for ${nextSyncDate.toISOString()} (in ${Math.round(timeUntilSync / 1000 / 60)} minutes)`);
    
    setTimeout(() => {
      console.log(`[Scheduler] Executing scheduled sync at ${new Date().toISOString()}`);
      refreshCache().catch(error => {
        console.error("[Scheduler] Error during scheduled sync:", error);
      });
      
      // Schedule the next sync
      scheduleNextSync();
    }, timeUntilSync);
  }
  
  // Start scheduling
  scheduleNextSync();
  console.log("[Scheduler] Scheduled sync initialized with times: 8:00, 12:00, 16:00, 20:00 UTC");
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    tripsCount: cache.trips.length,
    lastUpdated: cache.lastUpdated ? new Date(cache.lastUpdated).toISOString() : "Never",
    isFresh: Date.now() - cache.lastUpdated < CACHE_DURATION,
  };
}
