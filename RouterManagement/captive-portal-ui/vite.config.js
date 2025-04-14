import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',  // Directly set the loader to 'jsx' for all JavaScript files
    include: /\.jsx?$/, // Make sure esbuild processes .js and .jsx files as JSX
  },
});
