export interface MenuItem {
  id?: string
  name: string
  description?: string
  price: string
  category: string
  vegetarian?: boolean
  ibu?: string
  abv?: string
  available?: boolean
  wineType?: "red" | "white"
  glassPrice?: string
  bottlePrice?: string
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

export type MenuCategory =
  | "Para Picar"
  | "Empanadas"
  | "Pizzas"
  | "Sandwich"
  | "Cervezas"
  | "Vinos"
  | "Bebidas S/ Alcohol"
  | "Tragos"
  | "Merch"

export interface Category {
  id?: string
  name: string
  order: number
  icon?: string
}

export interface Settings {
  showSoldOutOverlay: boolean
  themeColor?: string
  updatedAt?: Date
}
