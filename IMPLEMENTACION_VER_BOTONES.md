# ✅ Implementación de Botones "Ver Detalles" - Estado Actual

## 🎯 Sistema Global Completado

### ✅ Infraestructura Base (100%)
- ✅ DrawerContext con provider global
- ✅ Hook useDrawer para consumo
- ✅ GlobalDrawer component integrado en layout
- ✅ Sistema funcionando en producción

---

## 📦 Templates Creados (100% - 7/7)

### ✅ Templates Completados
1. ✅ **InviteeDetailsContent.tsx** - Detalles completos de invitados
2. ✅ **OrderDetailsContent.tsx** - Información de órdenes
3. ✅ **PaymentDetailsContent.tsx** - Detalles de pagos
4. ✅ **ComboDetailsContent.tsx** - Información de combos con precios y preventas
5. ✅ **EventDetailsContent.tsx** - Detalles de eventos con días dinámicos
6. ✅ **UserDetailsContent.tsx** - Perfiles de usuarios con roles
7. ✅ **PreSaleDetailsContent.tsx** - Preventas con descuentos y stats

Todos los templates siguen el diseño consistente:
- Color violeta (`#8b3fff`) como principal
- Fondos con `bg-white/70 backdrop-blur-sm`
- Bordes `border-violet-100`
- Iconos en círculos `bg-violet-100`
- Secciones bien organizadas

---

## 🔧 Páginas Actualizadas

### ✅ COMPLETADAS (2/8)

#### 1. ✅ **Invitados** (`app/app/(Modules)/invitados/page.tsx`)
- **Estado**: 100% completado y funcional
- Botón "Ver" con ícono Eye
- Drawer global integrado
- Funciona en desktop y mobile
- Template: InviteeDetailsContent

#### 2. ✅ **Pagos** (`app/app/(Modules)/pagos/page.tsx`)
- **Estado**: 100% completado
- Botón "Ver Detalles" agregado al dropdown
- Desktop y mobile actualizados
- Template: PaymentDetailsContent
- Imports agregados ✅
- Hook useDrawer integrado ✅
- Función handleOpenDetails ✅
- Dropdown actualizado con opción "Ver" ✅

### 🔶 EN PROGRESO (1/8)

#### 3. 🔶 **Combos** (`app/app/(Modules)/combos/page.tsx`)
- **Estado**: 60% completado
- ✅ Imports agregados (useDrawer, Eye, ComboDetailsContent)
- ✅ Hook useDrawer declarado
- ✅ Estado isDetailsDialogOpen removido
- ⏳ PENDIENTE: Agregar función handleOpenDetails
- ⏳ PENDIENTE: Agregar botón Eye en tabla
- ⏳ PENDIENTE: Remover Dialog de detalles viejo

---

### ⏳ PENDIENTES (5/8)

#### 4. ⏳ **Events** (`app/app/(Modules)/events/page.tsx`)
**Pasos necesarios:**
```tsx
// 1. Imports
import { Eye } from 'lucide-react';
import { useDrawer } from '@/hooks/useDrawer';
import { EventDetailsContent } from '@/components/GlobalDrawer/templates/EventDetailsContent';

// 2. Hook
const { openDrawer } = useDrawer();

// 3. Función handler
const handleOpenDetails = (event: Event) => {
  openDrawer(event, (data) => (
    <EventDetailsContent event={data} />
  ));
};

// 4. Botón en tabla (agregar antes de Edit)
<Button
  variant="outline"
  size="sm"
  onClick={() => handleOpenDetails(event)}
  className="bg-violet-50 hover:bg-violet-100 border-violet-200"
>
  <Eye className="h-4 w-4 text-violet-600" />
</Button>
```

#### 5. ⏳ **Users** (`app/app/(Modules)/users/page.tsx`)
**Pasos necesarios:**
```tsx
// Imports
import { Eye } from 'lucide-react';
import { useDrawer } from '@/hooks/useDrawer';
import { UserDetailsContent } from '@/components/GlobalDrawer/templates/UserDetailsContent';

// Hook y función
const { openDrawer } = useDrawer();
const handleOpenDetails = (user: User) => {
  openDrawer(user, (data) => <UserDetailsContent user={data} />);
};

// Botón Eye en acciones
```

#### 6. ⏳ **PreSales** (`app/app/(Modules)/presales/page.tsx`)
**Pasos necesarios:**
```tsx
// Imports
import { Eye } from 'lucide-react';
import { useDrawer } from '@/hooks/useDrawer';
import { PreSaleDetailsContent } from '@/components/GlobalDrawer/templates/PreSaleDetailsContent';

// Hook y función
const { openDrawer } = useDrawer();
const handleOpenDetails = (preSale: PreSale) => {
  openDrawer(preSale, (data) => <PreSaleDetailsContent preSale={data} />);
};
```

#### 7. ⏳ **Orders** (`app/app/(Modules)/orders/page.tsx`)
**IMPORTANTE**: Esta página usa Mantine UI, no shadcn
- Usa `ActionIcon` en lugar de `Button`
- Usa Modal de Mantine (línea ~345-349 ya tiene eye icon)
- **Acción**: Reemplazar modal actual por drawer global

```tsx
// Imports
import { Eye } from 'lucide-react';
import { useDrawer } from '@/hooks/useDrawer';
import { OrderDetailsContent } from '@/components/GlobalDrawer/templates/OrderDetailsContent';

// Reemplazar ActionIcon eye actual con drawer
const handleOpenDetails = (order: Order) => {
  openDrawer(order, (data) => <OrderDetailsContent order={data} />);
};
```

#### 8. ⏳ **Finanzas/Emails** (Revisar si necesitan)
- Verificar si tienen tablas con datos
- Implementar según necesidad

---

## 📋 Patrón de Implementación Rápida

### Para CADA página pendiente:

1. **Agregar imports** (3 líneas):
```tsx
import { Eye } from 'lucide-react';
import { useDrawer } from '@/hooks/useDrawer';
import { [Entity]DetailsContent } from '@/components/GlobalDrawer/templates/[Entity]DetailsContent';
```

2. **Declarar hook** (1 línea):
```tsx
const { openDrawer } = useDrawer();
```

3. **Crear función handler** (5 líneas):
```tsx
const handleOpenDetails = (item: Entity) => {
  openDrawer(item, (data) => (
    <EntityDetailsContent entity={data} />
  ));
};
```

4. **Agregar botón** (en tabla o dropdown):
```tsx
<Button variant="outline" size="sm" onClick={() => handleOpenDetails(item)}>
  <Eye className="h-4 w-4 text-violet-600" />
</Button>
```

5. **Repetir para mobile** si aplica

---

## 🎯 Próximos Pasos Inmediatos

### Orden Recomendado:

1. **Completar Combos** (ya está 60% hecho)
   - Agregar handleOpenDetails
   - Agregar botón Eye
   - Remover Dialog viejo

2. **Events** (simple, solo botón)
3. **Users** (simple, solo botón)
4. **PreSales** (simple, solo botón)
5. **Orders** (más complejo, requiere cambiar de Modal a Drawer)

---

## ✨ Resultado Final Esperado

Al completar:
- ✅ 8 páginas con botón "Ver Detalles"
- ✅ 7 templates reutilizables
- ✅ UX consistente en toda la app
- ✅ Drawer global único
- ✅ Sin código duplicado
- ✅ Mobile-friendly

---

## 📝 Notas Técnicas

- **Drawer se abre desde cualquier página** usando el mismo Context
- **Templates son independientes** y pueden evolucionar sin afectar otros
- **Diseño consistente** con colores violeta en toda la app
- **Performance optimizada** con un solo drawer global
- **Código limpio** sin states locales duplicados

---

**Estado General**: 37.5% completado (3/8 páginas)
**Templates**: 100% completados
**Sistema Base**: 100% funcional
