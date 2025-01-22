const craco = require('@iobroker/vis-2-widgets-react-dev/craco.config.js');

module.exports = {
    ...craco,
    ...{
        reactScriptsVersion: "react-scripts",
        webpack: {
            mode: "extends",
            configure: {
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            enforce: "pre",
                            use: ["source-map-loader"],
                        },
                    ],
                },
                 resolve: {
                    alias:{
                        fs: false,
                        path: false 
                    }
                }, 
                ignoreWarnings: [/Failed to parse source map/],
            },
        },
    },
};
