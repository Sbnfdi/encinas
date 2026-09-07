import React from 'react';

export interface BrandLogoProps {
  /**
   * 'icon' = only the signature 'E' arrow mark
   * 'full' = symbol + ENCINAS text
   * 'badge' = official uploaded badge with original cream background & subtle border
   */
  variant?: 'icon' | 'full' | 'badge';
  /**
   * Color theme: 'gold' (default for dark luxury), 'white' (pure cream), 'original' (chocolate bronze)
   */
  color?: 'gold' | 'white' | 'original';
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'icon',
  color = 'gold',
  size = 28,
  className = '',
  style = {},
  alt = 'ENCINAS Dubai',
}) => {
  let src = '/brand/encinas-icon-gold.png';

  if (variant === 'badge') {
    src = '/brand/logo-badge.png';
  } else if (variant === 'full') {
    if (color === 'white') src = '/brand/encinas-logo-white-cropped.png';
    else if (color === 'original') src = '/brand/encinas-logo-original-cropped.png';
    else src = '/brand/encinas-logo-gold-cropped.png';
  } else {
    // variant === 'icon'
    if (color === 'white') src = '/brand/encinas-icon-white.png';
    else if (color === 'original') src = '/brand/encinas-icon-original.png';
    else src = '/brand/encinas-icon-gold.png';
  }

  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src={src}
      alt={alt}
      width={variant === 'full' ? undefined : size}
      height={size}
      className={`brand-logo select-none ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        height: dimension,
        width: variant === 'full' ? 'auto' : dimension,
        objectFit: 'contain',
        filter: color === 'gold' ? 'drop-shadow(0 0 6px rgba(197, 160, 89, 0.25))' : undefined,
        borderRadius: variant === 'badge' ? '4px' : undefined,
        ...style,
      }}
      loading="eager"
    />
  );
};

export default BrandLogo;
