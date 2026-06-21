import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let initAttempted = false;

function getApp(): App | null {
  if (cachedApp) return cachedApp;
  if (initAttempted) return null;

  initAttempted = true;

  const apps = getApps();
  if (apps.length > 0) {
    cachedApp = apps[0];
    return cachedApp;
  }

  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    console.warn(
      "FIREBASE_SERVICE_ACCOUNT_KEY not set — server-side Firestore unavailable.",
    );
    return null;
  }

  try {
    const serviceAccount = JSON.parse(
      Buffer.from(key, "base64").toString("utf-8"),
    );
    cachedApp = initializeApp({ credential: cert(serviceAccount) });
    return cachedApp;
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  if (cachedDb) return cachedDb;
  const app = getApp();
  if (!app) return null;
  cachedDb = getFirestore(app);
  return cachedDb;
}
