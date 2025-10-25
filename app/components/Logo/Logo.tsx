import { forwardRef } from 'react';
import { Box, type BoxProps } from '@mantine/core';
import Image from 'next/image';
import { BRANDING_CONFIG } from '@/lib/constants';

interface LogoProps extends BoxProps {
  size?: number;
  width?: number;
  height?: number;
  alt?: string;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({
    size = BRANDING_CONFIG.logo.width,
    width = size,
    height = size,
    alt = BRANDING_CONFIG.logo.alt,
    style,
    ...others
  }, ref) => {
    return (
      <Box
        ref={ref}
        style={{
          position: 'relative',
          width,
          height,
          ...style,
        }}
        {...others}
      >
        <Image
          src={BRANDING_CONFIG.logo.src}
          alt={alt}
          fill
          sizes={`${width}px`}
          style={{
            objectFit: 'contain',
          }}
          priority
        />
      </Box>
    );
  }
);

Logo.displayName = 'Logo';

export default Logo;
