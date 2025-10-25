"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, X, GripVertical, ShirtIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface MerchandiseItem {
  type: string
  label: string
  sizes: string[]
}

interface MerchandiseEditorProps {
  enabled: boolean
  items: MerchandiseItem[]
  onEnabledChange: (enabled: boolean) => void
  onChange: (items: MerchandiseItem[]) => void
}

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export function MerchandiseEditor({
  enabled,
  items,
  onEnabledChange,
  onChange
}: MerchandiseEditorProps) {
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>(items)
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled)
  const [newSizeInputs, setNewSizeInputs] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    setMerchandiseItems(items)
  }, [items])

  useEffect(() => {
    setIsEnabled(enabled)
  }, [enabled])

  const handleEnabledChange = (checked: boolean) => {
    setIsEnabled(checked)
    onEnabledChange(checked)
    if (!checked) {
      setMerchandiseItems([])
      onChange([])
    }
  }

  const handleAddItem = () => {
    const newItems = [...merchandiseItems, { type: '', label: '', sizes: [] }]
    setMerchandiseItems(newItems)
    onChange(newItems)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = merchandiseItems.filter((_, i) => i !== index)
    setMerchandiseItems(newItems)
    onChange(newItems)
  }

  const handleUpdateItem = (index: number, field: keyof MerchandiseItem, value: string | string[]) => {
    const newItems = merchandiseItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    setMerchandiseItems(newItems)
    onChange(newItems)
  }

  const handleAddSize = (index: number, size: string) => {
    const item = merchandiseItems[index]
    if (!item.sizes.includes(size) && size.trim()) {
      handleUpdateItem(index, 'sizes', [...item.sizes, size.trim()])
    }
    // Clear input
    setNewSizeInputs({ ...newSizeInputs, [index]: '' })
  }

  const handleRemoveSize = (index: number, size: string) => {
    const item = merchandiseItems[index]
    handleUpdateItem(index, 'sizes', item.sizes.filter(s => s !== size))
  }

  const handleToggleSize = (index: number, size: string) => {
    const item = merchandiseItems[index]
    if (item.sizes.includes(size)) {
      // Si ya existe, eliminarlo
      handleUpdateItem(index, 'sizes', item.sizes.filter(s => s !== size))
    } else {
      // Si no existe, agregarlo
      handleUpdateItem(index, 'sizes', [...item.sizes, size])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            id="merchandiseEnabled"
            checked={isEnabled}
            onCheckedChange={handleEnabledChange}
          />
          <Label htmlFor="merchandiseEnabled" className="text-base font-semibold cursor-pointer">
            Este combo incluye merchandising
          </Label>
        </div>
        {isEnabled && (
          <Badge variant="secondary">
            {merchandiseItems.length} {merchandiseItems.length === 1 ? 'item' : 'items'}
          </Badge>
        )}
      </div>

      {isEnabled && (
        <>
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
              <ShirtIcon className="w-4 h-4" />
              Items de Merchandising
            </Label>
            <p className="text-xs text-muted-foreground mb-4">
              Agrega los productos (remera, gorra, buzo, etc.) que incluye este combo
            </p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {merchandiseItems.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <ShirtIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay merchandising agregado</p>
                  <p className="text-xs mt-1">Haz clic en "Agregar Item" para comenzar</p>
                </CardContent>
              </Card>
            )}

            {merchandiseItems.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-violet-500">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-2 text-muted-foreground cursor-move">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Tipo y Label */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`type-${index}`} className="text-xs">
                            Tipo
                          </Label>
                          <Input
                            id={`type-${index}`}
                            value={item.type}
                            onChange={(e) => handleUpdateItem(index, 'type', e.target.value)}
                            placeholder="Ej: remera, gorra, buzo"
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Nombre técnico (minúsculas, sin espacios)
                          </p>
                        </div>

                        <div>
                          <Label htmlFor={`label-${index}`} className="text-xs">
                            Etiqueta
                          </Label>
                          <Input
                            id={`label-${index}`}
                            value={item.label}
                            onChange={(e) => handleUpdateItem(index, 'label', e.target.value)}
                            placeholder="Ej: Remera oficial del evento"
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Nombre visible para usuarios
                          </p>
                        </div>
                      </div>

                      {/* Talles */}
                      <div>
                        <Label className="text-xs">Talles disponibles</Label>

                        {/* Quick add common sizes */}
                        <div className="flex flex-wrap gap-1 mt-2 mb-2">
                          {COMMON_SIZES.map((size) => (
                            <Button
                              key={size}
                              type="button"
                              variant={item.sizes.includes(size) ? "default" : "outline"}
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleToggleSize(index, size)}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>

                        {/* Current sizes */}
                        {item.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border">
                            {item.sizes.map((size) => (
                              <Badge
                                key={size}
                                variant="secondary"
                                className="gap-1 pr-1"
                              >
                                {size}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-destructive/20"
                                  onClick={() => handleRemoveSize(index, size)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Custom size input */}
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Talle personalizado"
                            value={newSizeInputs[index] || ''}
                            onChange={(e) => setNewSizeInputs({ ...newSizeInputs, [index]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddSize(index, newSizeInputs[index] || '')
                              }
                            }}
                            className="text-xs"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddSize(index, newSizeInputs[index] || '')}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
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
            Agregar Item de Merchandising
          </Button>

          {merchandiseItems.length > 0 && (
            <Card className="bg-violet-50/50 border-violet-200">
              <CardContent className="pt-4">
                <Label className="text-xs text-muted-foreground">Vista Previa JSON - Merchandising</Label>
                <pre className="mt-2 text-xs bg-background rounded p-3 overflow-x-auto">
                  {JSON.stringify({
                    enabled: true,
                    allMerchandise: merchandiseItems
                  }, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
