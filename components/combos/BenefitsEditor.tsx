"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface BenefitsEditorProps {
  benefits?: string[]
  onChange: (benefits: string[]) => void
}

export function BenefitsEditor({
  benefits = [],
  onChange
}: BenefitsEditorProps) {
  const [benefitsList, setBenefitsList] = useState<string[]>(benefits)

  useEffect(() => {
    setBenefitsList(benefits)
  }, [benefits])

  const handleAddBenefit = () => {
    const newBenefits = [...benefitsList, '']
    setBenefitsList(newBenefits)
    onChange(newBenefits)
  }

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = benefitsList.filter((_, i) => i !== index)
    setBenefitsList(newBenefits)
    onChange(newBenefits)
  }

  const handleUpdateBenefit = (index: number, value: string) => {
    const newBenefits = benefitsList.map((benefit, i) =>
      i === index ? value : benefit
    )
    setBenefitsList(newBenefits)
    onChange(newBenefits)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Beneficios del Combo</Label>
        <Badge variant="secondary">
          {benefitsList.length} {benefitsList.length === 1 ? 'beneficio' : 'beneficios'}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        Lista de beneficios que se mostrarán en el sitio público con checkmarks
      </p>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {benefitsList.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No hay beneficios agregados</p>
              <p className="text-xs mt-1">Haz clic en "Agregar Beneficio" para comenzar</p>
            </CardContent>
          </Card>
        )}

        {benefitsList.map((benefit, index) => (
          <Card key={index} className="border-l-4 border-l-violet-500/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-2 text-muted-foreground cursor-move">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <Label htmlFor={`benefit-${index}`} className="text-xs">
                    Beneficio #{index + 1}
                  </Label>
                  <Input
                    id={`benefit-${index}`}
                    value={benefit}
                    onChange={(e) => handleUpdateBenefit(index, e.target.value)}
                    placeholder="Ej: Acceso a las 4 plenarias generales"
                    className="mt-1"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveBenefit(index)}
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
        onClick={handleAddBenefit}
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Beneficio
      </Button>

      {benefitsList.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <Label className="text-xs text-muted-foreground">Vista Previa JSON</Label>
            <pre className="mt-2 text-xs bg-background rounded p-3 overflow-x-auto">
              {JSON.stringify({ benefits: benefitsList }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
