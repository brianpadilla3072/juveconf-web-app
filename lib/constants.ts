/**
 * Configuración centralizada de la aplicación JuveConf
 * Este archivo centraliza nombres, colores y configuraciones clave del proyecto
 */

// ==================== NOMBRE DEL PROYECTO ====================
export const APP_CONFIG = {
  // Nombres de la aplicación
  name: "JuveConf",
  fullName: "Juventud en Conferencia",
  shortName: "JuveConf",
  description:
    "Aplicación para la gestión de eventos juveniles, finanzas y administración de la organización Juventud en Conferencia",

  // URLs
  websiteUrl: "https://juveconf.org",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3072",

  // Metadatos
  keywords: [
    "juveconf",
    "juventud",
    "conferencia",
    "eventos",
    "finanzas",
    "religioso",
    "administración",
  ],
  author: "Juventud en Conferencia",
} as const;

// ==================== PALETA DE COLORES ====================
export const COLORS = {
  // Colores principales
  primary: {
    DEFAULT: "#8b3fff", // Azul principal
    50: "#E6F2FF",
    100: "#CCE5FF",
    200: "#99CCFF",
    300: "#66B2FF",
    400: "#3399FF",
    500: "#8b3fff", // Principal
    600: "#0052A3",
    700: "#003D7A",
    800: "#002952",
    900: "#001429",
  },

  // Color secundario/acento
  secondary: {
    DEFAULT: "#00B4D8", // Azul cyan/acento
    50: "#E6F7FB",
    100: "#CCF0F7",
    200: "#99E0EF",
    300: "#66D1E7",
    400: "#33C1DF",
    500: "#00B4D8", // Acento
    600: "#0090AD",
    700: "#006C82",
    800: "#004856",
    900: "#00242B",
  },

  // Colores de utilidad
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Grises
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E6E6E6",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },

  // Colores especiales para meta tags (formato hex)
  meta: {
    themeColor: "#8b3fff",
    tileColor: "#8b3fff",
    statusBarColor: "#003D7A",
  },
} as const;

// ==================== ESTILOS DE SCROLLBAR ====================
export const SCROLLBAR_COLORS = {
  thumb: "rgba(0, 102, 204, 0.5)", // primary-500 con opacidad
  thumbHover: "rgba(0, 61, 122, 0.7)", // primary-700 con opacidad
  track: "transparent",
} as const;

// ==================== VARIABLES CSS (para uso en tailwind/CSS) ====================
export const CSS_VARIABLES = {
  light: {
    // Colores base HSL para CSS variables
    "color-primary-500": "210 100% 40%", // #8b3fff en HSL
    "color-primary-400": "210 100% 60%", // Más claro
    "color-primary-600": "210 100% 32%", // Más oscuro
    "color-secondary-500": "191 100% 42%", // #00B4D8 en HSL
    "color-secondary-600": "191 100% 34%",
    "color-blue-900": "210 100% 14%", // Azul muy oscuro
    "color-blue-800": "210 100% 20%",
  },
  dark: {
    // Valores para modo oscuro (si se necesita)
  },
} as const;

// ==================== CONFIGURACIÓN DE PWA ====================
export const PWA_CONFIG = {
  startUrl: "/",
  display: "standalone",
  backgroundColor: "#ffffff",
  themeColor: COLORS.meta.themeColor,
  orientation: "portrait-primary",
  scope: "/",
  lang: "es",
  dir: "ltr",
  categories: ["productivity", "business", "events"],
} as const;

// ==================== CONFIGURACIÓN DE MARCA ====================
export const BRANDING_CONFIG = {
  // Organización
  organizationName: "JuveConf",
  organizationFullName: "Juventud en Conferencia",

  // Logos y Assets
  logo: {
    // Logo principal (puede ser SVG inline o ruta a imagen)
    src: "/images/logo.webp",
    alt: "Logo JuveConf",
    width: 40,
    height: 40,
  },

  // Favicon y meta icons
  favicon: {
    ico: "/favicon.ico",
    svg: "/icon.svg",
    apple: "/apple-icon.png",
  },

  // Loading spinner
  loading: {
    iconType: "loader2" as const, // "loader2" | "spinner" | "custom"
    color: "violet-500", // Tailwind class o hex
    colorHex: "#8B3FFF", // Valor hex del color
    customSvg: null as string | null, // Para SVG personalizado
  },

  // Colores de marca (override de COLORS si es necesario)
  brandColors: {
    primary: "#8b3fff",      // Azul JuveConf
    secondary: "#00B4D8",    // Cyan
    accent: "#8B3FFF",       // Violeta (para botones/CTAs)
    accentGreen: "#CCFF00",  // Verde lima (usar con moderación)
    text: {
      primary: "#1F2937",    // Gris oscuro
      secondary: "#6B7280",  // Gris medio
      light: "#9CA3AF",      // Gris claro
    }
  }
} as const;

// ==================== CONFIGURACIÓN DE TEMA ====================
export const THEME_CONFIG = {
  // Fuentes
  fonts: {
    heading: "Arial, Helvetica, sans-serif",
    body: "Arial, Helvetica, sans-serif",
    mono: "Courier New, monospace",
  },

  // Border radius
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  // Animaciones
  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
    }
  }
} as const;

// ==================== HELPERS ====================
/**
 * Obtiene el color de marca por tipo
 */
export const getBrandColor = (type: 'primary' | 'secondary' | 'accent' = 'primary'): string => {
  return BRANDING_CONFIG.brandColors[type];
};

/**
 * Obtiene el color del loading spinner
 */
export const getLoadingColor = (): string => {
  return BRANDING_CONFIG.loading.colorHex;
};

/**
 * Obtiene la ruta del logo
 */
export const getLogoSrc = (): string => {
  return BRANDING_CONFIG.logo.src;
};

/**
 * Obtiene el nombre de la organización
 */
export const getOrgName = (full = false): string => {
  return full ? BRANDING_CONFIG.organizationFullName : BRANDING_CONFIG.organizationName;
};

// ==================== EXPORTACIONES DE CONVENIENCIA ====================
export const { name: APP_NAME, fullName: APP_FULL_NAME, shortName: APP_SHORT_NAME } = APP_CONFIG;
export const PRIMARY_COLOR = COLORS.primary.DEFAULT;
export const SECONDARY_COLOR = COLORS.secondary.DEFAULT;
export const THEME_COLOR = COLORS.meta.themeColor;
export const ORG_NAME = BRANDING_CONFIG.organizationName;
export const ORG_FULL_NAME = BRANDING_CONFIG.organizationFullName;
export const LOGO_SRC = BRANDING_CONFIG.logo.src;
export const ACCENT_COLOR = BRANDING_CONFIG.brandColors.accent;
