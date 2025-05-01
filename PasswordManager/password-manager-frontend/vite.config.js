import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  esbuild: {
    loader: 'jsx',  // Directly set the loader to 'jsx' for all JavaScript files
    include: /\.jsx?$/, // Make sure esbuild processes .js and .jsx files as JSX
  },
});