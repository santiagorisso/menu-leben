import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

// All menu data extracted from the current menu
const menuData = [
  // Para Picar
  {
    name: "PAPAS FRITAS CASERAS + DIP",
    price: "$11000.-",
    category: "Para Picar",
    available: true,
  },
  {
    name: "PAPAS FRITAS AHUMADAS PICANTES",
    price: "$11500.-",
    category: "Para Picar",
    available: true,
  },
  {
    name: "PAPAS FRITAS AL CURRY",
    price: "$13000.-",
    category: "Para Picar",
    available: true,
  },
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

  // Pizzas
  {
    name: "MUZZARELLA",
    description: "muzzarella, salsa de tomate, aceitunas verdes tostadas & albahaca",
    price: "$16000.-",
    category: "Pizzas",
    vegetarian: true,
    available: true,
  },
  {
    name: "NAPOLITANA",
    description:
      "muzzarella, salsa de tomate, rodajas de tomate, orégano fresco, aceitunas verdes tostadas, parmesano y aceite de ajo",
    price: "$16500.-",
    category: "Pizzas",
    vegetarian: true,
    available: true,
  },
  {
    name: "ESPECIAL",
    description: "muzzarella, cebolla y aceitunas negras tostadas",
    price: "$18000.-",
    category: "Pizzas",
    vegetarian: true,
    available: true,
  },
  {
    name: "CUATRO QUESOS",
    description: "muzzarella, salsa de tomate, provolone, roquefort y reggianito. orégano y aceitunas negras tostadas.",
    price: "$18000.-",
    category: "Pizzas",
    vegetarian: true,
    available: true,
  },
  {
    name: "PEPPERONI",
    description: "muzzarella, salsa de tomate, pepperoni, orégano fresco y aceite de oliva",
    price: "$19000.-",
    category: "Pizzas",
    available: true,
  },
  {
    name: "HONGOS",
    description:
      "muzzarella, salsa de tomate, mix de hongos y tomates cherry confitados. orégano y aceitunas negras tostadas.",
    price: "$19000.-",
    category: "Pizzas",
    vegetarian: true,
    available: true,
  },
  {
    name: "FUGAZZETA",
    description: "muzzarella, cebolla y aceitunas negras tostadas",
    price: "$18000.-",
    category: "Pizzas",
    vegetarian: true,
    available: true,
  },
  {
    name: "FUGA RELLENA",
    description: "fugazzeta rellena de muzzarella y jamón, con cebolla, parmesano y aceite de oliva",
    price: "$24500.-",
    category: "Pizzas",
    available: true,
  },
  {
    name: "PORCION DE FUGA RELLENA",
    description: "porción individual de fugazzeta rellena",
    price: "$3500.-",
    category: "Pizzas",
    available: true,
  },
  {
    name: "2 PORCIONES DE FUGA + AMERICAN LAGER",
    price: "$9000.-",
    category: "Pizzas",
    available: true,
  },
  {
    name: "2 PORCIONES DE FUGA + BIRRA",
    description: "cualquier cerveza a elección",
    price: "$11000.-",
    category: "Pizzas",
    available: true,
  },

  // Sandwiches
  {
    name: "FRIED CHICKEN SANDO",
    description:
      "sandwich de pollo rebozado frito en pan brioche tostado con manteca, mayonesa de wasabi, lechuga, cheddar y pepinos",
    price: "$15500.-",
    category: "Sandwich",
    available: true,
  },
  {
    name: "SHREDDED BEEF SANDWICH",
    description:
      "sandwich de roast beef desmenuzado en pan philly tostado con manteca, salsa mil islas, cheddar, sprinkle de pepino & cebolla encurtida",
    price: "$15500.-",
    category: "Sandwich",
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
  {
    name: "MOSAIC LIGHT LAGER",
    description:
      "Cerveza de fermentación lager. De cuerpo medio. Color pajizo. Espuma blanca. Carbonatación alta. Se puede percibir chispeante en el paladar. Lupulada. Se pueden detectar notas a durazno, damasco y pomelo rosado. Medalla de Oro en Copa Austral.",
    price: "$5000.-",
    category: "Cervezas",
    ibu: "20",
    abv: "4.5",
    available: true,
  },
  {
    name: "SESSION IPA",
    description:
      "Nuestra Session IPA es muyyyyyy parecida a nuestra IPA, pero con menos alcohol e igual olor y sabor a lúpulo. Una alternativa mas liviana a la IPA.",
    price: "$5000.-",
    category: "Cervezas",
    ibu: "30",
    abv: "5.0",
    available: true,
  },
  {
    name: "AMERICAN IPA",
    description:
      "De color dorado. Carbonatación media. Espuma blanca de buena retención. Se puede percibir un leve aroma a malta y bajos caramelos que balancean la alta carga de lúpulos.",
    price: "$5000.-",
    category: "Cervezas",
    ibu: "50",
    abv: "5.6",
    available: true,
  },
  {
    name: "'EL DORADO' IPA",
    description:
      "Una señora India Pale Ale. Color IPA, olor IPA, sabor IPA. Alta retencion, alta tomabilidad. Una IPA bien rockkkkkkkk! Si te gustan la IPAs, esta es tu cerveza.",
    price: "$5000.-",
    category: "Cervezas",
    ibu: "60",
    abv: "7.0",
    available: true,
  },
  {
    name: "SLANE CASTLE EXTRA STOUT",
    description:
      "Una cerveza negra irlandesa. Le pusimos Slane Castle Extra Stout en honor al recital de los Red Hot Chilli Peppers en Irlanda en el 2003. Es fuerte pero compleja, para dedicarle su tiempo.",
    price: "$5000.-",
    category: "Cervezas",
    ibu: "44",
    abv: "7.0",
    available: true,
  },
  {
    name: "BRISTOL IPA",
    price: "$3500.-",
    category: "Cervezas",
    available: true,
  },
  {
    name: "BRISTOL LAGER",
    price: "$3500.-",
    category: "Cervezas",
    available: true,
  },
  {
    name: "BRISTOL PALE ALE",
    price: "$3500.-",
    category: "Cervezas",
    available: true,
  },

  // Vinos
  {
    name: "NICASIA",
    description: "Red Blend",
    price: "$5500.-",
    category: "Vinos",
    wineType: "red",
    glassPrice: "$5500.-",
    bottlePrice: "$22000.-",
    available: true,
  },
  {
    name: "TRUMPETER",
    description: "Chardonnay",
    price: "$5500.-",
    category: "Vinos",
    wineType: "white",
    glassPrice: "$5500.-",
    bottlePrice: "$22000.-",
    available: true,
  },

  // Bebidas S/ Alcohol
  {
    name: "LIMONADA CASERA",
    description: "Limones exprimidos, syrup de miel & menta",
    price: "$4000.-",
    category: "Bebidas S/ Alcohol",
    available: true,
  },
  {
    name: "AGUA MINERAL",
    description: "con o sin gas",
    price: "$3500.-",
    category: "Bebidas S/ Alcohol",
    available: true,
  },
  {
    name: "COCA COLA",
    description: "clásica o zero",
    price: "$3500.-",
    category: "Bebidas S/ Alcohol",
    available: true,
  },
  {
    name: "SPRITE",
    description: "clásica o zero",
    price: "$3500.-",
    category: "Bebidas S/ Alcohol",
    available: true,
  },
  {
    name: "FANTA",
    price: "$3500.-",
    category: "Bebidas S/ Alcohol",
    available: true,
  },
  {
    name: "SCHWEPPES",
    description: "tónica o pomelo zero",
    price: "$3500.-",
    category: "Bebidas S/ Alcohol",
    available: true,
  },
  {
    name: "AQUARIUS",
    description: "naranja, pomelo, manzana y pera",
    price: "$3500.-",
    category: "Bebidas S/ Alcohol",
    available: true,
  },

  // Tragos
  {
    name: "VERMÚ",
    description: "Cinzano Rosso con soda & naranja",
    price: "$6000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "FERNET & COCA",
    description: "Fernet Branca, Coca Cola",
    price: "$6500.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "FERROVIARIO",
    description: "Cinzano Rosso, Fernet & soda",
    price: "$6500.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "AMERICANO",
    description: "Campari, Cinzano Rosso & soda",
    price: "$6500.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "VODKA & NARANJA",
    description: "Vodka Skyy c/ jugo de naranja",
    price: "$5000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "CAMPARI & NARANJA",
    description: "Campari & jugo de naranja",
    price: "$6000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "CAMPARI & TÓNICA",
    description: "Campari & tónica",
    price: "$6000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "CYNAR JULEP",
    description: "Cynar, limón, azucar, pomelo & menta",
    price: "$6500.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "GIN & TÓNICA",
    description: "Gin Restinga & tónica",
    price: "$8000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "GIN & TÓNICA PREMIUM",
    description: "Gin Bulldog & tónica",
    price: "$11000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "TOM COLLINS",
    description: "Gin, limón, syrup & soda",
    price: "$8000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "APEROL SPRITZ",
    description: "Aperol & prosecco",
    price: "$8000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "NEGRONI",
    description: "Gin, Vermú & Campari",
    price: "$8000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "PENICILLIN",
    description: "Jameson, Limon, Miel & Jengibre",
    price: "$10000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "MANHATTAN",
    description: "Wild Turkey 101, Angostura, Cinzano Rosso",
    price: "$10000.-",
    category: "Tragos",
    available: true,
  },
  {
    name: "OLD FASHIONED",
    description: "Wild Turkey 101, Angostura bitters, Rosemary syrup, Marraschino cherry",
    price: "$12000.-",
    category: "Tragos",
    available: true,
  },

  // Merch
  {
    name: "REMERA LEBEN BREWING CO",
    description: "Remera doodles - blanca o verde",
    price: "$20000.-",
    category: "Merch",
    available: true,
  },
]

async function populateFirestore() {
  console.log("Starting Firestore population...")

  try {
    let addedCount = 0
    let updatedCount = 0
    const skippedCount = 0

    for (const item of menuData) {
      // Check if item already exists (by name and category)
      const q = query(
        collection(db, "menuItems"),
        where("name", "==", item.name),
        where("category", "==", item.category),
      )
      const existingDocs = await getDocs(q)

      if (existingDocs.empty) {
        // Add new item
        await setDoc(doc(collection(db, "menuItems")), {
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        addedCount++
        console.log(`✓ Added: ${item.name} (${item.category})`)
      } else {
        // Update existing item (preserve availability status)
        const existingDoc = existingDocs.docs[0]
        const existingData = existingDoc.data()
        await setDoc(doc(db, "menuItems", existingDoc.id), {
          ...item,
          available: existingData.available ?? true, // Preserve existing availability
          createdAt: existingData.createdAt || new Date(),
          updatedAt: new Date(),
        })
        updatedCount++
        console.log(`↻ Updated: ${item.name} (${item.category})`)
      }
    }

    console.log("\n✅ Firestore population complete!")
    console.log(`   Added: ${addedCount} items`)
    console.log(`   Updated: ${updatedCount} items`)
    console.log(`   Total: ${menuData.length} items`)
  } catch (error) {
    console.error("❌ Error populating Firestore:", error)
    throw error
  }
}

// Run the population
populateFirestore()
  .then(() => {
    console.log("\n🎉 All done! Your menu is now in Firestore.")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Failed to populate Firestore:", error)
    process.exit(1)
  })
