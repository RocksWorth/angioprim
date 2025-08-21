import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Lazy initializer to avoid running at build time
let firebaseApp: App | null = null;
let firestoreDb: Firestore | null = null;

export function getDb(): Firestore {
  if (firestoreDb) return firestoreDb;

  if (!firebaseApp) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase configuration is missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
    }

    firebaseApp = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
          projectId,
        });
  }

  firestoreDb = getFirestore(firebaseApp);
  return firestoreDb;
}

// Types
export interface Order {
  id: string;
  payment_status: string;
  email: string;
  phone?: string;
  shipping: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  items: Array<{
    name: string;
    quantity: number;
    amount_total: number;
  }>;
  amount_total: number;
  shipping_cost: number;
  createdAt: Date;
}
