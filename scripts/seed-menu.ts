import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

const categories = [
  { name: "Para Picar", order: 1 },
  { name: "Empanadas", order: 2 },
  { name: "Pizzas", order: 3 },
  { name: "Sandwich", order: 4 },
  { name: "Cervezas", order: 5 },
  { name: "Vinos", order: 6 },
  { name: "Bebidas S/ Alcohol", order: 7 },
  { name: "Tragos", order: 8 },
  { name: "Merch", order: 9 },
]

const menuItems = [
  // Para Picar
  { name: "PAPAS FRITAS CASERAS + DIP", price: "$11000.-", category: "Para Picar", available: true },
  { name: "PAPAS FRITAS AHUMADAS PICANTES", price: "$11500.-", category: "Para Picar", available: true },
  { name: "PAPAS FRITAS AL CURRY", price: "$13000.-", category: "Para Picar", available: true },
  {
    name: "TEQUEÑOS + DIP",
    description: "(6 unidades + dip picante)",
    price: "$13500.-",
    category: "Para Picar",
    vegetarian: true,
    available: true,
  },
  {
    name: "TEQUEÑOS PICANTES + DIP",
    description: "(6 unidades picantes + dip picante)",
    price: "$14000.-",
    category: "Para Picar",
    vegetarian: true,
    available: true,
  },
  {
    name: "CHICKEN TENDERS + DIP",
    description: "(8 unidades de pollo frito c/ dip de mayo de lima)",
    price: "$12000.-",
    category: "Para Picar",
    available: true,
  },
  {
    name: "LOADED NACHOS",
    description:
      "(Nachos de maíz c/ carne braseada, jalapeños, cilantro, pico de gallo, cebolla encurtida, salsa de lima y queso crema acido)",
    price: "$12000.-",
    category: "Para Picar",
    available: true,
  },

  // Empanadas
  {
    name: "HONGOS",
    description: "portobello, champignones, puerro, verdeo y bechamel",
    price: "$4000.-",
    category: "Empanadas",
    vegetarian: true,
    available: true,
  },
  {
    name: "CUATRO QUESOS",
    description: "muzzarella, roquefort, reggianito & provolone",
    price: "$3000.-",
    category: "Empanadas",
    vegetarian: true,
    available: true,
  },
  {
    name: "CARNE",
    description: "blend de carne picada, cebolla y huevo duro",
    price: "$3000.-",
    category: "Empanadas",
    available: true,
  },
  {
    name: "JAMON Y QUESO",
    description: "jamón cocido natural y muzzarella",
    price: "$3000.-",
    category: "Empanadas",
    available: true,
  },
  {
    name: "LANGOSTINOS",
    description: "langostinos, salsa bechamel y queso",
    price: "$4000.-",
    category: "Empanadas",
    available: true,
  },

  // Cervezas
  {
    name: "AMERICAN LAGER",
    description:
      "Aroma a malta, como a galleta. Un poco floral, debido a los lúpulos nobles europeos. De espuma blanca de buena formación y encaje. Color pajizo, de cuerpo medio. Puede haber una nota a sulfuro, propia de la fermentación lager. Alta tomabilidad.",
    price: "$5000.-",
    category: "Cervezas",
    ibu: "25",
    abv: "5.0",
    available: true,
  },
  {
    name: "AMBER LAGER",
    description:
      "Cerveza color rojiza ámbar, clara. Aroma a caramelo o malta tostada. Lúpulo con leve carácter floral o especiado. Bajo amargor. Cerveza bien atenuada con terminación seca en boca. Alta tomabilidad.",
    price: "$5000.-",
    category: "Cervezas",
    ibu: "15",
    abv: "4.5",
    available: true,
  },
]

async function seedDatabase() {
  console.log("Starting database seed...")

  try {
    // Seed categories
    console.log("Seeding categories...")
    for (const category of categories) {
      await addDoc(collection(db, "categories"), category)
    }
    console.log(`✓ Added ${categories.length} categories`)

    // Seed menu items
    console.log("Seeding menu items...")
    for (const item of menuItems) {
      await addDoc(collection(db, "menuItems"), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    console.log(`✓ Added ${menuItems.length} menu items`)

    // Seed settings
    console.log("Seeding settings...")
    await addDoc(collection(db, "settings"), {
      showSoldOutOverlay: true,
      themeColor: "#ff8c00",
      updatedAt: serverTimestamp(),
    })
    console.log("✓ Added settings")

    console.log("\n✅ Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  }
}

seedDatabase()
