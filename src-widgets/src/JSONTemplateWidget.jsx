import PropTypes from 'prop-types';

import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import VisEJSAttributeField from './Components/VisEJSAttributeField';
import JSONTemplateRenderer from './Components/JSONTemplateRenderer';
import { buildAssetKey, getAssetLists, loadAssetsInOrder } from './assetLoader';
import { buildDatapoints, escapeHtml, parseJsonValue, renderEjsTemplate } from './templateUtils';

class JSONTemplateWidget extends (window.visRxWidget || VisRxWidget) {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = {
            ...initialState,
            renderedHtml: ' ',
            renderVersion: 0,
        };
        this._currentAssetKey = '';
        this._assetsReady = false;
        this._renderSeq = 0;
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
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
                            max: Number.MAX_SAFE_INTEGER,
                            step: 1,
                            label: 'json_dpcount',
                            onChange: (field, data, changeData) => {
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
                            max: Number.MAX_SAFE_INTEGER,
                            step: 1,
                            label: 'json_scriptcount',
                            onChange: (field, data, changeData) => {
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
                            max: Number.MAX_SAFE_INTEGER,
                            step: 1,
                            label: 'json_csscount',
                            onChange: (field, data, changeData) => {
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
                    onChange: (field, data, changeData) => {
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
                    onChange: (field, data, changeData) => {
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
                    onChange: (field, data, changeData) => {
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

    onStateUpdated(id, state) {
        const values = { ...this.widgetState.values };
        if (state?.val !== undefined) {
            values[`${id}.val`] = state.val;
        }
        this.propertiesUpdate(values);
    }

    async ensureAssetsLoaded(data) {
        const { scripts, css } = getAssetLists(data);
        const assetKey = buildAssetKey(scripts, css);

        if (this._currentAssetKey === assetKey && this._assetsReady) {
            return;
        }

        this._currentAssetKey = assetKey;
        this._assetsReady = false;

        const requestedKey = assetKey;
        await loadAssetsInOrder(scripts, css);

        if (this._currentAssetKey !== requestedKey) {
            return;
        }

        this._assetsReady = true;
    }

    async propertiesUpdate(values = this.widgetState.values) {
        const seq = ++this._renderSeq;

        try {
            const data = this.widgetState.data || {};
            const rxData = this.widgetState.rxData || data;
            const style = this.widgetState.style;

            await this.ensureAssetsLoaded(data);
            if (seq !== this._renderSeq) {
                return;
            }
            const mainOid = rxData?.oid || data?.oid;
            const rawValue = mainOid ? values?.[`${mainOid}.val`] : undefined;
            const oiddata = parseJsonValue(rawValue);
            const datapoints = buildDatapoints(data, values);
            const template = data?.template || '';

            const html = await renderEjsTemplate(
                template,
                {
                    widgetid: this.props.id,
                    widgetID: this.props.id,
                    data: oiddata,
                    dp: datapoints,
                    style: style,
                    widget: data,
                    I18n,
                },
            );

            if (seq !== this._renderSeq) {
                return;
            }

            const renderedHtml = `${html} `;
            this.setState(previousState => ({
                renderedHtml,
                renderVersion: previousState.renderVersion + 1,
            }));
        } catch (e) {
            if (seq !== this._renderSeq) {
                return;
            }

            const errorMessage = e instanceof Error ? e.message : String(e);
            let text = escapeHtml(errorMessage).replace(/(?:\r\n|\r|\n)/g, '<br>');
            text = text.replace(/ /gm, '&nbsp;');
            const renderedHtml = `<code style="color:red;">${text}</code>`;
            this.setState(previousState => ({
                renderedHtml,
                renderVersion: previousState.renderVersion + 1,
            }));
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        return (
            <JSONTemplateRenderer
                html={this.widgetState.renderedHtml}
                renderVersion={this.widgetState.renderVersion}
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
