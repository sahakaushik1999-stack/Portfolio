import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

let isQuotaExceededGlobal = false;

export function getFirestoreQuotaExceeded(): boolean {
  return isQuotaExceededGlobal;
}

export function setFirestoreQuotaExceeded(val: boolean): void {
  isQuotaExceededGlobal = val;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path,
  };

  const lower = errMessage.toLowerCase();
  const isQuota =
    lower.includes('quota') ||
    lower.includes('resource-exhausted') ||
    lower.includes('free daily read units');
  const isOffline =
    lower.includes('offline') ||
    lower.includes('unavailable') ||
    lower.includes('the client is offline');

  if (isQuota || isOffline) {
    if (isQuota) isQuotaExceededGlobal = true;
    console.warn(`Firestore ${isQuota ? 'Quota Limit Exceeded' : 'Offline'} on ${path}:`, errMessage);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('firestore_quota_status', {
          detail: {
            isQuotaExceeded: isQuota,
            isOffline,
            error: errMessage,
            projectId: firebaseConfig.projectId,
            databaseId: firebaseConfig.firestoreDatabaseId,
            upgradeUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data?openUpgradeDialog=true`,
          },
        })
      );
    }
    // Return gracefully without throwing fatal uncaught exceptions
    return;
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Startup connection verification
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const lower = msg.toLowerCase();
    if (lower.includes('the client is offline') || lower.includes('quota') || lower.includes('resource-exhausted')) {
      console.warn('Firebase Firestore client is offline or quota reached, using local cache.');
      if (lower.includes('quota') || lower.includes('resource-exhausted')) {
        isQuotaExceededGlobal = true;
      }
      return false;
    }
    // Expected on initial run if test doc doesn't exist yet, but connection was made
    return true;
  }
}

// Run connection test on module evaluation
if (typeof window !== 'undefined') {
  testConnection().catch((err) => console.warn('Firestore initial check:', err));
}
