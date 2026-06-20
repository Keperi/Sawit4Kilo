import React from 'react';

const variantStyles = {
  brand: {
    wrapper: 'bg-orange-50 border-orange-100',
    icon: 'text-kideco-orange',
  },
  success: {
    wrapper: 'bg-emerald-50 border-emerald-100',
    icon: 'text-emerald-600',
  },
  error: {
    wrapper: 'bg-red-50 border-red-100',
    icon: 'text-red-500',
  },
  warning: {
    wrapper: 'bg-amber-50 border-amber-100',
    icon: 'text-amber-600',
  },
  gray: {
    wrapper: 'bg-gray-100 border-gray-200',
    icon: 'text-gray-500',
  },
  primary: {
    wrapper: 'bg-orange-50 border-orange-100',
    icon: 'text-kideco-orange',
  },
};

const sizeStyles = {
  sm: { wrapper: 'w-9 h-9 rounded-xl',  iconSize: 16 },
  md: { wrapper: 'w-11 h-11 rounded-xl', iconSize: 20 },
  lg: { wrapper: 'w-12 h-12 rounded-2xl', iconSize: 24 },
  xl: { wrapper: 'w-14 h-14 rounded-2xl', iconSize: 28 },
};

const FeaturedIcon = ({ variant = 'brand', size = 'md', icon: Icon, className = '' }) => {
  const varStyle = variantStyles[variant] || variantStyles.brand;
  const sizeStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      className={`
        flex items-center justify-center flex-shrink-0 border transition-colors
        ${varStyle.wrapper} ${sizeStyle.wrapper} ${className}
      `}
    >
      {Icon && (
        <Icon
          size={sizeStyle.iconSize}
          strokeWidth={2}
          className={varStyle.icon}
        />
      )}
    </div>
  );
};

export default FeaturedIcon;
