import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, trips, participants, InsertTrip, InsertParticipant, Trip, Participant } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Trips queries
export async function getAllTrips(): Promise<Trip[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get trips: database not available");
    return [];
  }

  try {
    return await db.select().from(trips);
  } catch (error) {
    console.error("[Database] Failed to get trips:", error);
    return [];
  }
}

export async function getTripWithParticipants(tripId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get trip: database not available");
    return null;
  }

  try {
    const trip = await db.select().from(trips).where(eq(trips.id, tripId)).limit(1);
    if (trip.length === 0) return null;

    const tripParticipants = await db.select().from(participants).where(eq(participants.tripId, tripId));
    return {
      ...trip[0],
      participantsList: tripParticipants,
    };
  } catch (error) {
    console.error("[Database] Failed to get trip with participants:", error);
    return null;
  }
}

export async function upsertTrip(trip: InsertTrip): Promise<Trip | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert trip: database not available");
    return null;
  }

  try {
    await db.insert(trips).values(trip).onDuplicateKeyUpdate({
      set: {
        title: trip.title,
        date: trip.date,
        participantCount: trip.participantCount,
        lastSyncedAt: new Date(),
      },
    });
    return trip as Trip;
  } catch (error) {
    console.error("[Database] Failed to upsert trip:", error);
    return null;
  }
}

export async function deleteTrip(tripId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete trip: database not available");
    return false;
  }

  try {
    // Delete participants first
    await db.delete(participants).where(eq(participants.tripId, tripId));
    // Then delete trip
    await db.delete(trips).where(eq(trips.id, tripId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete trip:", error);
    return false;
  }
}

// Participants queries
export async function getParticipantsByTrip(tripId: number): Promise<Participant[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get participants: database not available");
    return [];
  }

  try {
    return await db.select().from(participants).where(eq(participants.tripId, tripId));
  } catch (error) {
    console.error("[Database] Failed to get participants:", error);
    return [];
  }
}

export async function upsertParticipant(participant: InsertParticipant): Promise<Participant | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert participant: database not available");
    return null;
  }

  try {
    await db.insert(participants).values(participant).onDuplicateKeyUpdate({
      set: {
        paymentStatus: participant.paymentStatus,
      },
    });
    return participant as Participant;
  } catch (error) {
    console.error("[Database] Failed to upsert participant:", error);
    return null;
  }
}

export async function deleteParticipant(participantId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete participant: database not available");
    return false;
  }

  try {
    await db.delete(participants).where(eq(participants.id, participantId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete participant:", error);
    return false;
  }
}

export async function clearAllTripsAndParticipants(): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot clear data: database not available");
    return false;
  }

  try {
    await db.delete(participants);
    await db.delete(trips);
    return true;
  } catch (error) {
    console.error("[Database] Failed to clear data:", error);
    return false;
  }
}
