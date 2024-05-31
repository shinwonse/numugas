import type { Config } from "tailwindcss";
import tailwindScrollbar from "tailwind-scrollbar";
import daisyui from "daisyui";

const config: Omit<Config, "content"> = {
  darkMode: "class",
  plugins: [tailwindScrollbar, daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#dd3c3c", // --red-9
          secondary: "#b64540", // --red-8
          accent: "#732422", // --red-6
          neutral: "#201312", // --red-2
          "base-100": "#170f0e", // --red-1
          info: "#ff8e85", // --red-11
          success: "#ffd2cd", // --red-12
          warning: "#ba4944", // --red-10
          error: "#ff403b69", // --red-a6
        },
      },
    ],
  },
};

export default config;
