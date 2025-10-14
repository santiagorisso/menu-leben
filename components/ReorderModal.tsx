"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripVertical, X } from "lucide-react";

interface ReorderItem {
  id: string;
  name: string;
  order?: number;
}

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reorderedItems: ReorderItem[]) => void;
  items: ReorderItem[];
  title: string;
  type: "items" | "categories";
}

function SortableItem({ item }: { item: ReorderItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-background border border-border rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "shadow-lg scale-105 bg-primary/5" : "hover:bg-muted/50"
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-5 h-5 text-muted-foreground" />
      <div className="flex-1">
        <h4 className="font-medium">{item.name}</h4>
        {item.order !== undefined && (
          <p className="text-sm text-muted-foreground">
            Current order: {item.order}
          </p>
        )}
      </div>
    </div>
  );
}

export function ReorderModal({
  isOpen,
  onClose,
  onConfirm,
  items,
  title,
  type,
}: ReorderModalProps) {
  const [reorderedItems, setReorderedItems] = useState<ReorderItem[]>(items);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    if (isOpen) {
      setReorderedItems(items);
      setHasChanges(false);
    }
  }, [isOpen, items]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setReorderedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  }

  function handleConfirm() {
    // Update order values based on new positions
    const itemsWithNewOrder = reorderedItems.map((item, index) => ({
      ...item,
      order: index,
    }));
    onConfirm(itemsWithNewOrder);
    onClose();
  }

  function handleCancel() {
    setReorderedItems(items);
    setHasChanges(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop to reorder {type}. The new order will be saved when
            you click "Confirm".
          </p>
          {reorderedItems.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No {type} available to reorder.
            </p>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={reorderedItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {reorderedItems.map((item, index) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <SortableItem item={item} />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            disabled={!hasChanges}
          >
            Confirm Order
          </Button>
        </div>
      </Card>
    </div>
  );
}
