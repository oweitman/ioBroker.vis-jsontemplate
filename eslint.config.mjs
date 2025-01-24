// ioBroker eslint template configuration file for js and ts files
// Please note that esm or react based modules need additional modules loaded.
import config from '@iobroker/eslint-config';

export default [
    ...config,

    {
        // specify files to exclude from linting here
        ignores: [
            '.dev-server/',
            '.vscode/',
            '*.test.js',
            'test/**/*.js',
            '*.config.mjs',
            'build',
            'src-widgets/build',
            'src-widgets/devutil',
            '**/static/*',
            'widgets/jsontemplate/build/*',
            'widgets/jsontemplate/js/ejs.js',
            'widgets/jsontemplate/js/highlight.pack.js',
            'widgets/jsontemplate/js/mode-ejs.js',
            'widgets/vis-2-widgets-jsontemplate',
            'admin/build',
            'admin/words.js',
            'admin/admin.d.ts',
            '**/adapter-config.d.ts'
        ]
    },

    {
        // you may disable some 'jsdoc' warnings - but using jsdoc is highly recommended
        // as this improves maintainability. jsdoc warnings will not block buiuld process.
        rules: {
            // 'jsdoc/require-jsdoc': 'off',
        },
    },

];