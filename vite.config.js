import { defineConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
    plugins: [
        analyzer()
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