import React from 'react';
import PropTypes from 'prop-types';

import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import VisEJSAttributeField from './Components/VisEJSAttributeField';
import InnerHtml from './Components/InnerHTML';

const ejs = require('ejs');

class JSONTemplateWidget extends (window.visRxWidget || VisRxWidget) {
    static assetPromises = new Map();

    constructor(props) {
        super(props);
        this.renderText = ' ';
        this._currentAssetKey = '';
        this._assetsReady = false;
        this._renderSeq = 0;
    }

    static getWidgetInfo() {
        return {
            id: 'tplJSONTemplate4',
            visSet: 'vis-jsontemplate',
            visSetLabel: 'json_jsontemplate',
            visName: 'JSON Widget',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        {
                            name: 'oid',
                            type: 'id',
                            label: 'json_oid',
                        },
                        {
                            name: 'template',
                            type: 'custom',
                            label: 'json_template',
                            component: (field, data, onDataChange, props) => (
                                <VisEJSAttributeField
                                    visSocket={props.context.socket}
                                    field={field}
                                    data={data}
                                    onDataChange={onDataChange}
                                    props={props}
                                />
                            ),
                        },
                        {
                            name: 'dpcount',
                            type: 'number',
                            default: 1,
                            min: 1,
                            max: Number.MAX_VALUE,
                            step: 1,
                            label: 'json_dpcount',
                            onChange: async (field, data, changeData) => {
                                const dpcount = Number(data.dpcount || 1);
                                for (let i = 1; i <= dpcount; i++) {
                                    data[`g_datapoints-${i}`] = true;
                                }
                                changeData(data);
                            },
                        },
                        {
                            name: 'scriptcount',
                            type: 'number',
                            default: 1,
                            min: 1,
                            max: Number.MAX_VALUE,
                            step: 1,
                            label: 'json_scriptcount',
                            onChange: async (field, data, changeData) => {
                                const scriptcount = Number(data.scriptcount || 1);
                                for (let i = 1; i <= scriptcount; i++) {
                                    data[`g_scriptfiles-${i}`] = true;
                                }
                                changeData(data);
                            },
                        },
                        {
                            name: 'csscount',
                            type: 'number',
                            default: 1,
                            min: 1,
                            max: Number.MAX_VALUE,
                            step: 1,
                            label: 'json_csscount',
                            onChange: async (field, data, changeData) => {
                                const csscount = Number(data.csscount || 1);
                                for (let i = 1; i <= csscount; i++) {
                                    data[`g_cssfiles-${i}`] = true;
                                }
                                changeData(data);
                            },
                        },
                    ],
                },
                {
                    name: 'datapoints',
                    label: 'json_datapointsgroup',
                    indexFrom: 1,
                    indexTo: 'dpcount',
                    onChange: async (field, data, changeData) => {
                        changeData(data);
                    },
                    fields: [
                        {
                            name: 'json_dp',
                            label: 'json_datapoints_oid',
                            type: 'id',
                        },
                    ],
                },
                {
                    name: 'scriptfiles',
                    label: 'json_scriptsgroup',
                    indexFrom: 1,
                    indexTo: 'scriptcount',
                    onChange: async (field, data, changeData) => {
                        changeData(data);
                    },
                    fields: [
                        {
                            name: 'scriptfile',
                            label: 'json_scriptfile',
                            type: 'text',
                        },
                    ],
                },
                {
                    name: 'cssfiles',
                    label: 'json_cssgroup',
                    indexFrom: 1,
                    indexTo: 'csscount',
                    onChange: async (field, data, changeData) => {
                        changeData(data);
                    },
                    fields: [
                        {
                            name: 'cssfile',
                            label: 'json_cssfile',
                            type: 'text',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 300,
                height: 300,
            },
            visPrev: 'widgets/vis2vis-jsontemplate/img/jsontemplate.png',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.propertiesUpdate();
    }

    getWidgetInfo() {
        return JSONTemplateWidget.getWidgetInfo();
    }

    static getI18nPrefix() {
        return 'vis-jsontemplate_';
        // return `${JSONTemplateWidget.adapter}_`;
    }

    onRxDataChanged() {
        this.propertiesUpdate();
    }

    onRxStyleChanged() {
        this.propertiesUpdate();
    }

    onStateUpdated() {
        this.propertiesUpdate();
    }

    escapeHTML(html) {
        let escapeEl = document.createElement('textarea');
        escapeEl.textContent = html;
        const ret = escapeEl.innerHTML;
        return ret;
    }

    getAssetLists(data) {
        const scripts = [];
        const css = [];

        const scriptcount = Number(data?.scriptcount || 0);
        for (let i = 1; i <= scriptcount; i++) {
            const url = (data[`scriptfile${i}`] || '').trim();
            if (url) {
                scripts.push(url);
            }
        }

        const csscount = Number(data?.csscount || 0);
        for (let i = 1; i <= csscount; i++) {
            const url = (data[`cssfile${i}`] || '').trim();
            if (url) {
                css.push(url);
            }
        }

        return { scripts, css };
    }

    buildAssetKey(scripts, css) {
        return `css=${css.join('|')}::js=${scripts.join('|')}`;
    }

    loadCssOnce(url) {
        const u = (url || '').trim();
        if (!u) {
            return Promise.resolve();
        }

        const key = `css:${u}`;
        const cache = JSONTemplateWidget.assetPromises;

        if (cache.has(key)) {
            return cache.get(key);
        }

        const p = new Promise((resolve, reject) => {
            try {
                const existing = Array.from(
                    /** @type {NodeListOf<HTMLLinkElement>} */ (
                        document.querySelectorAll('link[rel="stylesheet"][href]')
                    ),
                ).find(el => el.href === u || el.getAttribute('href') === u);

                if (existing) {
                    resolve(existing);
                    return;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = u;
                link.dataset.visJsontemplateAsset = 'css';
                link.onload = () => resolve(link);
                link.onerror = () => reject(new Error(`CSS konnte nicht geladen werden: ${u}`));
                document.head.appendChild(link);
            } catch (err) {
                reject(err);
            }
        });

        cache.set(key, p);
        return p;
    }

    loadScriptOnce(url) {
        const u = (url || '').trim();
        if (!u) {
            return Promise.resolve();
        }

        const key = `js:${u}`;
        const cache = JSONTemplateWidget.assetPromises;

        if (cache.has(key)) {
            return cache.get(key);
        }

        const p = new Promise((resolve, reject) => {
            try {
                const existing = Array.from(
                    /** @type {NodeListOf<HTMLScriptElement>} */ (document.querySelectorAll('script[src]')),
                ).find(el => el.src === u || el.getAttribute('src') === u);

                if (existing) {
                    resolve(existing);
                    return;
                }

                const script = document.createElement('script');
                script.src = u;
                script.async = false;
                script.defer = false;
                script.dataset.visJsontemplateAsset = 'js';
                script.onload = () => resolve(script);
                script.onerror = () => reject(new Error(`Script konnte nicht geladen werden: ${u}`));
                document.head.appendChild(script);
            } catch (err) {
                reject(err);
            }
        });

        cache.set(key, p);
        return p;
    }

    async loadAssetsInOrder(scripts, css) {
        for (const url of css) {
            await this.loadCssOnce(url);
        }

        for (const url of scripts) {
            await this.loadScriptOnce(url);
        }
    }

    async ensureAssetsLoaded(data) {
        const { scripts, css } = this.getAssetLists(data);
        const assetKey = this.buildAssetKey(scripts, css);

        if (this._currentAssetKey === assetKey && this._assetsReady) {
            return;
        }

        this._currentAssetKey = assetKey;
        this._assetsReady = false;

        const requestedKey = assetKey;
        await this.loadAssetsInOrder(scripts, css);

        if (this._currentAssetKey !== requestedKey) {
            return;
        }

        this._assetsReady = true;
    }

    buildDatapoints(data) {
        const datapoints = {};
        const dpCount = Number(data?.dpcount || 1);

        for (let i = 1; i <= dpCount; i++) {
            const oid = data[`json_dp${i}`] || data[`json_dp-${i}`] || data[`datapoint-oid${i}`];
            if (oid) {
                datapoints[oid] = this.state.values?.[`${oid}.val`];
            }
        }

        return datapoints;
    }

    async propertiesUpdate() {
        const seq = ++this._renderSeq;

        try {
            const data = this.state.data || {};
            const rxData = this.state.rxData || data;

            await this.ensureAssetsLoaded(data);
            if (seq !== this._renderSeq) {
                return;
            }
            let oiddata = {};

            const mainOid = rxData?.oid || data?.oid;
            const rawValue = this.state.values?.[`${mainOid}.val`];
            if (mainOid && rawValue) {
                try {
                    oiddata = JSON.parse(rawValue);
                } catch {
                    oiddata = {};
                }
            }

            const datapoints = this.buildDatapoints(data);
            const template = data?.template || '';

            const html = await ejs.render(
                template,
                {
                    widgetid: this.props.id,
                    data: oiddata,
                    dp: datapoints,
                    style: this.props.style,
                    widget: data,
                    I18n,
                },
                { async: true },
            );

            if (seq !== this._renderSeq) {
                return;
            }

            this.renderText = `${html} `;
            this.forceUpdate();
        } catch (e) {
            if (seq !== this._renderSeq) {
                return;
            }

            const errorMessage = e instanceof Error ? e.message : String(e);
            let text = this.escapeHTML(errorMessage).replace(/(?:\r\n|\r|\n)/g, '<br>');
            text = text.replace(/ /gm, '&nbsp;');
            this.renderText = `<code style="color:red;">${text}</code>`;
            this.forceUpdate();
        }
    }

    renderWidgetBody() {
        return (
            <InnerHtml
                html={this.renderText || ' '}
                allowRerender={new Date().getTime()}
            />
        );
    }
}

JSONTemplateWidget.propTypes = {
    systemConfig: PropTypes.object,
    socket: PropTypes.object,
    style: PropTypes.object,
    data: PropTypes.object,
    id: PropTypes.string,
};

export default JSONTemplateWidget;

/*
normal test
<code>

<%  //debugger; %>
a <% a=11111123 %><br>
data.propnum <%= data.propnum %><br>
data.propstr <%= data.propstr %><br>
<%= a %><br>
dp0 <%= dp["0_userdata.0.dp1"] %><br>
dp1 <%= dp["0_userdata.0.dp2"] %><br>
</code>
*/

/*
Async test
           <%

            debugger;
            req = await sendToAsync("admin.0","selectSendTo");
            console.log(JSON.stringify(req));
            %>
            <%- JSON.stringify(req) %>
            <%
            async function sendToAsync(instance, command, sendData) {
                return new Promise((resolve, reject) => {
                    try {
                        vis.conn.sendTo(instance, command, sendData, function (receiveData) {
                            resolve(receiveData);
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            }
            %>
*/
