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
  where,
  serverTimestamp,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import type { MenuItem, Category } from "@/types/menu";

// Map human-readable category names to the keys used in the UI to keep layout intact
const CATEGORY_TO_KEY_MAP: Record<string, string> = {
  "Para Picar": "snacks",
  Empanadas: "empanadas",
  Pizzas: "pizzas",
  Sandwich: "sandwiches",
  Cervezas: "beers",
  Vinos: "wines",
  "Bebidas S/ Alcohol": "non_alcoholic",
  Tragos: "cocktails",
  Merch: "merch",
};

export function getCollectionName(category: string): string {
  return CATEGORY_TO_KEY_MAP[category] || "menu";
}

const MENU_COLLECTION = "menu";

export async function addMenuItem(
  db: Firestore,
  item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
) {
  try {
    const docRef = await addDoc(collection(db, MENU_COLLECTION), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }
}

export async function updateMenuItem(
  db: Firestore,
  id: string,
  item: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>
) {
  try {
    await updateDoc(doc(db, MENU_COLLECTION, id), {
      ...item,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
}

export async function deleteMenuItem(db: Firestore, id: string) {
  try {
    await deleteDoc(doc(db, MENU_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
}

export function subscribeToMenuItems(
  db: Firestore,
  callback: (items: MenuItem[]) => void
) {
  // Simple query that doesn't require composite indexes
  const q = query(collection(db, MENU_COLLECTION), orderBy("name"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as MenuItem[];

      // Filter hidden items and sort by order on client side
      const visibleItems = items.filter((item) => !item.hidden);
      visibleItems.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || "").localeCompare(b.name || "");
      });

      console.log("📦 Firestore items received:", visibleItems.length, "items");
      callback(visibleItems);
    },
    (error) => {
      console.error("Error subscribing to menu items:", error);
    }
  );
}

export function subscribeToAllCollections(
  db: Firestore,
  callback: (items: Record<string, MenuItem[]>) => void
) {
  // Keep the same API but source from the single `menu` collection and group by category key
  return subscribeToMenuItems(db, (items) => {
    const grouped: Record<string, MenuItem[]> = {};
    for (const item of items) {
      const key = getCollectionName(item.category);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }
    // Sort by order field within each category, respecting Firestore order
    for (const key of Object.keys(grouped)) {
      grouped[key] = grouped[key].slice().sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || "").localeCompare(b.name || "");
      });
    }
    callback(grouped);
  });
}

export async function getCategories(db: Firestore): Promise<Category[]> {
  try {
    const q = query(collection(db, "categories"), orderBy("order"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
}

export async function addCategory(
  db: Firestore,
  category: Omit<Category, "id">
) {
  try {
    const docRef = await addDoc(collection(db, "categories"), category);
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}

export async function updateCategory(
  db: Firestore,
  id: string,
  category: Partial<Omit<Category, "id">>
) {
  try {
    await updateDoc(doc(db, "categories", id), {
      ...category,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(db: Firestore, id: string) {
  try {
    await deleteDoc(doc(db, "categories", id));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

export function subscribeToCategories(
  db: Firestore,
  callback: (categories: Category[]) => void
) {
  const q = query(collection(db, "categories"), orderBy("order"));

  return onSnapshot(
    q,
    (snapshot) => {
      const categories = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Category[];
      callback(categories);
    },
    (error) => {
      console.error("Error subscribing to categories:", error);
    }
  );
}

export async function bulkUpdateMenuItems(
  db: Firestore,
  updates: Array<{ id: string; order: number }>
) {
  try {
    const batch = writeBatch(db);

    updates.forEach(({ id, order }) => {
      const docRef = doc(db, MENU_COLLECTION, id);
      batch.update(docRef, {
        order,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`✅ Updated order for ${updates.length} menu items`);
  } catch (error) {
    console.error("Error bulk updating menu items:", error);
    throw error;
  }
}

export async function bulkUpdateCategories(
  db: Firestore,
  updates: Array<{ id: string; order: number }>
) {
  try {
    const batch = writeBatch(db);
    let validUpdates = 0;

    // Only update documents that actually exist in Firestore
    for (const { id, order } of updates) {
      // Skip fallback category IDs that don't exist in Firestore
      if (id.startsWith("category-")) {
        console.warn(
          `Skipping fallback category ID ${id} - not a real Firestore document`
        );
        continue;
      }

      const docRef = doc(db, "categories", id);
      batch.update(docRef, {
        order,
        updatedAt: serverTimestamp(),
      });
      validUpdates++;
    }

    if (validUpdates > 0) {
      await batch.commit();
      console.log(`✅ Updated order for ${validUpdates} categories`);
    } else {
      console.log("No valid category updates to process");
    }
  } catch (error) {
    console.error("Error bulk updating categories:", error);
    throw error;
  }
}
