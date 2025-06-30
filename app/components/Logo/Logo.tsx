import { forwardRef } from 'react';
import { Box, type BoxProps } from '@mantine/core';
import Image from 'next/image';

interface LogoProps extends BoxProps {
  size?: number;
  width?: number;
  height?: number;
  alt?: string;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ 
    size = 40, 
    width = size,
    height = size,
    alt = 'Logo',
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
          src="/images/logo.webp"
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
