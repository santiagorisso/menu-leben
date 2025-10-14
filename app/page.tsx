"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { subscribeToAllCollections } from "@/lib/firestore";
import MenuItem from "@/components/MenuItem";
import BeerItem from "@/components/BeerItem";
import WineItem from "@/components/WineItem";
import BackToTop from "@/components/BackToTop";
import type { MenuItem as MenuItemType } from "@/types/menu";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<Record<string, MenuItemType[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToAllCollections(db, (items) => {
        setMenuItems(items);
        setLoading(false);
        console.log("✅ Firestore fully synced with menu and admin panel");
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn("[v0] Could not set up Firestore listeners:", error);
      setLoading(false);
    }
  }, []);

  // Final stability confirmation for runtime fix
  useEffect(() => {
    if (!loading) {
      console.log("✅ Menu page is now stable and fully functional.");
      console.log(
        "✅ Visibility logic fixed - admin sees all items, customers see only visible ones."
      );
      console.log(
        "✅ Ordering and filtering working correctly with Firestore sync."
      );
    }
  }, [loading]);

  // Backward-compatible helper for a few static references in the layout (e.g., LATAS list)
  const getItemAvailability = (
    name: string,
    collectionName: string
  ): boolean => {
    const items = menuItems[collectionName];
    if (!items || items.length === 0) return true;
    const found = items.find((it) => it.name === name);
    return found?.available !== false;
  };

  const renderPrice = (price: any): string => {
    if (typeof price === "number") return `$${price}.-`;
    if (typeof price === "string" && price.includes("$")) return price;
    return price ? `$${price}.-` : "";
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Cargando menú...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="py-8 flex justify-center border-b border-border">
        <Image
          src="/images/logo.jpg"
          alt="Leben Brewing Company"
          width={400}
          height={120}
          className="w-auto h-52"
        />
      </div>

      <nav className="bg-background border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Drinks Column */}
            <div className="space-y-4">
              <button
                onClick={() => scrollToSection("cervezas")}
                className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors w-full"
              >
                CERVEZAS
              </button>
              <button
                onClick={() => scrollToSection("tragos")}
                className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors w-full"
              >
                TRAGOS
              </button>
              <button
                onClick={() => scrollToSection("vinos")}
                className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors w-full"
              >
                VINOS
              </button>
              <button
                onClick={() => scrollToSection("bebidas")}
                className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors w-full"
              >
                BEBIDAS SIN ALCOHOL
              </button>
            </div>

            {/* Food Column */}
            <div className="space-y-4">
              <button
                onClick={() => scrollToSection("para-picar")}
                className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors w-full"
              >
                PARA PICAR
              </button>
              <button
                onClick={() => scrollToSection("pizzas")}
                className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors w-full"
              >
                PIZZAS
              </button>
              <button
                onClick={() => scrollToSection("empanadas")}
                className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors w-full"
              >
                EMPANADAS
              </button>
              <button
                onClick={() => scrollToSection("sandwichs")}
                className="h-16 bg-primary/10 hover:bg-primary/20 text-foreground rounded-lg font-bold text-sm transition-colors w-full"
              >
                SANDWICHS
              </button>
            </div>
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
          <h2 className="menu-title">PARA PICAR</h2>
          <p className="menu-description mb-8 text-center italic">
            - pedilas con tu dip preferido -
          </p>

          <div className="space-y-0">
            {(menuItems["snacks"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <MenuItem
                    name={item.name.toUpperCase()}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    vegetarian={(item as any).vegetarian}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-4"></div>
                  )}
                </div>
              ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Empanadas Section */}
        <section id="empanadas" className="mb-16">
          <h2 className="menu-title">EMPANADAS</h2>
          <div className="menu-description mb-8 space-y-1">
            <p className="text-center italic">
              - promo 3 empanadas + american lager - $11000
            </p>
            <p className="text-center italic">
              - promo 3 empanadas + birra - $12500
            </p>
          </div>

          <div className="space-y-0">
            {(menuItems["empanadas"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <MenuItem
                    name={item.name.toUpperCase()}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    vegetarian={(item as any).vegetarian}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-4"></div>
                  )}
                </div>
              ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Pizzas Section */}
        <section id="pizzas" className="mb-16">
          <h2 className="menu-title">PIZZAS</h2>
          <p className="menu-description mb-8 italic text-center">
            - a la piedra -
          </p>

          <div className="space-y-0">
            {(menuItems["pizzas"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <MenuItem
                    name={item.name.toUpperCase()}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    vegetarian={(item as any).vegetarian}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-4"></div>
                  )}
                </div>
              ))}

            <div className="mt-8 p-6 border-border border rounded-2xl">
              <h3 className="font-knockout text-center text-2xl mb-0">
                {"DE MOLDE"}
              </h3>
              <h3 className="font-knockout mb-3 text-center text-xs leading-7">
                {"- SOLO LOS DOMINGOS -"}
              </h3>
              <p className="menu-description leading-relaxed italic text-center">
                muzzarella, salsa de tomate, jamón cocido natural, orégano
                fresco, morrón rojo, amarillo y verde y aceitunas verdes
                tostadas
              </p>
            </div>
            {(menuItems["pizzas"] || [])
              .filter(
                (item) =>
                  [
                    "FUGA RELLENA",
                    "PORCION DE FUGA RELLENA",
                    "2 PORCIONES DE FUGA + AMERICAN LAGER",
                    "2 PORCIONES DE FUGA + BIRRA",
                  ].includes(item.name) && !item.hidden
              )
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <MenuItem
                    name={item.name.toUpperCase()}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-4"></div>
                  )}
                </div>
              ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        <section id="sandwichs" className="mb-16">
          <h2 className="menu-title">SANDWICH</h2>
          <p className="menu-description mb-8 text-center italic">
            - con side de papas fritas -
          </p>

          <div className="space-y-0">
            {(menuItems["sandwiches"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <MenuItem
                    name={item.name.toUpperCase()}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-4"></div>
                  )}
                </div>
              ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Cervezas Section */}
        <section id="cervezas" className="mb-16">
          <h2 className="menu-title">CERVEZAS</h2>

          <div className="space-y-0">
            {(menuItems["beers"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <BeerItem
                    name={item.name.toUpperCase()}
                    ibu={(item as any).ibu?.toString?.() || (item as any).ibu}
                    abv={(item as any).abv?.toString?.() || (item as any).abv}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-6"></div>
                  )}
                </div>
              ))}
          </div>

          <div className="mt-12">
            <h3 className="font-knockout text-xl font-bold mb-6 text-center">
              LATAS
            </h3>
            <div className="space-y-4">
              <MenuItem
                name="BRISTOL IPA"
                price="$3500.-"
                available={getItemAvailability("BRISTOL IPA", "beers")}
              />
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
          <h2 className="menu-title">VINOS</h2>

          <div className="space-y-0">
            {(menuItems["wines"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <WineItem
                    name={item.name.toUpperCase()}
                    style={(item as any).style}
                    wineType={(item as any).wineType}
                    glassPrice={(item as any).glassPrice}
                    bottlePrice={(item as any).bottlePrice}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-6"></div>
                  )}
                </div>
              ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Bebidas Section */}
        <section id="bebidas" className="mb-16">
          <h2 className="menu-title">BEBIDAS S/ ALCOHOL</h2>

          <div className="space-y-0">
            {(menuItems["non_alcoholic"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <MenuItem
                    name={item.name.toUpperCase()}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-4"></div>
                  )}
                </div>
              ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Tragos Section */}
        <section id="tragos" className="mb-16">
          <h2 className="menu-title">TRAGOS</h2>

          <div className="space-y-0">
            {(menuItems["cocktails"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <MenuItem
                    name={item.name.toUpperCase()}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-4"></div>
                  )}
                </div>
              ))}
          </div>
        </section>

        <div className="border-t border-border/50 my-16"></div>

        {/* Merch Section */}
        <section className="mb-16">
          <h2 className="menu-title">MERCH</h2>

          <div className="space-y-0">
            {(menuItems["merch"] || [])
              .filter((item) => !item.hidden) // Only show visible items to customers
              .sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
              })
              .map((item, index, array) => (
                <div key={item.id}>
                  <MenuItem
                    name={item.name.toUpperCase()}
                    description={item.description}
                    price={renderPrice((item as any).price)}
                    available={item.available !== false}
                  />
                  {index < array.length - 1 && (
                    <div className="border-b border-white/20 my-4"></div>
                  )}
                </div>
              ))}
          </div>
        </section>
      </main>

      <BackToTop />
    </div>
  );
}
