'use client';

import React from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';

type Props = {
  href?: string | UrlObject;
  label: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  colorScheme?: 'primary' | 'secondary';
  containerStyle?: React.CSSProperties;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
};

const Spinner: React.FC<{ color?: string }> = ({ color = 'currentColor' }) => (
  <>
    <style>{`@keyframes button-spin{to{transform:rotate(360deg);}}`}</style>
    <span
      style={{
        width: 18,
        height: 18,
        border: '2px solid transparent',
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'button-spin 0.8s linear infinite',
        flexShrink: 0,
      }}
      aria-hidden
    />
  </>
);

export const Button: React.FC<Props> = ({
  label,
  style,
  onClick,
  href = '#',
  containerStyle,
  colorScheme = 'primary',
  disabled = false,
  loading = false,
  loadingLabel,
  className = '',
}) => {
  const isDisabled = disabled || loading;
  const disabledStyle: React.CSSProperties = isDisabled
    ? { opacity: 0.7, cursor: 'not-allowed' }
    : {};

  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: 50,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    color:
      colorScheme === 'primary'
        ? 'var(--white-color)'
        : 'var(--main-turquoise)',
    textTransform: 'capitalize',
    fontWeight: 'var(--fw-semibold)',
    border: '1px solid var(--main-turquoise)',
    background:
      colorScheme === 'primary' ? 'var(--main-turquoise)' : 'transparent',
  };

  if (href && href !== '#') {
    return (
      <Link
        href={isDisabled ? '#' : href}
        style={{ ...baseStyle, ...disabledStyle, ...style }}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) onClick();
        }}
        className={`custom-button ${className}`.trim()}
      >
        {loading ? (
          <>
            <Spinner color={colorScheme === 'primary' ? 'var(--white-color)' : 'var(--main-turquoise)'} />
            {loadingLabel && <span style={{ color: 'inherit' }}>{loadingLabel}</span>}
          </>
        ) : (
          label
        )}
      </Link>
    );
  }

  return (
    <div style={containerStyle}>
      <button
        style={{ ...baseStyle, ...disabledStyle, ...style }}
        onClick={onClick}
        disabled={isDisabled}
        className={`custom-button ${className}`.trim()}
      >
        {loading ? (
          <>
            <Spinner color={colorScheme === 'primary' ? 'var(--white-color)' : 'var(--main-turquoise)'} />
            {loadingLabel && <span style={{ color: 'inherit' }}>{loadingLabel}</span>}
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
};
