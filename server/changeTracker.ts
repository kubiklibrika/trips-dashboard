import {
  notifyNewTrip,
  notifyAddedParticipant,
  notifyRemovedParticipant,
  notifyPaymentStatusChange,
} from "./telegramService";

interface Participant {
  name: string;
  paymentStatus: string;
}

interface Trip {
  id: number;
  title: string;
  date: string;
  participants: number;
  participantsList: Participant[];
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
 * Compare two participant lists and detect changes
 */
interface ParticipantChange {
  added: Participant[];
  removed: Participant[];
  paymentStatusChanged: Array<{
    name: string;
    oldStatus: string;
    newStatus: string;
  }>;
}

function detectParticipantChanges(
  previousParticipants: Participant[],
  currentParticipants: Participant[]
): ParticipantChange {
  const added: Participant[] = [];
  const removed: Participant[] = [];
  const paymentStatusChanged: Array<{
    name: string;
    oldStatus: string;
    newStatus: string;
  }> = [];

  // Find added participants
  for (const current of currentParticipants) {
    const previous = previousParticipants.find(p => p.name === current.name);
    if (!previous) {
      added.push(current);
    } else if (previous.paymentStatus !== current.paymentStatus) {
      // Payment status changed
      paymentStatusChanged.push({
        name: current.name,
        oldStatus: previous.paymentStatus,
        newStatus: current.paymentStatus,
      });
    }
  }

  // Find removed participants
  for (const previous of previousParticipants) {
    const current = currentParticipants.find(p => p.name === previous.name);
    if (!current) {
      removed.push(previous);
    }
  }

  return { added, removed, paymentStatusChanged };
}

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

    // Notify about new trips
    for (const trip of newTrips) {
      console.log(`[ChangeTracker] Found new trip: "${trip.title}"`);
      await notifyNewTrip(trip.title, trip.date, trip.participants);
    }

    // Find changes in existing trips
    for (const currentTrip of currentTrips) {
      const previousTrip = previousState.trips.find(
        t => t.title === currentTrip.title && t.date === currentTrip.date
      );

      if (previousTrip) {
        const changes = detectParticipantChanges(
          previousTrip.participantsList,
          currentTrip.participantsList
        );

        // Notify about added participants (one message per participant)
        for (const participant of changes.added) {
          console.log(
            `[ChangeTracker] Added participant "${participant.name}" to "${currentTrip.title}"`
          );
          await notifyAddedParticipant(
            `${currentTrip.title} (${currentTrip.date})`,
            participant.name,
            participant.paymentStatus
          );
        }

        // Notify about removed participants (one message per participant)
        for (const participant of changes.removed) {
          console.log(
            `[ChangeTracker] Removed participant "${participant.name}" from "${currentTrip.title}"`
          );
          await notifyRemovedParticipant(`${currentTrip.title} (${currentTrip.date})`, participant.name);
        }

        // Notify about payment status changes (one message per change)
        for (const change of changes.paymentStatusChanged) {
          console.log(
            `[ChangeTracker] Payment status changed for "${change.name}" in "${currentTrip.title}": ${change.oldStatus} -> ${change.newStatus}`
          );
          await notifyPaymentStatusChange(
            `${currentTrip.title} (${currentTrip.date})`,
            change.name,
            change.oldStatus,
            change.newStatus
          );
        }
      }
    }

    // Update previous state
    previousState = {
      trips: currentTrips,
      lastChecked: Date.now(),
    };

    console.log(
      `[ChangeTracker] State updated. Current trips: ${currentTrips.length}`
    );
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
