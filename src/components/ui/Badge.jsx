import React from 'react';

const variantStyles = {
  default: {
    wrapper: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-500',
  },
  primary: {
    wrapper: 'bg-indigo-50 text-indigo-700',
    dot: 'bg-indigo-500',
  },
  success: {
    wrapper: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  error: {
    wrapper: 'bg-red-50 text-red-700',
    dot: 'bg-red-500',
  },
  warning: {
    wrapper: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  // Backward compatibility
  gray: {
    wrapper: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-500',
  },
  safe: {
    wrapper: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  danger: {
    wrapper: 'bg-red-50 text-red-700',
    dot: 'bg-red-500',
  },
};

const Badge = ({
  variant = 'default',
  dot = false,
  children,
  className = '',
}) => {
  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold
        rounded-full px-3 py-1 text-[11px] uppercase tracking-wide
        ${styles.wrapper} ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
