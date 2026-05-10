import { loadTripsFromGoogleDrive } from "./googleDriveService";
import { trackAndNotifyChanges } from "./changeTracker";
import { getAllTrips, clearAllTripsAndParticipants, upsertTrip, upsertParticipant } from "./db";

const SYNC_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
let lastSyncTime = 0;

/**
 * Get trips from database
 */
export async function getCachedTrips() {
  try {
    return await getAllTrips();
  } catch (error) {
    console.error("[Cache] Error getting trips from database:", error);
    throw error;
  }
}

/**
 * Manually refresh the cache - sync with Google Drive and save to database
 */
export async function refreshCache() {
  try {
    console.log("[Cache] Refreshing cache from Google Drive");
    const trips = await loadTripsFromGoogleDrive();
    
    // Clear old data and save new data to database
    await clearAllTripsAndParticipants();
    
    for (const trip of trips) {
      // Save trip to database
      await upsertTrip({
        title: trip.title,
        date: trip.date,
        participantCount: trip.participants,
        lastSyncedAt: new Date(),
      });
      
      // Save participants to database
      if (trip.participantsList && trip.participantsList.length > 0) {
        // Get the trip ID from database (assuming it was just inserted)
        const allTrips = await getAllTrips();
        const savedTrip = allTrips.find(t => t.title === trip.title && t.date === trip.date);
        
        if (savedTrip) {
          for (const participant of trip.participantsList) {
            await upsertParticipant({
              tripId: savedTrip.id,
              name: participant.name,
              paymentStatus: participant.paymentStatus,
              program: participant.program,
              harness: participant.harness,
              wing: participant.wing,
              helmet: participant.helmet,
              telegramNick: participant.telegramNick,
            });
          }
        }
      }
    }
    
    lastSyncTime = Date.now();
    console.log(`[Cache] Cache updated at ${new Date(lastSyncTime).toISOString()}`);
    
    // Track changes and send notifications
    await trackAndNotifyChanges(trips);
    
    return trips;
  } catch (error) {
    console.error("[Cache] Error refreshing cache:", error);
    throw error;
  }
}

/**
 * Initialize scheduled sync every 4 hours
 */
export function initializeScheduledSync() {
  // Perform initial sync on startup
  refreshCache().catch(error => {
    console.error("[Scheduler] Error during initial sync:", error);
  });
  
  // Schedule periodic sync every 4 hours
  setInterval(() => {
    console.log(`[Scheduler] Executing scheduled sync at ${new Date().toISOString()}`);
    refreshCache().catch(error => {
      console.error("[Scheduler] Error during scheduled sync:", error);
    });
  }, SYNC_INTERVAL);
  
  console.log("[Scheduler] Scheduled sync initialized - syncing every 4 hours");
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  try {
    const trips = await getAllTrips();
    return {
      tripsCount: trips.length,
      lastUpdated: lastSyncTime ? new Date(lastSyncTime).toISOString() : "Never",
      isFresh: Date.now() - lastSyncTime < SYNC_INTERVAL,
    };
  } catch (error) {
    console.error("[Cache] Error getting cache stats:", error);
    return {
      tripsCount: 0,
      lastUpdated: "Error",
      isFresh: false,
    };
  }
}
