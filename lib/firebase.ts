import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isFirebaseConfigured = () => {
  const configured = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  )

  if (!configured && typeof window !== "undefined") {
    console.info("[v0] Firebase environment variables not set. Running in static mode.")
  }

  return configured
}

let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined

// Only initialize on client side and if configured
if (typeof window !== "undefined" && isFirebaseConfigured()) {
  try {
    // Initialize Firebase app
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

    try {
      db = getFirestore(app)
    } catch (firestoreError: any) {
      // Firestore not enabled in Firebase Console - this is expected
      if (firestoreError?.message?.includes("firestore")) {
        console.info("[v0] Firestore not enabled. Enable it in Firebase Console to use admin features.")
      }
      db = undefined
    }

    try {
      auth = getAuth(app)
    } catch (authError: any) {
      // Auth not enabled in Firebase Console - this is expected
      if (authError?.message?.includes("auth")) {
        console.info("[v0] Firebase Auth not enabled. Enable it in Firebase Console to use admin features.")
      }
      auth = undefined
    }

    if (db && auth) {
      console.log("[v0] Firebase initialized successfully with Firestore and Auth")
    } else if (db) {
      console.log("[v0] Firebase initialized with Firestore only")
    } else if (auth) {
      console.log("[v0] Firebase initialized with Auth only")
    } else {
      console.info("[v0] Firebase app initialized but services not available. Running in static mode.")
    }
  } catch (error: any) {
    // Only log as info, not error, since this is expected when Firebase is not fully configured
    console.info("[v0] Firebase not fully configured. Running in static mode.", error?.message || "")
    app = undefined
    db = undefined
    auth = undefined
  }
}

export { app, db, auth, isFirebaseConfigured }
