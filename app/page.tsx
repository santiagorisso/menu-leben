"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { subscribeToMenuItems } from "@/lib/firestore"
import MenuItem from "@/components/MenuItem"
import BeerItem from "@/components/BeerItem"
import WineItem from "@/components/WineItem"
import BackToTop from "@/components/BackToTop"
import type { MenuItem as MenuItemType } from "@/types/menu"

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToMenuItems(db, (items) => {
      setMenuItems(items)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const getItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category)
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando menú...</p>
        </div>
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
            {getItemsByCategory("Para Picar").map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                vegetarian={item.vegetarian}
                available={item.available !== false}
              />
            ))}
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
            {getItemsByCategory("Empanadas").map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                vegetarian={item.vegetarian}
                available={item.available !== false}
              />
            ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Pizzas Section */}
        <section id="pizzas" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">PIZZAS</h2>
          <p className="text-sm text-muted-foreground mb-8 italic text-center">- a la piedra -</p>

          <div className="space-y-6">
            {getItemsByCategory("Pizzas")
              .filter(
                (item) =>
                  !item.name.includes("FUGA RELLENA") &&
                  !item.name.includes("PORCION") &&
                  !item.name.includes("2 PORCIONES"),
              )
              .map((item) => (
                <MenuItem
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  vegetarian={item.vegetarian}
                  available={item.available !== false}
                />
              ))}

            <div className="mt-8 p-6 border-border border rounded-2xl">
              <h3 className="font-bold text-center text-2xl mb-0">{"DE MOLDE"}</h3>
              <h3 className="font-bold mb-3 text-center text-xs leading-7">{"- SOLO LOS DOMINGOS -"}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic text-center">
                muzzarella, salsa de tomate, jamón cocido natural, orégano fresco, morrón rojo, amarillo y verde y
                aceitunas verdes tostadas
              </p>
            </div>

            {getItemsByCategory("Pizzas")
              .filter(
                (item) =>
                  item.name.includes("FUGA RELLENA") ||
                  item.name.includes("PORCION") ||
                  item.name.includes("2 PORCIONES"),
              )
              .map((item) => (
                <MenuItem
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  vegetarian={item.vegetarian}
                  available={item.available !== false}
                />
              ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        <section id="sandwichs" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">SANDWICH</h2>
          <p className="text-sm text-muted-foreground mb-8 text-center italic">- con side de papas fritas -</p>

          <div className="space-y-6">
            {getItemsByCategory("Sandwich").map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                available={item.available !== false}
              />
            ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Cervezas Section */}
        <section id="cervezas" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">CERVEZAS</h2>

          <div className="space-y-8">
            {getItemsByCategory("Cervezas")
              .filter((item) => item.ibu && item.abv)
              .map((item) => (
                <BeerItem
                  key={item.id}
                  name={item.name}
                  ibu={item.ibu || ""}
                  abv={item.abv || ""}
                  description={item.description || ""}
                  price={item.price}
                  available={item.available !== false}
                />
              ))}
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 text-center">LATAS</h3>
            <div className="space-y-4">
              {getItemsByCategory("Cervezas")
                .filter((item) => !item.ibu && !item.abv)
                .map((item) => (
                  <MenuItem key={item.id} name={item.name} price={item.price} available={item.available !== false} />
                ))}
            </div>
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        <section id="vinos" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">VINOS</h2>

          <div className="space-y-8">
            {getItemsByCategory("Vinos").map((item) => (
              <WineItem
                key={item.id}
                name={item.name}
                style={item.description || ""}
                wineType={item.wineType || "red"}
                glassPrice={item.glassPrice || item.price}
                bottlePrice={item.bottlePrice || ""}
                available={item.available !== false}
              />
            ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Bebidas Section */}
        <section id="bebidas" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">BEBIDAS S/ ALCOHOL</h2>

          <div className="space-y-4">
            {getItemsByCategory("Bebidas S/ Alcohol").map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                available={item.available !== false}
              />
            ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Tragos Section */}
        <section id="tragos" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">TRAGOS</h2>

          <div className="space-y-4">
            {getItemsByCategory("Tragos").map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                available={item.available !== false}
              />
            ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Merch Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">MERCH</h2>

          <div className="space-y-4">
            {getItemsByCategory("Merch").map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                available={item.available !== false}
              />
            ))}
          </div>
        </section>
      </main>

      <BackToTop />
    </div>
  )
}
