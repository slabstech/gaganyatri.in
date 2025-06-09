import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  //base: 'https://github.com/slabstech/gaganyatri.in',
  plugins: [react()],
    optimizeDeps: {
    include: ['react', 'react-dom', 'three'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'build',
  },
  preview: {
    port: 11080,
    strictPort: true,
  },
  server: {
    host: true,
    strictPort: true,
    hmr: {
      overlay: false
    },
    port: 11080, // This is the port which we will use in docker
    // add the next lines if you're using windows and hot reload doesn't work
     watch: {
       usePolling: true
     }
    }
})
