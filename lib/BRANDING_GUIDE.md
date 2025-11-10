# 🎨 Guía de Configuración de Marca (Branding)

Esta guía explica cómo personalizar completamente el branding de la aplicación JuveConf desde un solo archivo de configuración.

## 📍 Ubicación del Archivo de Configuración

**`lib/constants.ts`** - Archivo centralizado de configuración

---

## 🔧 Cómo Cambiar el Branding

### 1. 🖼️ Logo de la Organización

#### Cambiar el logo:
```typescript
// En lib/constants.ts, busca BRANDING_CONFIG.logo
logo: {
  src: "/images/nuevo-logo.png",  // ← Cambia la ruta aquí
  alt: "Mi Organización",          // ← Cambia el alt text
  width: 50,                        // ← Ajusta el ancho (opcional)
  height: 50,                       // ← Ajusta el alto (opcional)
}
```

**Paso adicional:**
1. Coloca tu nueva imagen en `public/images/nuevo-logo.png`
2. Formatos soportados: `.png`, `.jpg`, `.webp`, `.svg`
3. Tamaño recomendado: 40x40px a 100x100px

#### Resultado:
El logo se actualizará automáticamente en:
- ✅ Sidebar del dashboard
- ✅ Página de login
- ✅ Todas las vistas de la aplicación

---

### 2. 📛 Nombre de la Organización

#### Cambiar el nombre:
```typescript
// En lib/constants.ts, busca BRANDING_CONFIG
BRANDING_CONFIG = {
  organizationName: "Mi Organización",              // ← Nombre corto
  organizationFullName: "Mi Organización Completa", // ← Nombre completo
}
```

#### Uso en componentes:
```typescript
import { ORG_NAME, ORG_FULL_NAME } from "@/lib/constants";
import { BrandName } from "@/components/ui/BrandText";

// Opción 1: Usar la constante directamente
<span>{ORG_NAME}</span>

// Opción 2: Usar el componente
<BrandName />                    // Muestra nombre corto
<BrandName variant="full" />     // Muestra nombre completo
```

#### Resultado:
El nombre se actualizará en:
- ✅ Sidebar (nombre corto)
- ✅ Footer (nombre completo)
- ✅ Metadata SEO
- ✅ Títulos de página

---

### 3. 🎨 Colores de Marca

#### Paleta de colores principal:
```typescript
// En lib/constants.ts, busca BRANDING_CONFIG.brandColors
brandColors: {
  primary: "#8b3fff",      // ← Color primario (azul por defecto)
  secondary: "#00B4D8",    // ← Color secundario (cyan)
  accent: "#F97316",       // ← Color de acento (naranja para CTAs)
  text: {
    primary: "#1F2937",    // ← Texto principal
    secondary: "#6B7280",  // ← Texto secundario
    light: "#9CA3AF",      // ← Texto claro
  }
}
```

#### Uso de colores en código:
```typescript
import { getBrandColor, BRANDING_CONFIG } from "@/lib/constants";

// Opción 1: Usar helper function
const accentColor = getBrandColor('accent');  // Retorna "#F97316"

// Opción 2: Acceder directamente
const primaryColor = BRANDING_CONFIG.brandColors.primary;

// Opción 3: En JSX con inline style
<div style={{ color: getBrandColor('accent') }}>
  Texto con color de marca
</div>

// Opción 4: Usar clase Tailwind (requiere config)
<div className="text-brand-accent">
  Texto con color de marca
</div>
```

#### Colores disponibles en Tailwind:
Después de la configuración, puedes usar:
- `bg-brand-primary` - Fondo con color primario
- `text-brand-accent` - Texto con color de acento
- `border-brand-secondary` - Borde con color secundario

---

### 4. ⏳ Loading Spinner

#### Configurar el spinner de carga:
```typescript
// En lib/constants.ts, busca BRANDING_CONFIG.loading
loading: {
  iconType: "loader2",       // ← Tipo de ícono (loader2, spinner, custom)
  color: "blue-500",         // ← Clase Tailwind del color
  colorHex: "#3B82F6",       // ← Valor hexadecimal del color
  customSvg: null,           // ← SVG personalizado (opcional)
}
```

#### Ejemplo con custom SVG:
```typescript
loading: {
  iconType: "custom",
  colorHex: "#F97316",
  customSvg: `<svg>...</svg>`,  // Tu SVG personalizado
}
```

#### Resultado:
El loading spinner se actualizará en:
- ✅ Carga inicial de páginas
- ✅ Formularios (al enviar datos)
- ✅ Tablas (al cargar datos)
- ✅ Diálogos y modales

---

### 5. 🎭 Favicon y Meta Icons

#### Configurar iconos del navegador:
```typescript
// En lib/constants.ts, busca BRANDING_CONFIG.favicon
favicon: {
  ico: "/favicon.ico",        // ← Favicon clásico
  svg: "/icon.svg",           // ← Ícono SVG
  apple: "/apple-icon.png",   // ← Ícono para Apple devices
}
```

**Pasos adicionales:**
1. Genera tus iconos en diferentes tamaños
2. Colócalos en `public/`
3. Actualiza las rutas en `BRANDING_CONFIG.favicon`

---

## 🎨 Temas y Estilos Avanzados

### Fuentes Tipográficas

```typescript
// En lib/constants.ts, busca THEME_CONFIG.fonts
fonts: {
  heading: "Arial, Helvetica, sans-serif",  // ← Fuente para títulos
  body: "Arial, Helvetica, sans-serif",     // ← Fuente para texto
  mono: "Courier New, monospace",           // ← Fuente monoespaciada
}
```

### Border Radius (Bordes Redondeados)

```typescript
borderRadius: {
  sm: "0.25rem",    // ← Radio pequeño
  md: "0.5rem",     // ← Radio medio
  lg: "0.75rem",    // ← Radio grande
  xl: "1rem",       // ← Radio extra grande
  full: "9999px",   // ← Completamente redondo
}
```

### Sombras

```typescript
shadows: {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
}
```

---

## 📚 Funciones Helper Disponibles

### `getBrandColor(type)`
Obtiene un color de la paleta de marca.

```typescript
import { getBrandColor } from "@/lib/constants";

const primaryColor = getBrandColor('primary');   // "#8b3fff"
const accentColor = getBrandColor('accent');     // "#F97316"
const secondaryColor = getBrandColor('secondary'); // "#00B4D8"
```

### `getLogoSrc()`
Obtiene la ruta del logo.

```typescript
import { getLogoSrc } from "@/lib/constants";

const logoPath = getLogoSrc();  // "/images/logo.webp"
```

### `getOrgName(full?)`
Obtiene el nombre de la organización.

```typescript
import { getOrgName } from "@/lib/constants";

const shortName = getOrgName();       // "Consagrados"
const fullName = getOrgName(true);    // "Movimiento Consagrados"
```

### `getLoadingColor()`
Obtiene el color del loading spinner.

```typescript
import { getLoadingColor } from "@/lib/constants";

const spinnerColor = getLoadingColor();  // "#F97316"
```

---

## 🔄 Ejemplo Completo de Cambio de Branding

### Escenario: Cambiar de "Consagrados" a "Nueva Organización"

```typescript
// lib/constants.ts

export const BRANDING_CONFIG = {
  // 1. Cambiar nombres
  organizationName: "Nueva Org",
  organizationFullName: "Nueva Organización Completa",

  // 2. Cambiar logo
  logo: {
    src: "/images/nuevo-logo.png",
    alt: "Logo Nueva Org",
    width: 40,
    height: 40,
  },

  // 3. Cambiar colores
  brandColors: {
    primary: "#4F46E5",      // Indigo
    secondary: "#06B6D4",    // Cyan
    accent: "#F59E0B",       // Amber
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      light: "#9CA3AF",
    }
  },

  // 4. Cambiar loading spinner
  loading: {
    iconType: "loader2",
    color: "indigo-500",
    colorHex: "#6366F1",
    customSvg: null,
  },

  // 5. Cambiar favicon
  favicon: {
    ico: "/nuevo-favicon.ico",
    svg: "/nuevo-icon.svg",
    apple: "/nuevo-apple-icon.png",
  }
}
```

**Resultado:**
¡Todo el sitio actualizado con el nuevo branding! 🎉

---

## ⚠️ Notas Importantes

### Variables CSS
Algunos colores se definen también en `app/globals.css`:
```css
:root {
  --brand-accent: #F97316;
  --scrollbar-thumb: rgba(0, 102, 204, 0.5);
  --scrollbar-thumb-hover: rgba(0, 61, 122, 0.7);
}
```

Actualiza estos valores manualmente si cambias los colores de marca.

### Tailwind Config
Los colores de marca se importan automáticamente en `tailwind.config.ts`:
```typescript
import { BRANDING_CONFIG } from "./lib/constants";

colors: {
  brand: {
    primary: BRANDING_CONFIG.brandColors.primary,
    secondary: BRANDING_CONFIG.brandColors.secondary,
    accent: BRANDING_CONFIG.brandColors.accent,
  },
}
```

### Cache del Navegador
Después de cambiar imágenes (logo, favicon), puede ser necesario:
1. Limpiar cache del navegador (Ctrl + Shift + R)
2. Reiniciar el servidor de desarrollo
3. Hacer un hard refresh en producción

---

## 🎯 Checklist de Cambio de Branding

- [ ] Actualizar `BRANDING_CONFIG.organizationName`
- [ ] Actualizar `BRANDING_CONFIG.organizationFullName`
- [ ] Subir nuevo logo a `public/images/`
- [ ] Actualizar `BRANDING_CONFIG.logo.src`
- [ ] Cambiar `BRANDING_CONFIG.brandColors` (primary, secondary, accent)
- [ ] Actualizar `BRANDING_CONFIG.loading.colorHex`
- [ ] Generar y subir nuevos favicons
- [ ] Actualizar `BRANDING_CONFIG.favicon`
- [ ] Actualizar variables CSS en `globals.css` (opcional)
- [ ] Probar en desarrollo
- [ ] Limpiar cache
- [ ] Desplegar a producción

---

## 🆘 Solución de Problemas

### El logo no se actualiza
1. Verifica que la imagen existe en `public/images/`
2. Limpia cache del navegador
3. Reinicia el servidor (`npm run dev`)

### Los colores no cambian
1. Verifica que `tailwind.config.ts` importa `BRANDING_CONFIG`
2. Reinicia Tailwind CSS
3. Revisa que uses `style={{ color: ... }}` para colores dinámicos

### El loading spinner sigue con el color viejo
1. Actualiza `BRANDING_CONFIG.loading.colorHex`
2. Verifica que `LoadingSpinner` importa desde `@/lib/constants`

---

## 📞 Soporte

Para más ayuda o dudas sobre la configuración de branding:
1. Consulta `lib/constants.ts` - Archivo fuente con comentarios
2. Revisa componentes en `components/ui/` - Ejemplos de uso
3. Lee esta guía completa

**¡Tu aplicación, tu marca!** 🚀
