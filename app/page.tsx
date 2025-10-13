"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { subscribeToAllCollections } from "@/lib/firestore"
import MenuItem from "@/components/MenuItem"
import BeerItem from "@/components/BeerItem"
import WineItem from "@/components/WineItem"
import BackToTop from "@/components/BackToTop"
import type { MenuItem as MenuItemType } from "@/types/menu"

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<Record<string, MenuItemType[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      return
    }

    try {
      const unsubscribe = subscribeToAllCollections(db, (items) => {
        setMenuItems(items)
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.warn("[v0] Could not set up Firestore listeners:", error)
      setLoading(false)
    }
  }, [])

  const getItemAvailability = (name: string, collectionName: string): boolean => {
    if (!menuItems[collectionName] || menuItems[collectionName].length === 0) return true
    const item = menuItems[collectionName].find((item) => item.name === name)
    return item?.available !== false
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Cargando menú...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="py-8 flex justify-center border-b border-border">
        <Image src="/images/logo.jpg" alt="Leben Brewing Company" width={400} height={120} className="w-auto h-52" />
      </div>

      <nav className="bg-background border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => scrollToSection("cervezas")}
              className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors"
            >
              CERVEZAS
            </button>
            <button
              onClick={() => scrollToSection("pizzas")}
              className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors"
            >
              PIZZAS
            </button>
            <button
              onClick={() => scrollToSection("para-picar")}
              className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors"
            >
              PARA PICAR
            </button>
            <button
              onClick={() => scrollToSection("empanadas")}
              className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors"
            >
              EMPANADAS
            </button>
            <button
              onClick={() => scrollToSection("tragos")}
              className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors"
            >
              TRAGOS
            </button>
            <button
              onClick={() => scrollToSection("sandwichs")}
              className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors"
            >
              SANDWICHS
            </button>
            <button
              onClick={() => scrollToSection("vinos")}
              className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors"
            >
              VINOS
            </button>
            <button
              onClick={() => scrollToSection("bebidas")}
              className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors"
            >
              BEBIDAS SIN ALCOHOL
            </button>
          </div>
          <div className="flex justify-center mt-6">
            <div className="animate-bounce">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Para Picar Section */}
        <section id="para-picar" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">PARA PICAR</h2>
          <p className="text-sm text-muted-foreground mb-8 text-center italic">- pedilas con tu dip preferido -</p>

          <div className="space-y-6">
            <MenuItem
              name="PAPAS FRITAS CASERAS + DIP"
              price="$11000.-"
              available={getItemAvailability("PAPAS FRITAS CASERAS + DIP", "snacks")}
            />
            <MenuItem
              name="PAPAS FRITAS AHUMADAS PICANTES"
              price="$11500.-"
              available={getItemAvailability("PAPAS FRITAS AHUMADAS PICANTES", "snacks")}
            />
            <MenuItem
              name="PAPAS FRITAS AL CURRY"
              price="$13000.-"
              available={getItemAvailability("PAPAS FRITAS AL CURRY", "snacks")}
            />
            <MenuItem
              name="TEQUEÑOS + DIP"
              description="(6 unidades + dip picante)"
              price="$13500.-"
              vegetarian
              available={getItemAvailability("TEQUEÑOS + DIP", "snacks")}
            />
            <MenuItem
              name="TEQUEÑOS PICANTES + DIP"
              description="(6 unidades picantes + dip picante)"
              price="$14000.-"
              vegetarian
              available={getItemAvailability("TEQUEÑOS PICANTES + DIP", "snacks")}
            />
            <MenuItem
              name="CHICKEN TENDERS + DIP"
              description="(8 unidades de pollo frito c/ dip de mayo de lima)"
              price="$12000.-"
              available={getItemAvailability("CHICKEN TENDERS + DIP", "snacks")}
            />
            <MenuItem
              name="LOADED NACHOS"
              description="(Nachos de maíz c/ carne braseada, jalapeños, cilantro, pico de gallo, cebolla encurtida, salsa de lima y queso crema acido)"
              price="$12000.-"
              available={getItemAvailability("LOADED NACHOS", "snacks")}
            />
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Empanadas Section */}
        <section id="empanadas" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">EMPANADAS</h2>
          <div className="text-sm text-muted-foreground mb-8 space-y-1">
            <p className="text-center italic">- promo 3 empanadas + american lager - $11000</p>
            <p className="text-center italic">- promo 3 empanadas + birra - $12500</p>
          </div>

          <div className="space-y-6">
            <MenuItem
              name="HONGOS"
              description="portobello, champignones, puerro, verdeo y bechamel"
              price="$4000.-"
              vegetarian
              available={getItemAvailability("HONGOS", "empanadas")}
            />
            <MenuItem
              name="CUATRO QUESOS"
              description="muzzarella, roquefort, reggianito & provolone"
              price="$3000.-"
              vegetarian
              available={getItemAvailability("CUATRO QUESOS", "empanadas")}
            />
            <MenuItem
              name="CARNE"
              description="blend de carne picada, cebolla y huevo duro"
              price="$3000.-"
              available={getItemAvailability("CARNE", "empanadas")}
            />
            <MenuItem
              name="JAMON Y QUESO"
              description="jamón cocido natural y muzzarella"
              price="$3000.-"
              available={getItemAvailability("JAMON Y QUESO", "empanadas")}
            />
            <MenuItem
              name="LANGOSTINOS"
              description="langostinos, salsa bechamel y queso"
              price="$4000.-"
              available={getItemAvailability("LANGOSTINOS", "empanadas")}
            />
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Pizzas Section */}
        <section id="pizzas" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">PIZZAS</h2>
          <p className="text-sm text-muted-foreground mb-8 italic text-center">- a la piedra -</p>

          <div className="space-y-6">
            <MenuItem
              name="MUZZARELLA"
              description="muzzarella, salsa de tomate, aceitunas verdes tostadas & albahaca"
              price="$16000.-"
              vegetarian
              available={getItemAvailability("MUZZARELLA", "pizzas")}
            />
            <MenuItem
              name="NAPOLITANA"
              description="muzzarella, salsa de tomate, rodajas de tomate, orégano fresco, aceitunas verdes tostadas, parmesano y aceite de ajo"
              price="$16500.-"
              vegetarian
              available={getItemAvailability("NAPOLITANA", "pizzas")}
            />
            <MenuItem
              name="ESPECIAL"
              description="muzzarella, cebolla y aceitunas negras tostadas"
              price="$18000.-"
              vegetarian
              available={getItemAvailability("ESPECIAL", "pizzas")}
            />
            <MenuItem
              name="CUATRO QUESOS"
              description="muzzarella, salsa de tomate, provolone, roquefort y reggianito. orégano y aceitunas negras tostadas."
              price="$18000.-"
              vegetarian
              available={getItemAvailability("CUATRO QUESOS", "pizzas")}
            />
            <MenuItem
              name="PEPPERONI"
              description="muzzarella, salsa de tomate, pepperoni, orégano fresco y aceite de oliva"
              price="$19000.-"
              available={getItemAvailability("PEPPERONI", "pizzas")}
            />
            <MenuItem
              name="HONGOS"
              description="muzzarella, salsa de tomate, mix de hongos y tomates cherry confitados. orégano y aceitunas negras tostadas."
              price="$19000.-"
              vegetarian
              available={getItemAvailability("HONGOS", "pizzas")}
            />
            <MenuItem
              name="FUGAZZETA"
              description="muzzarella, cebolla y aceitunas negras tostadas"
              price="$18000.-"
              vegetarian
              available={getItemAvailability("FUGAZZETA", "pizzas")}
            />

            <div className="mt-8 p-6 border-border border rounded-2xl">
              <h3 className="font-bold text-center text-2xl mb-0">{"DE MOLDE"}</h3>
              <h3 className="font-bold mb-3 text-center text-xs leading-7">{"- SOLO LOS DOMINGOS -"}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic text-center">
                muzzarella, salsa de tomate, jamón cocido natural, orégano fresco, morrón rojo, amarillo y verde y
                aceitunas verdes tostadas
              </p>
            </div>
            <MenuItem
              name="FUGA RELLENA"
              description="fugazzeta rellena de muzzarella y jamón, con cebolla, parmesano y aceite de oliva"
              price="$24500.-"
              available={getItemAvailability("FUGA RELLENA", "pizzas")}
            />
            <MenuItem
              name="PORCION DE FUGA RELLENA"
              description="porción individual de fugazzeta rellena"
              price="$3500.-"
              available={getItemAvailability("PORCION DE FUGA RELLENA", "pizzas")}
            />
            <MenuItem
              name="2 PORCIONES DE FUGA + AMERICAN LAGER"
              price="$9000.-"
              available={getItemAvailability("2 PORCIONES DE FUGA + AMERICAN LAGER", "pizzas")}
            />
            <MenuItem
              name="2 PORCIONES DE FUGA + BIRRA"
              description="cualquier cerveza a elección"
              price="$11000.-"
              available={getItemAvailability("2 PORCIONES DE FUGA + BIRRA", "pizzas")}
            />
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        <section id="sandwichs" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">SANDWICH</h2>
          <p className="text-sm text-muted-foreground mb-8 text-center italic">- con side de papas fritas -</p>

          <div className="space-y-6">
            <MenuItem
              name="FRIED CHICKEN SANDO"
              description="sandwich de pollo rebozado frito en pan brioche tostado con manteca, mayonesa de wasabi, lechuga, cheddar y pepinos"
              price="$15500.-"
              available={getItemAvailability("FRIED CHICKEN SANDO", "sandwiches")}
            />
            <MenuItem
              name="SHREDDED BEEF SANDWICH"
              description="sandwich de roast beef desmenuzado en pan philly tostado con manteca, salsa mil islas, cheddar, sprinkle de pepino & cebolla encurtida"
              price="$15500.-"
              available={getItemAvailability("SHREDDED BEEF SANDWICH", "sandwiches")}
            />
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Cervezas Section */}
        <section id="cervezas" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">CERVEZAS</h2>

          <div className="space-y-8">
            <BeerItem
              name="AMERICAN LAGER"
              ibu="25"
              abv="5.0"
              description="Aroma a malta, como a galleta. Un poco floral, debido a los lúpulos nobles europeos. De espuma blanca de buena formación y encaje. Color pajizo, de cuerpo medio. Puede haber una nota a sulfuro, propia de la fermentación lager. Alta tomabilidad."
              price="$5000.-"
              available={getItemAvailability("AMERICAN LAGER", "beers")}
            />
            <BeerItem
              name="AMBER LAGER"
              ibu="15"
              abv="4.5"
              description="Cerveza color rojiza ámbar, clara. Aroma a caramelo o malta tostada. Lúpulo con leve carácter floral o especiado. Bajo amargor. Cerveza bien atenuada con terminación seca en boca. Alta tomabilidad."
              price="$5000.-"
              available={getItemAvailability("AMBER LAGER", "beers")}
            />
            <BeerItem
              name="MOSAIC LIGHT LAGER"
              ibu="20"
              abv="4.5"
              description="Cerveza de fermentación lager. De cuerpo medio. Color pajizo. Espuma blanca. Carbonatación alta. Se puede percibir chispeante en el paladar. Lupulada. Se pueden detectar notas a durazno, damasco y pomelo rosado. Medalla de Oro en Copa Austral."
              price="$5000.-"
              available={getItemAvailability("MOSAIC LIGHT LAGER", "beers")}
            />
            <BeerItem
              name="SESSION IPA"
              ibu="30"
              abv="5.0"
              description="Nuestra Session IPA es muyyyyyy parecida a nuestra IPA, pero con menos alcohol e igual olor y sabor a lúpulo. Una alternativa mas liviana a la IPA."
              price="$5000.-"
              available={getItemAvailability("SESSION IPA", "beers")}
            />
            <BeerItem
              name="AMERICAN IPA"
              ibu="50"
              abv="5.6"
              description="De color dorado. Carbonatación media. Espuma blanca de buena retención. Se puede percibir un leve aroma a malta y bajos caramelos que balancean la alta carga de lúpulos."
              price="$5000.-"
              available={getItemAvailability("AMERICAN IPA", "beers")}
            />
            <BeerItem
              name="'EL DORADO' IPA"
              ibu="60"
              abv="7.0"
              description="Una señora India Pale Ale. Color IPA, olor IPA, sabor IPA. Alta retencion, alta tomabilidad. Una IPA bien rockkkkkkkk! Si te gustan la IPAs, esta es tu cerveza."
              price="$5000.-"
              available={getItemAvailability("'EL DORADO' IPA", "beers")}
            />
            <BeerItem
              name="SLANE CASTLE EXTRA STOUT"
              ibu="44"
              abv="7.0"
              description="Una cerveza negra irlandesa. Le pusimos Slane Castle Extra Stout en honor al recital de los Red Hot Chilli Peppers en Irlanda en el 2003. Es fuerte pero compleja, para dedicarle su tiempo."
              price="$5000.-"
              available={getItemAvailability("SLANE CASTLE EXTRA STOUT", "beers")}
            />
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 text-center">LATAS</h3>
            <div className="space-y-4">
              <MenuItem name="BRISTOL IPA" price="$3500.-" available={getItemAvailability("BRISTOL IPA", "beers")} />
              <MenuItem
                name="BRISTOL LAGER"
                price="$3500.-"
                available={getItemAvailability("BRISTOL LAGER", "beers")}
              />
              <MenuItem
                name="BRISTOL PALE ALE"
                price="$3500.-"
                available={getItemAvailability("BRISTOL PALE ALE", "beers")}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        <section id="vinos" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">VINOS</h2>

          <div className="space-y-8">
            <WineItem
              name="NICASIA"
              style="Red Blend"
              wineType="red"
              glassPrice="$5500.-"
              bottlePrice="$22000.-"
              available={getItemAvailability("NICASIA", "wines")}
            />
            <WineItem
              name="TRUMPETER"
              style="Chardonnay"
              wineType="white"
              glassPrice="$5500.-"
              bottlePrice="$22000.-"
              available={getItemAvailability("TRUMPETER", "wines")}
            />
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Bebidas Section */}
        <section id="bebidas" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">BEBIDAS S/ ALCOHOL</h2>

          <div className="space-y-4">
            <MenuItem
              name="LIMONADA CASERA"
              description="Limones exprimidos, syrup de miel & menta"
              price="$4000.-"
              available={getItemAvailability("LIMONADA CASERA", "non_alcoholic")}
            />
            <MenuItem
              name="AGUA MINERAL"
              description="con o sin gas"
              price="$3500.-"
              available={getItemAvailability("AGUA MINERAL", "non_alcoholic")}
            />
            <MenuItem
              name="COCA COLA"
              description="clásica o zero"
              price="$3500.-"
              available={getItemAvailability("COCA COLA", "non_alcoholic")}
            />
            <MenuItem
              name="SPRITE"
              description="clásica o zero"
              price="$3500.-"
              available={getItemAvailability("SPRITE", "non_alcoholic")}
            />
            <MenuItem name="FANTA" price="$3500.-" available={getItemAvailability("FANTA", "non_alcoholic")} />
            <MenuItem
              name="SCHWEPPES"
              description="tónica o pomelo zero"
              price="$3500.-"
              available={getItemAvailability("SCHWEPPES", "non_alcoholic")}
            />
            <MenuItem
              name="AQUARIUS"
              description="naranja, pomelo, manzana y pera"
              price="$3500.-"
              available={getItemAvailability("AQUARIUS", "non_alcoholic")}
            />
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Tragos Section */}
        <section id="tragos" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">TRAGOS</h2>

          <div className="space-y-4">
            <MenuItem
              name="VERMÚ"
              description="Cinzano Rosso con soda & naranja"
              price="$6000.-"
              available={getItemAvailability("VERMÚ", "cocktails")}
            />
            <MenuItem
              name="FERNET & COCA"
              description="Fernet Branca, Coca Cola"
              price="$6500.-"
              available={getItemAvailability("FERNET & COCA", "cocktails")}
            />
            <MenuItem
              name="FERROVIARIO"
              description="Cinzano Rosso, Fernet & soda"
              price="$6500.-"
              available={getItemAvailability("FERROVIARIO", "cocktails")}
            />
            <MenuItem
              name="AMERICANO"
              description="Campari, Cinzano Rosso & soda"
              price="$6500.-"
              available={getItemAvailability("AMERICANO", "cocktails")}
            />
            <MenuItem
              name="VODKA & NARANJA"
              description="Vodka Skyy c/ jugo de naranja"
              price="$5000.-"
              available={getItemAvailability("VODKA & NARANJA", "cocktails")}
            />
            <MenuItem
              name="CAMPARI & NARANJA"
              description="Campari & jugo de naranja"
              price="$6000.-"
              available={getItemAvailability("CAMPARI & NARANJA", "cocktails")}
            />
            <MenuItem
              name="CAMPARI & TÓNICA"
              description="Campari & tónica"
              price="$6000.-"
              available={getItemAvailability("CAMPARI & TÓNICA", "cocktails")}
            />
            <MenuItem
              name="CYNAR JULEP"
              description="Cynar, limón, azucar, pomelo & menta"
              price="$6500.-"
              available={getItemAvailability("CYNAR JULEP", "cocktails")}
            />
            <MenuItem
              name="GIN & TÓNICA"
              description="Gin Restinga & tónica"
              price="$8000.-"
              available={getItemAvailability("GIN & TÓNICA", "cocktails")}
            />
            <MenuItem
              name="GIN & TÓNICA PREMIUM"
              description="Gin Bulldog & tónica"
              price="$11000.-"
              available={getItemAvailability("GIN & TÓNICA PREMIUM", "cocktails")}
            />
            <MenuItem
              name="TOM COLLINS"
              description="Gin, limón, syrup & soda"
              price="$8000.-"
              available={getItemAvailability("TOM COLLINS", "cocktails")}
            />
            <MenuItem
              name="APEROL SPRITZ"
              description="Aperol & prosecco"
              price="$8000.-"
              available={getItemAvailability("APEROL SPRITZ", "cocktails")}
            />
            <MenuItem
              name="NEGRONI"
              description="Gin, Vermú & Campari"
              price="$8000.-"
              available={getItemAvailability("NEGRONI", "cocktails")}
            />
            <MenuItem
              name="PENICILLIN"
              description="Jameson, Limon, Miel & Jengibre"
              price="$10000.-"
              available={getItemAvailability("PENICILLIN", "cocktails")}
            />
            <MenuItem
              name="MANHATTAN"
              description="Wild Turkey 101, Angostura, Cinzano Rosso"
              price="$10000.-"
              available={getItemAvailability("MANHATTAN", "cocktails")}
            />
            <MenuItem
              name="OLD FASHIONED"
              description="Wild Turkey 101, Angostura bitters, Rosemary syrup, Marraschino cherry"
              price="$12000.-"
              available={getItemAvailability("OLD FASHIONED", "cocktails")}
            />
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Merch Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">MERCH</h2>

          <div className="space-y-4">
            <MenuItem
              name="REMERA LEBEN BREWING CO"
              description="Remera doodles - blanca o verde"
              price="$20000.-"
              available={getItemAvailability("REMERA LEBEN BREWING CO", "merch")}
            />
          </div>
        </section>
      </main>

      <BackToTop />
    </div>
  )
}
