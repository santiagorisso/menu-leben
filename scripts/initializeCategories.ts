import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Firebase configuration - you'll need to add your config here
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const MENU_CATEGORIES = [
  "Para Picar",
  "Empanadas",
  "Pizzas",
  "Sandwich",
  "Cervezas",
  "Vinos",
  "Bebidas S/ Alcohol",
  "Tragos",
  "Merch",
];

async function initializeCategories() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Check if categories already exist
    const existingCategories = await getDocs(collection(db, "categories"));

    if (existingCategories.size > 0) {
      console.log("Categories already exist, skipping initialization");
      return;
    }

    // Add categories with order
    for (let i = 0; i < MENU_CATEGORIES.length; i++) {
      await addDoc(collection(db, "categories"), {
        name: MENU_CATEGORIES[i],
        order: i,
        createdAt: new Date(),
      });
      console.log(`Added category: ${MENU_CATEGORIES[i]}`);
    }

    console.log("✅ Categories initialized successfully");
  } catch (error) {
    console.error("Error initializing categories:", error);
  }
}

// Run the script
initializeCategories();
