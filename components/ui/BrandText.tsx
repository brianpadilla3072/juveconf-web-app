import { BRANDING_CONFIG, getOrgName } from "@/lib/constants";

interface BrandNameProps {
  variant?: "short" | "full";
  className?: string;
}

/**
 * Componente para mostrar el nombre de la organización
 * Usa BRANDING_CONFIG para obtener el nombre dinámicamente
 *
 * @example
 * <BrandName /> // "Consagrados"
 * <BrandName variant="full" /> // "Movimiento Consagrados"
 */
export const BrandName = ({
  variant = "short",
  className = ""
}: BrandNameProps) => {
  const name = getOrgName(variant === "full");

  return <span className={className}>{name}</span>;
};

/**
 * Componente para obtener solo el nombre como string
 */
export const useBrandName = (full = false): string => {
  return getOrgName(full);
};

export default BrandName;
