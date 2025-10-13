import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore"
import type { MenuItem, Category } from "@/types/menu"

const COLLECTION_MAP: Record<string, string> = {
  "Para Picar": "snacks",
  Empanadas: "empanadas",
  Pizzas: "pizzas",
  Sandwich: "sandwiches",
  Cervezas: "beers",
  Vinos: "wines",
  "Bebidas S/ Alcohol": "non_alcoholic",
  Tragos: "cocktails",
  Merch: "merch",
}

export function getCollectionName(category: string): string {
  return COLLECTION_MAP[category] || "menuItems"
}

export async function addMenuItem(db: Firestore, item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) {
  try {
    const docRef = await addDoc(collection(db, "menuItems"), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding menu item:", error)
    throw error
  }
}

export async function updateMenuItem(
  db: Firestore,
  id: string,
  item: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>,
) {
  try {
    await updateDoc(doc(db, "menuItems", id), {
      ...item,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating menu item:", error)
    throw error
  }
}

export async function deleteMenuItem(db: Firestore, id: string) {
  try {
    await deleteDoc(doc(db, "menuItems", id))
  } catch (error) {
    console.error("Error deleting menu item:", error)
    throw error
  }
}

export function subscribeToMenuItems(db: Firestore, callback: (items: MenuItem[]) => void) {
  const q = query(collection(db, "menuItems"), orderBy("category"), orderBy("name"))

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[]
      callback(items)
    },
    (error) => {
      console.error("Error subscribing to menu items:", error)
    },
  )
}

export async function addMenuItemToCollection(
  db: Firestore,
  collectionName: string,
  item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error(`Error adding item to ${collectionName}:`, error)
    throw error
  }
}

export async function updateMenuItemInCollection(
  db: Firestore,
  collectionName: string,
  id: string,
  item: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>,
) {
  try {
    await updateDoc(doc(db, collectionName, id), {
      ...item,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error(`Error updating item in ${collectionName}:`, error)
    throw error
  }
}

export async function deleteMenuItemFromCollection(db: Firestore, collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id))
  } catch (error) {
    console.error(`Error deleting item from ${collectionName}:`, error)
    throw error
  }
}

export function subscribeToCollection(db: Firestore, collectionName: string, callback: (items: MenuItem[]) => void) {
  const q = query(collection(db, collectionName), orderBy("name"))

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[]
      callback(items)
    },
    (error) => {
      console.error(`Error subscribing to ${collectionName}:`, error)
    },
  )
}

export function subscribeToAllCollections(db: Firestore, callback: (items: Record<string, MenuItem[]>) => void) {
  const collections = Object.values(COLLECTION_MAP)
  const unsubscribers: (() => void)[] = []
  const allItems: Record<string, MenuItem[]> = {}

  collections.forEach((collectionName) => {
    const unsubscribe = subscribeToCollection(db, collectionName, (items) => {
      allItems[collectionName] = items
      callback({ ...allItems })
    })
    unsubscribers.push(unsubscribe)
  })

  return () => {
    unsubscribers.forEach((unsub) => unsub())
  }
}

export async function getCategories(db: Firestore): Promise<Category[]> {
  try {
    const q = query(collection(db, "categories"), orderBy("order"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[]
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

export async function addCategory(db: Firestore, category: Omit<Category, "id">) {
  try {
    const docRef = await addDoc(collection(db, "categories"), category)
    return docRef.id
  } catch (error) {
    console.error("Error adding category:", error)
    throw error
  }
}
