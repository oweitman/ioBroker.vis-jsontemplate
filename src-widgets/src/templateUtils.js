/* global document */

import ejs from 'ejs';

/**
 * @param {unknown} value
 * @returns {unknown}
 */
export function parseJsonValue(value) {
    if (value === null || value === undefined || value === '') {
        return {};
    }

    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
}

/**
 * @param {Record<string, any>} data
 * @param {Record<string, any>} values
 * @returns {Record<string, unknown>}
 */
export function buildDatapoints(data, values) {
    const datapoints = {};
    const count = Math.max(0, Number(data?.dpcount || 1));

    for (let i = 1; i <= count; i++) {
        const oid = data[`json_dp${i}`] || data[`json_dp-${i}`] || data[`datapoint-oid${i}`];
        if (oid) {
            datapoints[oid] = values?.[`${oid}.val`];
        }
    }

    return /** @type {Record<string, unknown>} */ (datapoints);
}

const EJS_CONTEXT_NAMES = new Set(['widgetid', 'widgetID', 'data', 'dp', 'style', 'widget', 'I18n']);
const RESERVED_WORDS = new Set([
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'interface',
    'let',
    'new',
    'null',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'static',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
]);

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isValidJavaScriptIdentifier(value) {
    if (typeof value !== 'string' || !value) {
        return false;
    }

    // ZWNJ and ZWJ are explicitly permitted after the first character by ECMAScript.
    // eslint-disable-next-line no-misleading-character-class
    return /^[$_\p{ID_Start}][$\u200C\u200D_\p{ID_Continue}]*$/u.test(value) && !RESERVED_WORDS.has(value);
}

/**
 * @param {Record<string, any>} data
 * @param {number} index
 * @returns {string}
 */
export function getDatapointVariableName(data, index) {
    const value = data?.[`json_dp_variable${index}`] ?? data?.[`json_dp_variable-${index}`] ?? '';
    return typeof value === 'string' ? value.trim() : '';
}

/**
 * @param {Record<string, any>} data
 * @param {number} index
 * @returns {boolean}
 */
export function hasInvalidDatapointVariable(data, index) {
    const name = getDatapointVariableName(data, index);
    if (!name) {
        return false;
    }

    const generatedNames = new Set([name, `${name}_value`]);
    if ([...generatedNames].some(generatedName => !isValidJavaScriptIdentifier(generatedName))) {
        return true;
    }
    if ([...generatedNames].some(generatedName => EJS_CONTEXT_NAMES.has(generatedName))) {
        return true;
    }

    const count = Math.max(0, Number(data?.dpcount || 1));
    for (let i = 1; i <= count; i++) {
        if (i === index) {
            continue;
        }

        const otherName = getDatapointVariableName(data, i);
        if (otherName && (generatedNames.has(otherName) || generatedNames.has(`${otherName}_value`))) {
            return true;
        }
    }

    return false;
}

/**
 * Builds the optional top-level EJS variables configured for the datapoints.
 *
 * @param {Record<string, any>} data
 * @param {Record<string, any>} values
 * @returns {Record<string, unknown>}
 */
export function buildDatapointVariables(data, values) {
    const variables = {};
    const usedNames = new Set();
    const count = Math.max(0, Number(data?.dpcount || 1));

    for (let i = 1; i <= count; i++) {
        const name = getDatapointVariableName(data, i);
        if (!name) {
            continue;
        }
        if (!isValidJavaScriptIdentifier(name)) {
            throw new Error(`Invalid JavaScript variable name: ${name}`);
        }
        const valueName = `${name}_value`;
        if (EJS_CONTEXT_NAMES.has(name) || EJS_CONTEXT_NAMES.has(valueName)) {
            throw new Error(`Variable name is already used by the template context: ${name}`);
        }
        if (usedNames.has(name) || usedNames.has(valueName)) {
            throw new Error(`Variable name is used more than once: ${name}`);
        }
        usedNames.add(name);
        usedNames.add(valueName);

        const oid = data[`json_dp${i}`] || data[`json_dp-${i}`] || data[`datapoint-oid${i}`];
        if (oid) {
            Object.defineProperty(variables, name, {
                value: oid,
                enumerable: true,
                configurable: true,
                writable: true,
            });
            Object.defineProperty(variables, valueName, {
                value: values?.[`${oid}.val`],
                enumerable: true,
                configurable: true,
                writable: true,
            });
        }
    }

    return /** @type {Record<string, unknown>} */ (variables);
}

/**
 * @param {string} template
 * @param {Record<string, unknown>} context
 * @returns {Promise<string>}
 */
export async function renderEjsTemplate(template, context) {
    return ejs.render(template, context, { async: true });
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
    const element = document.createElement('textarea');
    element.textContent = String(value);
    return element.innerHTML;
}
