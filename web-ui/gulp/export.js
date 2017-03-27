// this file provides a list of unbundled files that
// need to be included when exporting the application
// for production.
module.exports = {
    'list': [
        'index.html',
        'config.js',
        'favicon.ico',
        'LICENSE',
        'assets/**/*',
        "jspm_packages/npm/bluebird@3.4.1/js/browser/bluebird.min.js",
        "jspm_packages/github/Semantic-Org/Semantic-UI@2.2.4.js",
        "jspm_packages/npm/jquery@2.2.4/dist/jquery.js",
        'jspm_packages/system.js',
        'jspm_packages/system-polyfills.js',
        'jspm_packages/system-csp-production.js',
        'jspm_packages/github/sciactive/pnotify@3.0.0.js',
        'jspm_packages/github/jgraph/mxgraph-js@master.js',
        'jspm_packages/npm/aurelia-animator-velocity@1.0.1',
        'jspm_packages/npm/lodash@4.17.4.js',
        'jspm_packages/npm/rxjs@5.0.3.js',
        'jspm_packages/github/jspm/**/*',
        'jspm_packages/npm/buffer@3.6.0.js',
        'jspm_packages/npm/buffer@3.6.0/**/*',
        'jspm_packages/npm/showdown@1.6.4.js',
        'jspm_packages/github/canvg/canvg@master.js',
        'jspm_packages/github/joyent/node-docker-file-parser@master.js',
        'jspm_packages/npm/chart.js@2.5.0.js',
        'jspm_packages/npm/xterm@2.4.0.js',
        'styles/styles.css'
    ],
    // this section lists any jspm packages that have
    // unbundled resources that need to be exported.
    // these files are in versioned folders and thus
    // must be 'normalized' by jspm to get the proper
    // path.
    'normalize': [
        [
         'showdown', [
             '/dist/*.js'
        ]],
        [
            'rxjs', [
                '/**/*.js',
                '/*.js'

        ]],
        [
            'chart.js', [
                '/dist/Chart.min.js'
        ]],
        [
            'dockerfile-parser', [
            '/**/*.js'
        ]],
        [
            'lodash', [
                '/lodash.js'

        ]],
        [
            'canvg', [
                '/*',
                '/**',
                '/canvg@master.js'

        ]],
        [
            'pnotify', [
                '/dist/*'
        ]], [
            'mxgraph', [
                '/javascript/*/**',
                '/javascript/*'
            ]
        ], [
            // include font-awesome.css and its fonts files
            'font-awesome', [
            '/css/font-awesome.min.css',
            '/fonts/*'
        ]],
        [
            'bluebird', [
                '/js/browser/bluebird.min.js'
            ]
        ]
    ]
};
