import React from 'react';

/**
 * Button component — inspired by Untitled UI design system.
 *
 * Variants (color prop):
 *  - "primary"              → Red Orange (#FF4628) solid — main CTA
 *  - "secondary"            → White + Metallic Silver border — outline style
 *  - "tertiary"             → Ghost, no border — subtle action
 *  - "primary-destructive"  → Red Orange semi-transparent with red text — destructive action
 *  - "secondary-destructive"→ White + red text + red border — secondary destructive
 *
 * Sizes: "sm" | "md" | "lg"
 */

const colorStyles = {
  primary: `
    bg-[#FF4628] text-white border border-[#FF4628]
    hover:bg-[#e03d22] hover:border-[#e03d22]
    active:bg-[#c4361d]
    focus-visible:ring-2 focus-visible:ring-[#FF4628]/40
    shadow-sm
  `,
  secondary: `
    bg-white text-[#202020] border border-[#B9C8D7]/50
    hover:bg-[#F5F5F5] hover:border-[#B9C8D7]
    active:bg-[#EAECF0]
    focus-visible:ring-2 focus-visible:ring-[#B9C8D7]/40
    shadow-sm
  `,
  tertiary: `
    bg-transparent text-[#B9C8D7] border border-transparent
    hover:bg-[#F5F5F5] hover:text-[#202020]
    active:bg-[#EAECF0]
    focus-visible:ring-2 focus-visible:ring-[#B9C8D7]/40
  `,
  'primary-destructive': `
    bg-[#FF4628]/10 text-[#FF4628] border border-[#FF4628]/20
    hover:bg-[#FF4628]/20 hover:border-[#FF4628]/40
    active:bg-[#FF4628]/30
    focus-visible:ring-2 focus-visible:ring-[#FF4628]/30
  `,
  'secondary-destructive': `
    bg-white text-[#FF4628] border border-[#FF4628]/30
    hover:bg-[#FF4628]/5 hover:border-[#FF4628]/50
    active:bg-[#FF4628]/10
    focus-visible:ring-2 focus-visible:ring-[#FF4628]/30
    shadow-sm
  `,
};

const sizeStyles = {
  sm: 'px-[14px] py-[7px] text-[12px] gap-[6px] rounded-[8px]',
  md: 'px-[16px] py-[9px] text-[13px] gap-[7px] rounded-[10px]',
  lg: 'px-[20px] py-[11px] text-[14px] gap-[8px] rounded-[10px]',
};

const iconSize = {
  sm: 14,
  md: 16,
  lg: 18,
};

const Button = ({
  color = 'primary',
  size = 'md',
  iconLeading,
  iconTrailing,
  children,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  id,
}) => {
  const colorCls = colorStyles[color] || colorStyles.primary;
  const sizeCls = sizeStyles[size] || sizeStyles.md;
  const iSize = iconSize[size] || 16;

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-bold
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        focus-visible:outline-none
        ${sizeCls} ${colorCls} ${className}
      `}
    >
      {iconLeading && (
        <span className="shrink-0 flex items-center">
          {React.cloneElement(iconLeading, { size: iSize, strokeWidth: 2 })}
        </span>
      )}
      {children}
      {iconTrailing && (
        <span className="shrink-0 flex items-center">
          {React.cloneElement(iconTrailing, { size: iSize, strokeWidth: 2 })}
        </span>
      )}
    </button>
  );
};

export default Button;
