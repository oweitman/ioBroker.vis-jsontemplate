/* global document */

const assetPromises = new Map();

/**
 * @param {Record<string, any>} data
 * @returns {{ scripts: string[], css: string[] }}
 */
export function getAssetLists(data) {
    const scripts = [];
    const css = [];

    const scriptCount = Math.max(0, Number(data?.scriptcount || 0));
    for (let i = 1; i <= scriptCount; i++) {
        const url = String(data[`scriptfile${i}`] || '').trim();
        if (url) {
            scripts.push(url);
        }
    }

    const cssCount = Math.max(0, Number(data?.csscount || 0));
    for (let i = 1; i <= cssCount; i++) {
        const url = String(data[`cssfile${i}`] || '').trim();
        if (url) {
            css.push(url);
        }
    }

    return { scripts, css };
}

/**
 * @param {string[]} scripts
 * @param {string[]} css
 * @returns {string}
 */
export function buildAssetKey(scripts, css) {
    return `css=${css.join('|')}::js=${scripts.join('|')}`;
}

/**
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} createPromise
 * @returns {Promise<T>}
 */
function cacheAssetPromise(key, createPromise) {
    const existing = assetPromises.get(key);
    if (existing) {
        return existing;
    }

    const promise = createPromise().catch(error => {
        assetPromises.delete(key);
        throw error;
    });
    assetPromises.set(key, promise);
    return promise;
}

/**
 * @param {string} url
 * @returns {Promise<HTMLLinkElement | undefined>}
 */
function loadCssOnce(url) {
    const normalizedUrl = String(url || '').trim();
    if (!normalizedUrl) {
        return Promise.resolve(undefined);
    }

    return cacheAssetPromise(
        `css:${normalizedUrl}`,
        () =>
            new Promise((resolve, reject) => {
                const existing = Array.from(
                    /** @type {NodeListOf<HTMLLinkElement>} */ (
                        document.querySelectorAll('link[rel="stylesheet"][href]')
                    ),
                ).find(element => element.href === normalizedUrl || element.getAttribute('href') === normalizedUrl);
                if (existing) {
                    resolve(existing);
                    return;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = normalizedUrl;
                link.dataset.visJsontemplateAsset = 'css';
                link.onload = () => resolve(link);
                link.onerror = () => reject(new Error(`CSS konnte nicht geladen werden: ${normalizedUrl}`));
                document.head.appendChild(link);
            }),
    );
}

/**
 * @param {string} url
 * @returns {Promise<HTMLScriptElement | undefined>}
 */
function loadScriptOnce(url) {
    const normalizedUrl = String(url || '').trim();
    if (!normalizedUrl) {
        return Promise.resolve(undefined);
    }

    return cacheAssetPromise(
        `js:${normalizedUrl}`,
        () =>
            new Promise((resolve, reject) => {
                const existing = Array.from(
                    /** @type {NodeListOf<HTMLScriptElement>} */ (document.querySelectorAll('script[src]')),
                ).find(element => element.src === normalizedUrl || element.getAttribute('src') === normalizedUrl);
                if (existing) {
                    resolve(existing);
                    return;
                }

                const script = document.createElement('script');
                script.src = normalizedUrl;
                script.async = false;
                script.dataset.visJsontemplateAsset = 'js';
                script.onload = () => resolve(script);
                script.onerror = () => reject(new Error(`Script konnte nicht geladen werden: ${normalizedUrl}`));
                document.head.appendChild(script);
            }),
    );
}

/**
 * @param {string[]} scripts
 * @param {string[]} css
 * @returns {Promise<void>}
 */
export async function loadAssetsInOrder(scripts, css) {
    for (const url of css) {
        await loadCssOnce(url);
    }
    for (const url of scripts) {
        await loadScriptOnce(url);
    }
}
