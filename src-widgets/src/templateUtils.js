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
