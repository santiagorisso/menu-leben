"use client";

import type React from "react";
import { signOut } from "firebase/auth";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { MenuCategory } from "@/types/menu";
import {
  subscribeToAllCollections,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/firestore";

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
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<Record<string, any[]>>({});
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const unsubscribeItems = subscribeToAllCollections(db, (items) => {
          setMenuItems(items);
        });
        setLoading(false);
        return () => unsubscribeItems();
      } else {
        router.push("/admin/login");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAddItem = async (formData: any) => {
    if (!db) return;

    try {
      await addMenuItem(db, formData);
      setIsAddingItem(false);
      console.log("Item added successfully");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async (id: string, formData: any) => {
    if (!db) return;

    try {
      await updateMenuItem(db, id, formData);
      setEditingItem(null);
      console.log("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!db) return;

    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMenuItem(db, id);
        console.log("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleToggleVisibility = async (id: string, hidden: boolean) => {
    if (!db) return;

    try {
      await updateMenuItem(db, id, { hidden });
      console.log(`Item ${hidden ? "hidden" : "shown"} successfully`);
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const renderPrice = (price: any): string => {
    if (typeof price === "number") return `$${price}.-`;
    if (typeof price === "string" && price.includes("$")) return price;
    return price ? `$${price}.-` : "";
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!auth || !db) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <Card className="max-w-2xl p-8 bg-zinc-900 border-zinc-800">
          <h1 className="text-2xl font-bold mb-4 text-orange-500">
            Firebase Configuration Required
          </h1>
          <p className="mb-4 text-zinc-300">
            The admin dashboard requires Firebase to be configured. Please
            follow these steps:
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
              Enable <strong>Firestore Database</strong> (click "Create
              database")
            </li>
            <li>
              Enable <strong>Authentication</strong> (go to Authentication →
              Sign-in method → Enable Email/Password)
            </li>
            <li>
              Verify your environment variables are set in the{" "}
              <strong>Vars</strong> section
            </li>
          </ol>
          <Button
            onClick={() => router.push("/")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Back to Menu
          </Button>
        </Card>
      </div>
    );
  }

  const allItems = Object.entries(menuItems).flatMap(
    ([collectionName, items]) =>
      items.map((item) => ({ ...item, collectionName }))
  );

  // Group items by category for better organization and sort by order
  const itemsByCategory = allItems.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort items within each category by order field
  Object.keys(itemsByCategory).forEach((category) => {
    itemsByCategory[category].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
  });

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
          <h2 className="text-xl font-bold">
            Menu Items ({allItems.length} total)
          </h2>
          <Button onClick={() => setIsAddingItem(true)}>Add New Item</Button>
        </div>

        {isAddingItem && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Add New Menu Item</h3>
            <MenuItemForm
              onSubmit={handleAddItem}
              onCancel={() => setIsAddingItem(false)}
            />
          </Card>
        )}

        <div className="space-y-8">
          {allItems.length === 0 && (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                No menu items found.
              </p>
            </Card>
          )}
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer border-b border-border pb-2"
                onClick={() => toggleCategory(category)}
              >
                <h3 className="text-lg font-semibold">
                  {category.toUpperCase()} ({items.length} items)
                </h3>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    collapsedCategories[category] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {!collapsedCategories[category] && (
                <div className="grid gap-4">
                  {items.map((item, index) => (
                    <Card key={item.id} className="p-4">
                      {editingItem?.id === item.id ? (
                        <MenuItemForm
                          initialData={item}
                          onSubmit={(data) => handleUpdateItem(item.id, data)}
                          onCancel={() => setEditingItem(null)}
                        />
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold">
                                {item.name.toUpperCase()}
                              </h3>
                              {item.hidden && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  HIDDEN
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                            <p className="text-sm mt-1">
                              Collection:{" "}
                              <span className="font-mono text-xs">
                                {item.collectionName}
                              </span>
                            </p>
                            <p className="text-sm mt-1">
                              Status:{" "}
                              <span
                                className={
                                  item.available !== false
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {item.available !== false
                                  ? "Available"
                                  : "Sold Out"}
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
                            {item.collectionName === "beers" && (
                              <>
                                <p className="text-sm mt-1">IBU: {item.ibu}</p>
                                <p className="text-sm mt-1">ABV: {item.abv}</p>
                              </>
                            )}
                            {item.collectionName === "wines" && (
                              <>
                                <p className="text-sm mt-1">
                                  Type: {item.type}
                                </p>
                                <p className="text-sm mt-1">
                                  Style: {item.style}
                                </p>
                                <p className="text-sm mt-1">
                                  Glass: ${item.price_per_glass}
                                </p>
                                <p className="text-sm mt-1">
                                  Bottle: ${item.price_per_bottle}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-bold text-primary">
                              {renderPrice(item.price)}
                            </p>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={!item.hidden}
                                  onCheckedChange={(checked) =>
                                    handleToggleVisibility(item.id, !checked)
                                  }
                                  size="sm"
                                />
                                <span className="text-xs text-muted-foreground">
                                  Visible in menu
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => setEditingItem(item)}
                                  size="sm"
                                  variant="outline"
                                >
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDeleteItem(item.id)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function MenuItemForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    vegetarian: initialData?.vegetarian || false,
    available: initialData?.available !== false,
    hidden: initialData?.hidden || false,
    order: initialData?.order || 0,
    image: initialData?.image || "",
    ibu: initialData?.ibu || "",
    abv: initialData?.abv || "",
    type: initialData?.type || "",
    style: initialData?.style || "",
    price_per_glass: initialData?.price_per_glass || "",
    price_per_bottle: initialData?.price_per_bottle || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price && formData.category !== "Vinos")
      newErrors.price = "Price is required";

    // Category-specific validation
    if (formData.category === "Cervezas") {
      if (!formData.ibu) newErrors.ibu = "IBU is required for beers";
      if (!formData.abv) newErrors.abv = "ABV is required for beers";
    }

    if (formData.category === "Vinos") {
      if (!formData.type) newErrors.type = "Wine type is required";
      if (!formData.style) newErrors.style = "Wine style is required";
      if (!formData.price_per_glass)
        newErrors.price_per_glass = "Glass price is required";
      if (!formData.price_per_bottle)
        newErrors.price_per_bottle = "Bottle price is required";
    }

    if (formData.category === "Pizzas" && !formData.description) {
      newErrors.description = "Ingredients are required for pizzas";
    }

    if (formData.category === "Tragos" && !formData.description) {
      newErrors.description = "Ingredients are required for cocktails";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Category *</label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger className={errors.category ? "border-red-500" : ""}>
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
        {errors.category && (
          <p className="text-xs text-red-500 mt-1">{errors.category}</p>
        )}
      </div>

      {formData.category === "Cervezas" && (
        <>
          <div>
            <label className="text-sm font-medium">IBU *</label>
            <Input
              type="number"
              value={formData.ibu}
              onChange={(e) =>
                setFormData({ ...formData, ibu: e.target.value })
              }
              className={errors.ibu ? "border-red-500" : ""}
            />
            {errors.ibu && (
              <p className="text-xs text-red-500 mt-1">{errors.ibu}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">ABV *</label>
            <Input
              type="number"
              step="0.1"
              value={formData.abv}
              onChange={(e) =>
                setFormData({ ...formData, abv: e.target.value })
              }
              className={errors.abv ? "border-red-500" : ""}
            />
            {errors.abv && (
              <p className="text-xs text-red-500 mt-1">{errors.abv}</p>
            )}
          </div>
        </>
      )}

      {formData.category === "Vinos" && (
        <>
          <div>
            <label className="text-sm font-medium">Wine Type *</label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Select wine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="white">White</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Style *</label>
            <Input
              value={formData.style}
              onChange={(e) =>
                setFormData({ ...formData, style: e.target.value })
              }
              placeholder="e.g., Red Blend, Chardonnay"
              className={errors.style ? "border-red-500" : ""}
            />
            {errors.style && (
              <p className="text-xs text-red-500 mt-1">{errors.style}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Price per Glass *</label>
            <Input
              type="number"
              value={formData.price_per_glass}
              onChange={(e) =>
                setFormData({ ...formData, price_per_glass: e.target.value })
              }
              className={errors.price_per_glass ? "border-red-500" : ""}
            />
            {errors.price_per_glass && (
              <p className="text-xs text-red-500 mt-1">
                {errors.price_per_glass}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Price per Bottle *</label>
            <Input
              type="number"
              value={formData.price_per_bottle}
              onChange={(e) =>
                setFormData({ ...formData, price_per_bottle: e.target.value })
              }
              className={errors.price_per_bottle ? "border-red-500" : ""}
            />
            {errors.price_per_bottle && (
              <p className="text-xs text-red-500 mt-1">
                {errors.price_per_bottle}
              </p>
            )}
          </div>
        </>
      )}

      {formData.category !== "Vinos" && (
        <div>
          <label className="text-sm font-medium">Price *</label>
          <Input
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="e.g., $5000.-"
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.vegetarian}
          onChange={(e) =>
            setFormData({ ...formData, vegetarian: e.target.checked })
          }
        />
        <label className="text-sm font-medium">Vegetarian</label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={formData.available}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, available: checked })
          }
        />
        <label className="text-sm font-medium">
          Available (uncheck to mark as Sold Out)
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={!formData.hidden}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, hidden: !checked })
          }
        />
        <label className="text-sm font-medium">
          Visible in menu (uncheck to hide from public menu)
        </label>
      </div>
      <div>
        <label className="text-sm font-medium">Order (optional)</label>
        <Input
          type="number"
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
          }
          placeholder="Display order (lower numbers appear first)"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Image URL (optional)</label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
