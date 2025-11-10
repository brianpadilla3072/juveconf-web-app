"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface DetailItem {
  label: string
  value: string
  icon?: string
}

interface DetailItemsEditorProps {
  description?: string
  items?: DetailItem[]
  onDescriptionChange: (description: string) => void
  onChange: (items: DetailItem[]) => void
}

export function DetailItemsEditor({
  description = '',
  items = [],
  onDescriptionChange,
  onChange
}: DetailItemsEditorProps) {
  const [detailItems, setDetailItems] = useState<DetailItem[]>(items)
  const [comboDescription, setComboDescription] = useState<string>(description)

  useEffect(() => {
    setDetailItems(items)
  }, [items])

  useEffect(() => {
    setComboDescription(description)
  }, [description])

  const handleDescriptionChange = (value: string) => {
    setComboDescription(value)
    onDescriptionChange(value)
  }

  const handleAddItem = () => {
    const newItems = [...detailItems, { label: '', value: '' }]
    setDetailItems(newItems)
    onChange(newItems)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = detailItems.filter((_, i) => i !== index)
    setDetailItems(newItems)
    onChange(newItems)
  }

  const handleUpdateItem = (index: number, field: keyof DetailItem, value: string) => {
    const newItems = detailItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    setDetailItems(newItems)
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Detalles del Combo</Label>
        <Badge variant="secondary">
          {detailItems.length} {detailItems.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {/* Descripción General */}
      <div className="space-y-2">
        <Label htmlFor="combo-description" className="text-sm font-medium">
          Descripción General
        </Label>
        <Textarea
          id="combo-description"
          value={comboDescription}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Ej: IDEAL PARA QUIENES QUIEREN TODO EL PAQUETE COMPLETO Y LLEVARSE LA REMERA OFICIAL"
          maxLength={200}
          rows={3}
          className="resize-none"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Descripción breve del combo
          </p>
          <p className="text-xs text-muted-foreground">
            {comboDescription.length}/200
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <Label className="text-sm font-medium mb-3 block">
          Items Incluidos
        </Label>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {detailItems.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No hay items agregados</p>
              <p className="text-xs mt-1">Haz clic en "Agregar Item" para comenzar</p>
            </CardContent>
          </Card>
        )}

        {detailItems.map((item, index) => (
          <Card key={index} className="border-l-4 border-l-primary/50">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-2 text-muted-foreground cursor-move">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor={`label-${index}`} className="text-xs">
                      Etiqueta
                    </Label>
                    <Input
                      id={`label-${index}`}
                      value={item.label}
                      onChange={(e) => handleUpdateItem(index, 'label', e.target.value)}
                      placeholder="Ej: Incluye, Material, Alimentación"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`value-${index}`} className="text-xs">
                      Descripción
                    </Label>
                    <Input
                      id={`value-${index}`}
                      value={item.value}
                      onChange={(e) => handleUpdateItem(index, 'value', e.target.value)}
                      placeholder="Ej: Entrada a todos los eventos"
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveItem(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleAddItem}
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Item
      </Button>

      {(detailItems.length > 0 || comboDescription) && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <Label className="text-xs text-muted-foreground">Vista Previa JSON</Label>
            <pre className="mt-2 text-xs bg-background rounded p-3 overflow-x-auto">
              {JSON.stringify({
                description: comboDescription || undefined,
                detailItems
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
