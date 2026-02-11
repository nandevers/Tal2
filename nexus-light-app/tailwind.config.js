/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0047FF',
        'brand-hover': '#0036CC',
        'soft-blue': '#EFF6FF',
        // Define other custom colors if they deviate from Tailwind's defaults
        // For example, if #FAFAFA is not perfectly covered by a gray shade, define it.
        // For now, these are the main custom ones.
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}