const fs = require('node:fs');
const path = require('path');

const langTemplate = {
    en: {},
    de: {},
    ru: {},
    pt: {},
    nl: {},
    fr: {},
    it: {},
    es: {},
    pl: {},
    uk: {},
    'zh-cn': {},
};
let i18npath = '../src/i18n';
let format = 'multi';
/**
 * Imports i18n keys from JSON files located in a specified directory.
 *
 * Depending on the format specified, this function will either import
 * multiple language files from the directory or a single file containing
 * all translations.
 *
 * @returns {object} An object containing the imported i18n keys, where each
 *                   property corresponds to a language code and its value
 *                   is the parsed JSON content.
 */

function importi18nKeys() {
    const i18n = {};
    const dir = path.resolve(__dirname, '../', i18npath);

    if (format === 'multi') {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = `${dir}/${file}`;
            if (fs.statSync(filePath).isFile() && filePath.endsWith('.json')) {
                i18n[file.replace('.json', '')] = require(filePath);
            }
        }
    }
    if (format === 'single') {
        const filePath = path.resolve(__dirname, '../', i18npath);
        i18n['en'] = require(filePath);
    }
    return i18n;
}
/**
 * Exports the i18n keys as multiple JSON files in a specified directory,
 * where each file corresponds to a language code.
 *
 * @param {object} i18n The object containing the i18n keys, where each
 *                      property corresponds to a language code and its value
 *                      is the parsed JSON content.
 */
function exporti18nKeysMultiFile(i18n) {
    const dir = path.resolve(__dirname, '../', i18npath);
    for (const lang in i18n) {
        const json = JSON.stringify(i18n[lang], null, 4);
        const filePath = `${dir}/${lang}.json`;
        fs.writeFileSync(filePath, json);
    }
}
/**
 * Exports the i18n keys as a single JSON file in a specified directory,
 * with the default name "words.json". The file contains an object with
 * properties corresponding to the i18n keys, and each property value is
 * an object containing the translations for each language.
 *
 * @param {object} i18n The object containing the i18n keys, where each
 *                      property corresponds to a language code and its value
 *                      is the parsed JSON content.
 */
function exporti18nKeysSingleFile(i18n) {
    const source = i18n.en;
    const target = {};
    for (const key in source) {
        target[key] = {};
        for (const lang in i18n) {
            target[key][lang] = i18n[lang][key];
        }
    }
    const pathObject = path.parse(i18npath);
    pathObject.base = 'words.json';
    const newPath = path.format(pathObject);
    const filePath = path.resolve(__dirname, '../', newPath);
    const json = JSON.stringify(target, null, 4);
    fs.writeFileSync(filePath, json);
}
/**
 * Exports the i18n keys as either multiple JSON files or a single JSON file.
 *
 * If the format is "multi", the function will export the i18n keys as multiple
 * JSON files, each containing the translations for a single language, with the
 * default file name being the language code. For example, if the language code
 * is "en", the file name will be "en.json".
 *
 * If the format is "single", the function will export the i18n keys as a single
 * JSON file, with the default name "words.json". The file will contain an object
 * with properties corresponding to the i18n keys, and each property value is
 * an object containing the translations for each language.
 *
 * @param {object} i18n The object containing the i18n keys, where each
 *                      property corresponds to a language code and its value
 *                      is the parsed JSON content.
 * @returns {object} The exported i18n keys.
 */
function exporti18nKeys(i18n) {
    let tempI18n;
    if (!format) {
        format = 'multi';
    }
    if (format === 'multi') {
        tempI18n = exporti18nKeysMultiFile(i18n);
    }
    if (format === 'single') {
        tempI18n = exporti18nKeysSingleFile(i18n);
    }
    return tempI18n;
}
/**
 * Extends the given i18n object with the default languages.
 *
 * @param {object} i18n The object containing the i18n keys, where each
 *                      property corresponds to a language code and its value
 *                      is the parsed JSON content.
 * @returns {object} The extended i18n object.
 */
function extendLanguages(i18n) {
    return { ...langTemplate, ...i18n };
}
/**
 * Creates an object from a list of keys.
 *
 * The returned object has the given keys as its own properties, with
 * each property value being an empty string.
 *
 * @param {Array<string>} keyNames The list of keys to create an object from.
 * @returns {object} The created object.
 */
function createObjectFromKeys(keyNames) {
    const obj = {};
    keyNames.forEach(key => {
        if (key !== '') {
            obj[key] = '';
        }
    });
    return obj;
}
/**
 * Extends the given i18n object with all keys from the given language.
 *
 * @param {object} i18n The object containing the i18n keys, where each
 *                      property corresponds to a language code and its value
 *                      is the parsed JSON content.
 * @param {string} lang The language code to extend the i18n object with.
 * @returns {object} The extended i18n object.
 */
function extendLanguageKeysFromLang(i18n, lang) {
    const obj = createObjectFromKeys(Object.keys(i18n[lang]));
    for (const key in i18n) {
        i18n[key] = { ...obj, ...i18n[key] };
    }
    return i18n;
}
/**
 * Checks if a given key is empty in any language within the i18n object.
 *
 * This function iterates through the i18n object to determine if the specified
 * key has an empty string value in any of the languages. If the key is empty in
 * at least one language, the function logs the language and returns true.
 *
 * @param {object} i18n - The object containing the i18n keys, with each property
 *                        corresponding to a language code and its value being
 *                        the translation object.
 * @param {string} key - The key to check for emptiness across all languages.
 * @returns {boolean} - Returns true if the key is empty in any language, otherwise false.
 */

function isKeyEmptyInAnyLanguage(i18n, key) {
    if (key === '') {
        return false;
    }
    for (const lang in i18n) {
        if (i18n[lang][key] === '') {
            console.log(`Key ${key} is empty in ${lang}`);
            return true;
        }
    }
    return false;
}
/**
 * Asynchronously fetches the translations for a given word.
 *
 * This function fetches the translations for the given word by making a POST
 * request to the DeepL API. The request contains the word to translate, the
 * service to use (DeepL), and the flag to translate the text together or not.
 * The function returns the result of the request as a JSON object.
 *
 * @param {string} word The word to translate.
 * @returns {Promise<object>} The result of the request as a JSON object.
 */
async function fetchTranslations(word) {
    console.log(`translate ${word}`);
    const response = await fetch('https://oz7q7o4tl3.execute-api.eu-west-1.amazonaws.com/', {
        headers: {
            Referer: 'https://translator-ui.iobroker.in/',
        },
        body: JSON.stringify({ text: word, service: 'deepl', together: false }),
        method: 'POST',
    });
    const data = await response.json();
    return data;
}
/**
 * Asynchronously updates empty translation keys with their translations.
 *
 * This function iterates over all keys of the specified language in the
 * i18n object. If a key is empty in any language, it fetches the translations
 * for that key and updates the empty translations with the fetched data.
 *
 * @param {object} i18n - The object containing the i18n keys, where each
 *                        property corresponds to a language code and its value
 *                        is the parsed JSON content for that language.
 * @param {string} lang - The language code to update the translations for.
 * @returns {Promise<object>} - A promise that resolves to the updated i18n object.
 */

async function updateEmptyKeysWithTranslation(i18n, lang) {
    for (const key in i18n[lang]) {
        if (isKeyEmptyInAnyLanguage(i18n, key)) {
            const translatedKey = await fetchTranslations(i18n[lang][key]);
            // @ts-expect-error unknown type
            for (const k in translatedKey) {
                if (i18n[k][key] === '') {
                    // @ts-expect-error unknown type
                    i18n[k][key] = translatedKey[k];
                }
            }
        }
    }
    return i18n;
}
/**
 * Deletes the specified keys from the i18n object.
 *
 * This function iterates over the given keys and deletes them from all
 * languages in the i18n object, except for the English language.
 *
 * @param {object} i18n - The object containing the i18n keys, where each
 *                        property corresponds to a language code and its value
 *                        is the parsed JSON content for that language.
 * @param {string[]} keys - The keys to delete from the i18n object.
 * @returns {object} - The modified i18n object.
 */
function deleteKeys(i18n, keys) {
    keys.forEach(key => {
        for (const lang in i18n) {
            if (lang === 'en') {
                continue;
            }
            if (i18n[lang][key] !== undefined) {
                delete i18n[lang][key];
            }
        }
    });
    return i18n;
}
/**
 * Deletes specified keys from the i18n object and exports the updated keys.
 *
 * This function processes the provided arguments to extract keys, imports
 * the i18n keys, deletes the specified keys from all languages except
 * English, and then exports the updated i18n keys.
 *
 * @param {string[]} args - The arguments containing the keys to be deleted.
 *                          If multiple keys are provided, they are joined
 *                          into a single string and split by commas.
 */

function doDeleteKeys(args) {
    console.log('start delete keys');
    if (args.length > 1) {
        args[0] = args.join(',');
    }
    if (args.length > 0) {
        let keys = args[0].split(',');
        keys = keys.map(k => k.trim());
        let i18n = importi18nKeys();
        i18n = deleteKeys(i18n, keys);
        exporti18nKeys(i18n);
    }
    console.log('end delete keys');
}
/**
 * Empties the specified keys from the i18n object, except for the English
 * language.
 *
 * This function iterates over the given keys and sets them to an empty
 * string in all languages except for English.
 *
 * @param {object} i18n - The object containing the i18n keys, where each
 *                        property corresponds to a language code and its value
 *                        is the parsed JSON content for that language.
 * @param {string[]} keys - The keys to empty from the i18n object.
 * @returns {object} - The modified i18n object.
 */
function emptyKeys(i18n, keys) {
    keys.forEach(key => {
        for (const lang in i18n) {
            if (lang === 'en') {
                continue;
            }
            if (i18n[lang][key] !== undefined) {
                i18n[lang][key] = '';
            }
        }
    });
    return i18n;
}
/**
 * Empties the specified keys from the i18n object, except for the English
 * language.
 *
 * This function processes the provided arguments to extract keys, imports
 * the i18n keys, empties the specified keys from all languages except
 * English, and then exports the updated i18n keys.
 *
 * @param {string[]} args - The arguments containing the keys to be emptied.
 *                          If multiple keys are provided, they are joined
 *                          into a single string and split by commas.
 */
function doEmptyKeys(args) {
    console.log('start empty keys');
    if (args.length > 1) {
        args[0] = args.join(',');
    }
    if (args.length > 0) {
        let keys = args[0].split(',');
        keys = keys.map(k => k.trim());
        let i18n = importi18nKeys();
        i18n = emptyKeys(i18n, keys);
        exporti18nKeys(i18n);
    }
    console.log('end empty keys');
}
/**
 * Empties all keys from the specified language from the i18n object.
 *
 * This function iterates over all keys in the specified language and sets
 * them to an empty string. It does not modify any other languages.
 *
 * @param {object} i18n - The object containing the i18n keys, where each
 *                        property corresponds to a language code and its value
 *                        is the parsed JSON content for that language.
 * @param {string} lang - The language code to empty from the i18n object.
 * @returns {object} - The modified i18n object.
 */
function emptyLang(i18n, lang) {
    for (const key in i18n[lang]) {
        if (i18n[lang][key] !== undefined) {
            i18n[lang][key] = '';
        }
    }
    return i18n;
}
/**
 * Empties all keys from the specified language from the i18n object.
 *
 * This function processes the provided arguments to extract a single language
 * code, imports the i18n keys, empties all keys from the specified language,
 * and then exports the updated i18n keys.
 *
 * @param {string[]} args - The arguments containing the language code to empty
 *                          from the i18n object. Only one language is
 *                          supported. If the language code is "en", the
 *                          function will log an error message and do nothing.
 */
function doEmptyLang(args) {
    console.log('start empty lang');
    if (args.length !== 1) {
        console.log('Only one language is supported');
        return;
    }
    if (args.length > 0) {
        const lang = args[0].trim();
        if (lang === 'en') {
            console.log('empty of en not allowed');
            return;
        }
        let i18n = importi18nKeys();
        i18n = emptyLang(i18n, lang);
        exporti18nKeys(i18n);
    }
    console.log('end empty lang');
}
/**
 * Cleans up the i18n keys by removing all keys from languages other than
 * English if the key does not exist in English.
 *
 * This function imports the i18n keys, filters out the English language,
 * iterates over all keys in the remaining languages, and deletes any key
 * that does not exist in English. It then exports the updated i18n keys.
 */
function doCleanKeys() {
    console.log('start clean keys');
    const i18n = importi18nKeys();
    let languages = Object.keys(i18n);
    languages = languages.filter(lang => lang !== 'en');
    for (const lang of languages) {
        for (const key in i18n[lang]) {
            if (i18n['en'][key] === undefined) {
                delete i18n[lang][key];
            }
        }
    }
    exporti18nKeys(i18n);
    console.log('end clean keys');
}
/**
 * Translates the i18n keys using the translate-shell utility.
 *
 * This function imports the i18n keys, extends the English language keys to
 * all other languages, updates any empty keys in languages other than English
 * with their translation from English, and then exports the updated i18n keys.
 *
 * @async
 */
async function doTranslate() {
    console.log('start translate');
    let i18n = importi18nKeys();
    i18n = extendLanguages(i18n);
    i18n = extendLanguageKeysFromLang(i18n, 'en');
    i18n = await updateEmptyKeysWithTranslation(i18n, 'en');
    exporti18nKeys(i18n);
    console.log('end translate');
}
/**
 * The main function of the translate script.
 *
 * The main function processes the command line arguments and calls one of the
 * following functions based on the first argument:
 * - `doTranslate` if the first argument is empty,
 * - `doDeleteKeys` if the first argument is `deletekey`,
 * - `doEmptyKeys` if the first argument is `emptykey`,
 * - `doEmptyLang` if the first argument is `emptylang`,
 * - `doCleanKeys` if the first argument is `cleanKeys`.
 *
 * The command line arguments can also include the `--source` and `--format`
 * options, which are processed first and then removed from the argument list.
 */
async function main() {
    let pos;
    const args = process.argv.slice(2);
    pos = args.indexOf('--source');
    if (pos >= 0) {
        i18npath = args[pos + 1];
        args.splice(pos, 2);
    }
    pos = args.indexOf('--format');
    if (pos >= 0) {
        format = args[pos + 1];
        args.splice(pos, 2);
    }

    if (args.length === 0) {
        doTranslate();
        return;
    }
    if (args[0] === 'deletekey') {
        args.shift();
        doDeleteKeys(args);
    }
    if (args[0] === 'emptykey') {
        args.shift();
        doEmptyKeys(args);
    }
    if (args[0] === 'emptylang') {
        args.shift();
        doEmptyLang(args);
    }
    if (args[0] === 'cleanKeys') {
        args.shift();
        doCleanKeys();
    }
}

main();
