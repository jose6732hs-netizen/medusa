module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        primary: '#3b82f6',
        'primary-dark': '#1e40af',
        secondary: '#10b981',
        'secondary-dark': '#059669',
        accent: '#f59e0b',
        'accent-dark': '#d97706',
        muted: '#e5e7eb',
        'muted-dark': '#9ca3af',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
}
