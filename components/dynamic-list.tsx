"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DynamicListProps {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}

export function DynamicList({
  label,
  items,
  onChange,
  placeholder = "Enter item...",
}: DynamicListProps) {
  function addItem() {
    onChange([...items, ""])
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, value: string) {
    const updated = [...items]
    updated[index] = value
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-foreground">{label}</Label>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(i)}
            className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-fit bg-transparent"
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Item
      </Button>
    </div>
  )
}
