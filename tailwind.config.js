/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b5afaf",
        secondary: "#b9b9b9",
        dark: "#020101",
      },
      fontSize: {
        base: "16px",
        sm: "12px",
        lg: "30px",
      },
      boxShadow: {
        custom: "0px 0px 10px 2px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        lg: "15px",
      },
      backgroundImage: {
        'signup-pattern': "url('/images/sign_up.jpg')",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 5s ease-out',
        'fade-in': 'fade-in 0.5s ease-in-out', 
      },
    },
  },
  plugins: [],
};
