/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        brand: {
          bg: '#F7F8FA',       
          card: '#FFFFFF',     
          darkBg: '#0F172A',   
          darkCard: '#1E293B', 
        },
        telemetry: {
          ph: {
            acid: '#E8533A',    // Danger/Brand
            neutral: '#16A34A', // Safe/Online
            alkaline: '#E8533A' // Danger
          },
          tds: '#E8533A',       // Danger
        },
        neutral: {
          title: '#111111',    
          body: '#6B7280',     
          border: '#EAECF0',   
        },
        // Legacy colors kept temporarily to prevent errors
        kideco: {
          bg: '#F7F8FA', surface: '#FFFFFF', gray: '#111111', orange: '#E8533A', dark: '#111111',
          'primary-text': '#111111', 'secondary-text': '#6B7280', border: '#EAECF0',
          sidebar: '#FFFFFF', 'sidebar-text': '#6B7280', 'sidebar-divider': '#EAECF0',
        },
        semantic: {
          safe: '#16A34A', 'safe-bg': '#DCFCE7', 'safe-border': '#BBF7D0',
          danger: '#E8533A', 'danger-bg': '#FEF2EE', 'danger-border': '#FDDDD6',
          warning: '#E8533A', 'warning-bg': '#FEF2EE', 'warning-border': '#FDDDD6',
          offline: '#9BA3AE', 'offline-bg': '#F7F8FA', 'offline-border': '#EAECF0',
        },
      },
      borderRadius: {
        'card': '10px',        // Knowvio minimal card radius
        'badge': '20px',       // Pill radius
      },
      boxShadow: {
        'soft': 'none',        // User requested no drop shadows
        'card': 'none',
        'elevated': 'none',
      }
    },
  },
  plugins: [],
}
