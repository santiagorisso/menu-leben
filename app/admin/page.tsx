"use client"

import type React from "react"
import { signOut } from "firebase/auth" // Import handleSignOut

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { MenuCategory } from "@/types/menu"
import { subscribeToMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/firestore"

const MENU_CATEGORIES: MenuCategory[] = [
  "Para Picar",
  "Empanadas",
  "Pizzas",
  "Sandwich",
  "Cervezas",
  "Vinos",
  "Bebidas S/ Alcohol",
  "Tragos",
  "Merch",
]

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const unsubscribeItems = subscribeToMenuItems(db, (items) => {
          setMenuItems(items)
        })
        setLoading(false)
        return () => unsubscribeItems()
      } else {
        router.push("/admin/login")
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleAddItem = async (formData: any) => {
    if (!db) return

    try {
      await addMenuItem(db, formData)
      setIsAddingItem(false)
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const handleUpdateItem = async (id: string, formData: any) => {
    if (!db) return

    try {
      await updateMenuItem(db, id, formData)
      setEditingItem(null)
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!db) return

    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMenuItem(db, id)
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    )
  }

  if (!auth || !db) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <Card className="max-w-2xl p-8 bg-zinc-900 border-zinc-800">
          <h1 className="text-2xl font-bold mb-4 text-orange-500">Firebase Configuration Required</h1>
          <p className="mb-4 text-zinc-300">
            The admin dashboard requires Firebase to be configured. Please follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-6 text-zinc-300">
            <li>
              Go to{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Firebase Console
              </a>
            </li>
            <li>Create a new project or select your existing one</li>
            <li>
              Enable <strong>Firestore Database</strong> (click "Create database")
            </li>
            <li>
              Enable <strong>Authentication</strong> (go to Authentication → Sign-in method → Enable Email/Password)
            </li>
            <li>
              Verify your environment variables are set in the <strong>Vars</strong> section
            </li>
          </ol>
          <Button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600">
            Back to Menu
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Menu Items</h2>
          <Button onClick={() => setIsAddingItem(true)}>Add New Item</Button>
        </div>

        {isAddingItem && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Add New Menu Item</h3>
            <MenuItemForm onSubmit={handleAddItem} onCancel={() => setIsAddingItem(false)} />
          </Card>
        )}

        <div className="grid gap-4">
          {menuItems.map((item) => (
            <Card key={item.id} className="p-4">
              {editingItem?.id === item.id ? (
                <MenuItemForm
                  initialData={item}
                  onSubmit={(data) => handleUpdateItem(item.id, data)}
                  onCancel={() => setEditingItem(null)}
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-sm mt-1">Category: {item.category}</p>
                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span className={item.available !== false ? "text-green-500" : "text-red-500"}>
                        {item.available !== false ? "Available" : "Sold Out"}
                      </span>
                    </p>
                    {item.vegetarian && (
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded mt-2 inline-block">
                        VEGETARIAN
                      </span>
                    )}
                    {item.image && (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover mt-2"
                      />
                    )}
                    {item.category === "Cervezas" && (
                      <>
                        <p className="text-sm mt-1">IBU: {item.ibu}</p>
                        <p className="text-sm mt-1">ABV: {item.abv}</p>
                      </>
                    )}
                    {item.category === "Vinos" && (
                      <>
                        <p className="text-sm mt-1">Wine Type: {item.wineType}</p>
                        <p className="text-sm mt-1">Glass Price: {item.glassPrice}</p>
                        <p className="text-sm mt-1">Bottle Price: {item.bottlePrice}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-primary">{item.price}</p>
                    <div className="flex gap-2">
                      <Button onClick={() => setEditingItem(item)} size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteItem(item.id)} size="sm" variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

function MenuItemForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    vegetarian: initialData?.vegetarian || false,
    available: initialData?.available !== false,
    image: initialData?.image || "",
    ibu: initialData?.ibu || "",
    abv: initialData?.abv || "",
    wineType: initialData?.wineType || "",
    glassPrice: initialData?.glassPrice || "",
    bottlePrice: initialData?.bottlePrice || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Price</label>
        <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm font-medium">Category</label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {MENU_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.vegetarian}
          onChange={(e) => setFormData({ ...formData, vegetarian: e.target.checked })}
        />
        <label className="text-sm font-medium">Vegetarian</label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={formData.available}
          onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
        />
        <label className="text-sm font-medium">Available (uncheck to mark as Sold Out)</label>
      </div>
      <div>
        <label className="text-sm font-medium">Image URL (optional)</label>
        <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
      </div>
      {formData.category === "Cervezas" && (
        <>
          <div>
            <label className="text-sm font-medium">IBU (optional)</label>
            <Input value={formData.ibu} onChange={(e) => setFormData({ ...formData, ibu: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">ABV (optional)</label>
            <Input value={formData.abv} onChange={(e) => setFormData({ ...formData, abv: e.target.value })} />
          </div>
        </>
      )}
      {formData.category === "Vinos" && (
        <>
          <div>
            <label className="text-sm font-medium">Wine Type</label>
            <Select value={formData.wineType} onValueChange={(value) => setFormData({ ...formData, wineType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select wine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="white">White</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Glass Price (optional)</label>
            <Input
              value={formData.glassPrice}
              onChange={(e) => setFormData({ ...formData, glassPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Bottle Price (optional)</label>
            <Input
              value={formData.bottlePrice}
              onChange={(e) => setFormData({ ...formData, bottlePrice: e.target.value })}
            />
          </div>
        </>
      )}
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  )
}
