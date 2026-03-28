import { notifyNewTrip, notifyNewParticipants } from "./telegramService";

interface Trip {
  id: number;
  title: string;
  date: string;
  participants: number;
  participantsList: Array<{ name: string; paymentStatus: string }>;
}

interface TrackedState {
  trips: Trip[];
  lastChecked: number;
}

let previousState: TrackedState = {
  trips: [],
  lastChecked: Date.now(),
};

/**
 * Compare two trip lists and detect changes
 */
export async function trackAndNotifyChanges(currentTrips: Trip[]): Promise<void> {
  try {
    // Find new trips
    const newTrips = currentTrips.filter(
      currentTrip =>
        !previousState.trips.some(
          prevTrip =>
            prevTrip.title === currentTrip.title &&
            prevTrip.date === currentTrip.date
        )
    );

    // Find new participants in existing trips
    for (const currentTrip of currentTrips) {
      const previousTrip = previousState.trips.find(
        t => t.title === currentTrip.title && t.date === currentTrip.date
      );

      if (previousTrip) {
        const newParticipants = currentTrip.participantsList.filter(
          currentParticipant =>
            !previousTrip.participantsList.some(
              prevParticipant => prevParticipant.name === currentParticipant.name
            )
        );

        if (newParticipants.length > 0) {
          console.log(
            `[ChangeTracker] Found ${newParticipants.length} new participants in "${currentTrip.title}"`
          );
          await notifyNewParticipants(currentTrip.title, newParticipants);
        }
      }
    }

    // Notify about new trips
    for (const trip of newTrips) {
      console.log(`[ChangeTracker] Found new trip: "${trip.title}"`);
      await notifyNewTrip(trip.title, trip.date, trip.participants);
    }

    // Update previous state
    previousState = {
      trips: currentTrips,
      lastChecked: Date.now(),
    };

    if (newTrips.length > 0 || newTrips.length === 0) {
      console.log(
        `[ChangeTracker] State updated. Current trips: ${currentTrips.length}`
      );
    }
  } catch (error) {
    console.error("[ChangeTracker] Error tracking changes:", error);
  }
}

/**
 * Get current tracked state
 */
export function getTrackedState(): TrackedState {
  return previousState;
}

/**
 * Reset tracked state (for testing)
 */
export function resetTrackedState(): void {
  previousState = {
    trips: [],
    lastChecked: Date.now(),
  };
  console.log("[ChangeTracker] State reset");
}
