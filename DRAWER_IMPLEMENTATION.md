# Drawer Global - Guía de Implementación

## ✅ Sistema Implementado

### Componentes Creados
- `contexts/DrawerContext.tsx` - Context Provider global
- `hooks/useDrawer.ts` - Hook de consumo
- `components/GlobalDrawer/GlobalDrawer.tsx` - Drawer global
- `components/GlobalDrawer/templates/InviteeDetailsContent.tsx` ✅
- `components/GlobalDrawer/templates/OrderDetailsContent.tsx` ✅
- `components/GlobalDrawer/templates/PaymentDetailsContent.tsx` ✅

### Páginas Migradas
- ✅ `app/app/(Modules)/invitados/page.tsx` - **COMPLETAMENTE FUNCIONAL**

---

## 📋 Patrón para Migrar Otras Páginas

### 1. Importar Hook y Template

```tsx
// En el archivo de la página
import { useDrawer } from '@/hooks/useDrawer';
import { [Entity]DetailsContent } from '@/components/GlobalDrawer/templates/[Entity]DetailsContent';
```

### 2. Usar el Hook

```tsx
export default function Page() {
  const { openDrawer, closeDrawer } = useDrawer();

  // ... resto del código
}
```

### 3. Crear Función para Abrir Drawer

```tsx
const handleOpenDetails = (item: Entity) => {
  openDrawer(item, (data) => (
    <EntityDetailsContent
      entity={data}
      onEdit={handleEdit}
      onDelete={(id) => {
        handleDelete(id);
        closeDrawer();
      }}
      // ... otras props necesarias
    />
  ));
};
```

### 4. Agregar Botón "Ver Detalles" en Tabla

```tsx
<TableCell className="text-center">
  <div className="flex justify-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleOpenDetails(item)}
      className="bg-violet-50 hover:bg-violet-100 border-violet-200"
    >
      <Eye className="h-4 w-4 text-violet-600" />
    </Button>
    {/* otros botones... */}
  </div>
</TableCell>
```

### 5. Remover Drawers/Modals Locales

Eliminar componentes específicos como:
- `<InviteeDetailsDrawer />` ❌
- Estados locales `isDrawerOpen`, `selectedItem` ❌
- Funciones `handleCloseDrawer` ❌

---

## 🔨 Templates Pendientes a Crear

### Estructura de Template Base

```tsx
'use client';

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { [Icons] } from 'lucide-react';
import { [Entity] } from '@/entities/[Entity]';

interface [Entity]DetailsContentProps {
  [entity]: [Entity];
  // ... otras props necesarias
}

export function [Entity]DetailsContent({ [entity] }: [Entity]DetailsContentProps) {
  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-full">
            <[Icon] className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <SheetTitle className="text-2xl font-bold text-violet-900">
              {[entity].name}
            </SheetTitle>
            <SheetDescription className="text-violet-600">
              {/* info secundaria */}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <Separator className="my-4" />

      <div className="space-y-6">
        {/* Secciones de información */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-violet-100">
          <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
            <[Icon] className="h-5 w-5 text-violet-600" />
            Sección de Detalles
          </h3>
          {/* Contenido */}
        </div>
      </div>
    </>
  );
}
```

---

## 📝 Páginas Pendientes de Migrar

### 1. Orders (`app/app/(Modules)/orders/page.tsx`)
- ✅ Template creado: `OrderDetailsContent.tsx`
- ⏳ Migrar página (usar patrón arriba)
- Buscar Modal actual y reemplazar por drawer

### 2. Pagos (`app/app/(Modules)/pagos/page.tsx`)
- ✅ Template creado: `PaymentDetailsContent.tsx`
- ⏳ Migrar página

### 3. Combos (`app/app/(Modules)/combos/page.tsx`)
- ⏳ Crear template: `ComboDetailsContent.tsx`
- ⏳ Migrar página
- Agregar botón Eye en acciones

### 4. Events (`app/app/(Modules)/events/page.tsx`)
- ⏳ Crear template: `EventDetailsContent.tsx`
- ⏳ Migrar página

### 5. Users (`app/app/(Modules)/users/page.tsx`)
- ⏳ Crear template: `UserDetailsContent.tsx`
- ⏳ Migrar página

### 6. Presales (`app/app/(Modules)/presales/page.tsx`)
- ⏳ Crear template: `PreSaleDetailsContent.tsx`
- ⏳ Migrar página

---

## 🎨 Diseño Consistente

Todos los templates deben seguir:
- **Color principal**: `violet` (`#8b3fff`)
- **Fondos**: `bg-white/70 backdrop-blur-sm`
- **Bordes**: `border-violet-100`
- **Títulos**: `text-violet-900`
- **Iconos**: `text-violet-600` en círculos `bg-violet-100`
- **Separadores**: Usar `<Separator />` de shadcn

---

## ✨ Beneficios del Sistema

1. ✅ Un solo drawer global para toda la app
2. ✅ No duplicar lógica de estado
3. ✅ Consistencia visual en todos los módulos
4. ✅ Fácil agregar nuevos tipos de detalles
5. ✅ Mobile-friendly (Sheet de shadcn es responsive)
6. ✅ Reducción de código en páginas individuales

---

## 🚀 Uso Rápido

```tsx
import { useDrawer } from '@/hooks/useDrawer';
import { MyDetailsContent } from '@/components/GlobalDrawer/templates/MyDetailsContent';

function MyPage() {
  const { openDrawer } = useDrawer();

  return (
    <Button onClick={() => openDrawer(data, (d) => <MyDetailsContent item={d} />)}>
      Ver Detalles
    </Button>
  );
}
```
