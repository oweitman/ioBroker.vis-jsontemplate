// iobroker prettier configuration file
import prettierConfig from '@iobroker/eslint-config/prettier.config.mjs';

export default {
    ...prettierConfig,
    ...{
        "overrides": [
            {
                "files": "*.md",
                "options": {
                    "tabWidth": 2
                }
            }
        ]
    }
    // uncomment next line if you prefer double quotes
    // singleQuote: false,
}