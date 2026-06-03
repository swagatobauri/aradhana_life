/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        'brand-navy': '#2A1F1D',      // Deep Brown / Charcoal
        'brand-purple': '#d9534f',    // Vermilion / Sindoor Red
        'brand-orange': '#DD4B2B',    // Exact color requested
        'brand-lavender': '#f4e0c4',  // Warm Sand / Cream
        'brand-gold': '#f4a261',      // Marigold / Saffron
        'brand-bg': '#F4EBDC',        // Creamy beige background (from screenshot)
      },
      borderWidth: {
        'px': '1px', // We will simulate 0.5px with CSS, but keep this standard
      }
    },
  },
  plugins: [],
}

