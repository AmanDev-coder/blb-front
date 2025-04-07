import React from 'react';

/**
 * Font component for consistent typography
 * Guarantees the correct font application for different text elements
 * 
 * @param {Object} props - Component props
 * @param {string} props.family - 'primary' (Poppins) or 'secondary' (Work Sans)
 * @param {string} props.weight - font weight (light, normal, medium, semibold, bold)
 * @param {string} props.size - font size (xs, sm, base, md, lg, xl, 2xl, 3xl, 4xl)
 * @param {string} props.as - HTML element to render (h1, h2, p, span, etc.)
 * @param {string} props.color - text color (optional)
 * @param {string} props.className - additional CSS classes
 * @param {React.ReactNode} props.children - content to render
 */
const Font = ({
  family = 'primary',
  weight = 'normal',
  size = 'base',
  as: Component = 'span',
  color,
  className = '',
  children,
  ...props
}) => {
  // Map weights to CSS variables
  const weightMap = {
    light: 'var(--font-weight-light)',
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  };

  // Map sizes to CSS variables
  const sizeMap = {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    md: 'var(--font-size-md)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
  };

  // Build inline style with CSS variables
  const style = {
    fontFamily: family === 'primary' 
      ? 'var(--font-family-primary)' 
      : 'var(--font-family-secondary)',
    fontWeight: weightMap[weight] || weightMap.normal,
    fontSize: sizeMap[size] || sizeMap.base,
    color: color ? `var(--color-${color})` : '',
    ...props.style,
  };

  // Additional classes for font family
  const fontClass = family === 'secondary' ? 'secondary-font' : '';

  return (
    <Component 
      className={`${fontClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Heading component for consistent heading styles
 */
export const Heading = ({ 
  level = 1, 
  family = 'primary',
  weight = 'bold',
  className = '',
  ...props 
}) => {
  const Component = `h${level}`;
  
  return (
    <Font 
      as={Component}
      family={family}
      weight={weight}
      size={level <= 1 ? '3xl' : level === 2 ? '2xl' : level === 3 ? 'xl' : level === 4 ? 'lg' : 'md'}
      className={`heading heading-${level} ${className}`}
      {...props}
    />
  );
};

/**
 * Text component for consistent paragraph styles
 */
export const Text = ({ 
  size = 'base',
  family = 'primary',
  ...props 
}) => {
  return (
    <Font 
      as="p"
      family={family}
      size={size}
      {...props}
    />
  );
};

/**
 * Label component for form labels and small texts
 */
export const Label = ({
  size = 'sm',
  weight = 'medium',
  htmlFor,
  ...props
}) => {
  return (
    <Font
      as="label"
      htmlFor={htmlFor}
      family="primary"
      size={size}
      weight={weight}
      {...props}
    />
  );
};

export default Font; 