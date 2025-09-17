// Theme configuration with the specified color palette
// 3D52A0 - Deep Blue (Primary)
// 7091E6 - Bright Blue (Secondary)
// 8697C4 - Muted Blue (Tertiary)
// ADBBDA - Light Blue-Gray (Background)
// EDE8F5 - Pale Lavender (Light Background)

const theme = {
  colors: {
    primary: '#3D52A0',
    secondary: '#7091E6',
    tertiary: '#8697C4',
    background: '#ADBBDA',
    lightBackground: '#EDE8F5',
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      100: '#F7F9FC',
      200: '#EDF2F7',
      300: '#E2E8F0',
      400: '#CBD5E0',
      500: '#A0AEC0',
      600: '#718096',
      700: '#4A5568',
      800: '#2D3748',
      900: '#1A202C',
    },
  },
  gradients: {
    primary: 'linear-gradient(to right, #3D52A0, #7091E6)',
    secondary: 'linear-gradient(to right, #7091E6, #8697C4)',
    tertiary: 'linear-gradient(to right, #8697C4, #ADBBDA)',
    light: 'linear-gradient(to right, #ADBBDA, #EDE8F5)',
    full: 'linear-gradient(to right, #3D52A0, #7091E6, #8697C4, #ADBBDA, #EDE8F5)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(61, 82, 160, 0.05)',
    md: '0 4px 6px -1px rgba(61, 82, 160, 0.1), 0 2px 4px -1px rgba(61, 82, 160, 0.06)',
    lg: '0 10px 15px -3px rgba(61, 82, 160, 0.1), 0 4px 6px -2px rgba(61, 82, 160, 0.05)',
    xl: '0 20px 25px -5px rgba(61, 82, 160, 0.1), 0 10px 10px -5px rgba(61, 82, 160, 0.04)',
    '2xl': '0 25px 50px -12px rgba(61, 82, 160, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(61, 82, 160, 0.06)',
    outline: '0 0 0 3px rgba(112, 145, 230, 0.5)',
    none: 'none',
  },
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
};

export default theme; 