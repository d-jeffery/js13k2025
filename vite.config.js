import { defineConfig } from 'vite'
// import { analyzer } from 'vite-bundle-analyzer'
import vitePluginRoadroller from './vite-plugin-roadroller.js'

export default defineConfig({
    plugins: [
        // analyzer(),
        vitePluginRoadroller()
    ],
    base: "./",
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: false
            },
            mangle: {
                reserved: []
            }
        }
    }
})