import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import svgrPlugin from 'vite-plugin-svgr'

// see all documentation here https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build change as your need
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  plugins: [
    // reactRefresh(),
    svgrPlugin({
      svgrOptions: {
        icon: true
      },
    }),
  ],
  server: {
    host: 'localhost',
    port: 3000
  }
})