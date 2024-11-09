/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        caveatBold: ["Caveat-Bold"],
        caveatMedium: ["Caveat-Medium"],
        caveatRegular: ["Caveat-Regular"],
        caveatSemibold: ["Caveat-SemiBold"],
        primaryRegular: ["Montserrat-Regular"],
      },
    },
  },
  plugins: [],
};
