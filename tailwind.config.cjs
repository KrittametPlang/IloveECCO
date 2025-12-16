/** @type {import('tailwindcss').Config} */
module.exports = {
  // ส่วนสำคัญ: ระบุ path ของไฟล์ html หรือ js ของคุณเพื่อให้ tailwind สแกนหา class ที่ใช้
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", 
    "./*.{html,js}" 
  ],
  theme: {
    extend: {
      // คุณสามารถเพิ่ม custom fonts, colors, หรือ breakpoints ได้ที่นี่
    },
  },
  plugins: [],
}