import react from '@vitejs/plugin-react';
import path from 'path';
import commonjs from 'vite-plugin-commonjs';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/types-vis-2/modulefederation.vis.config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const pack = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));

const config = {
    plugins: [
        federation({
            manifest: true,
            name: 'vis2vis-jsonTemplateWidgets',
            filename: 'customWidgets.js',
            exposes: {
                './JSONTemplateWidget': './src/JSONTemplateWidget', // List of all widgets in this package
                './translations': './src/translations',
            },
            remotes: {},
            shared: moduleFederationShared(pack),
            dts: false,
        }),
        react(),
        commonjs(),
    ],
    server: {
        port: 3000,
        proxy: {
            '/_socket': 'http://localhost:8082',
            '/vis.0': 'http://localhost:8082',
            '/adapter': 'http://localhost:8082',
            '/habpanel': 'http://localhost:8082',
            '/vis': 'http://localhost:8082',
            '/widgets': 'http://localhost:8082/vis',
            '/widgets.html': 'http://localhost:8082/vis',
            '/web': 'http://localhost:8082',
            '/state': 'http://localhost:8082',
        },
    },
    base: './',
    oxc: { jsx: { development: false } },
    build: {
        target: 'chrome89',
        outDir: './build',
        rollupOptions: {
            onwarn(warning: { code: string }, warn: (warning: { code: string }) => void): void {
                // Suppress "Module level directives cause errors when bundled" warnings
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return;
                }
                warn(warning);
            },
        },
    },
    resolve: {
        tsconfigPaths: true,
        dedupe: ['react', 'react-dom', '@emotion/react', '@mui/material', '@mui/system', '@mui/icons-material'],
        alias: {
            fs: path.resolve(sourceDirectory, 'src/empty.js'),
            path: path.resolve(sourceDirectory, 'src/empty.js'),
        },
    },
};

export default config;
