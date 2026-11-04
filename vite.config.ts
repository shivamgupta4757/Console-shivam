import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

function copyRootRepoAssetsPlugin() {
  return {
    name: 'copy-root-repo-assets',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(outDir)) return;
      // Ensure .nojekyll exists in dist/ so GitHub Pages serves static assets directly
      fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
      const entries = fs.readdirSync(__dirname);
      for (const file of entries) {
        if (
          file === 'CNAME' ||
          file.endsWith('.webp') ||
          file.endsWith('.png')
        ) {
          const src = path.join(__dirname, file);
          const dest = path.join(outDir, file);
          if (fs.statSync(src).isFile()) {
            fs.copyFileSync(src, dest);
          }
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    plugins: [react(), tailwindcss(), copyRootRepoAssetsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      allowedHosts: true,
    },
  };
});
