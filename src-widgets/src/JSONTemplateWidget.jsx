import React from 'react';
import {} from '@mui/material';
import PropTypes from 'prop-types';

import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import VisEJSAttributeField from './Components/VisEJSAttributeField.tsx';
import InnerHtml from './Components/InnerHTML.jsx';

const ejs = require('ejs');

class JSONTemplateWidget extends (window.visRxWidget || VisRxWidget) {
    constructor(props) {
        super(props);
        this.renderText = ' ';
    }
    static getWidgetInfo() {
        return {
            id: 'tplJSONTemplate4',
            visSet: 'vis-jsontemplate',
            visSetLabel: 'jsontemplate',
            visName: 'JSON Widget', // Name of widget
            visAttrs: [
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'oid', // name in data structure
                            type: 'id',
                            label: 'oid', // translated field label
                        },
                        {
                            name: 'template', // name in data structure
                            type: 'custom',
                            label: 'template:', // translated field label
                            component: (
                                // important
                                field, // field properties: {name, label, type, set, singleName, component,...}
                                data, // widget data
                                onDataChange, // function to call, when data changed
                                props, // additional properties : {socket, projectName, instance, adapterName, selectedView, selectedWidgets, project, widgetID}
                                // socket,      // socket object
                                // widgetID,    // widget ID or widgets IDs. If selecteld more than one widget, it is array of IDs
                                // view,        // view name
                                // project,      // project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, __settings: {}}
                            ) => (
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
                            name: 'dpcount', // name in data structure
                            type: 'number',
                            default: 1,
                            min: 1,
                            max: Number.MAX_VALUE,
                            step: 1,
                            label: 'dpcount:', // translated field label
                            onChange: async (field, data, changeData) => {
                                const { dpcount } = data;
                                for (let i = 0; i <= dpcount; i++) {
                                    data[`g_datapoints-${i}`] = true;
                                }
                                changeData(data);
                            },
                        },
                    ],
                },
                {
                    name: 'datapoints', // group name
                    label: 'datapointsgroup', // translated group label
                    indexFrom: 1,
                    indexTo: 'dpcount',
                    onChange: async (field, data, changeData) => {
                        changeData(data);
                    },
                    fields: [
                        {
                            name: 'datapoint-oid',
                            label: 'datapoints_oid:',
                            type: 'id',
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visDefaultStyle: {
                // default style
                width: 300,
                height: 300,
            },
            visPrev: 'widgets/vis2vis-jsontemplate/img/jsontemplate.png',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    async propertiesUpdate() {
        // Widget has 3 important states
        // 1. this.state.values - contains all state values, that are used in widget (automatically collected from widget info).
        //                        So you can use `this.state.values[this.state.rxData.oid + '.val']` to get value of state with id this.state.rxData.oid
        // 2. this.state.rxData - contains all widget data with replaced bindings. E.g. if this.state.data.type is `{system.adapter.admin.0.alive}`,
        //                        then this.state.rxData.type will have state value of `system.adapter.admin.0.alive`
        // 3. this.state.rxStyle - contains all widget styles with replaced bindings. E.g. if this.state.styles.width is `{javascript.0.width}px`,
        //                        then this.state.rxData.type will have state value of `javascript.0.width` + 'px
        let oiddata, data, datapoints, template, dpCount;
        try {
            oiddata = JSON.parse(this.state.values[`${this.state.rxData.oid}.val`] || '{}');
            data = this.state.data || {};
            datapoints = [];
            dpCount = data.dpcount ? data.dpcount : 1;
            for (let i = 1; i <= dpCount; i++) {
                if (data['datapoint-oid' + i]) {
                    datapoints[data['datapoint-oid' + i]] = this.state.values[`${data['datapoint-oid' + i]}.val`];
                }
            }

            template = data?.template || '';
            this.renderText =
                (await ejs.render(
                    template,
                    {
                        widgetid: this.props.id,
                        data: oiddata,
                        dp: datapoints,
                        style: this.props.style,
                    },
                    { async: true },
                )) + ' ';
        } catch (e) {
            this.renderText = this.escapeHTML(e.message).replace(/(?:\r\n|\r|\n)/g, '<br>');
            this.renderText = this.renderText.replace(/ /gm, '&nbsp;');
            this.renderText = `<code style="color:red;">${this.renderText}</code>`;
        }
    }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return JSONTemplateWidget.getWidgetInfo();
    }
    // If the "prefix" attribute in translations.ts is true or string, you must implement this function.
    // If true, the adapter name + _ is used.
    // If string, then this function must return exactly that string
    static getI18nPrefix() {
        return `${JSONTemplateWidget.adapter}_`;
    }
    // This function is called every time when rxData is changed
    onRxDataChanged() {
        this.propertiesUpdate();
    }

    // This function is called every time when rxStyle is changed
    // eslint-disable-next-line class-methods-use-this
    onRxStyleChanged() {}

    // This function is called every time when some Object State updated, but all changes lands into this.state.values too
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    onStateUpdated(id, state) {}

    escapeHTML(html) {
        let escapeEl = document.createElement('textarea');
        escapeEl.textContent = html;
        const ret = escapeEl.innerHTML;
        escapeEl = null;
        return ret;
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        let oiddata, data, datapoints, template, dpCount;
        let text;
        try {
            oiddata = JSON.parse(this.state.values[`${this.state.rxData.oid}.val`] || '{}');
            data = props.widget.data || {};
            datapoints = [];
            dpCount = data.dpcount ? data.dpcount : 1;
            for (let i = 1; i <= dpCount; i++) {
                if (data['datapoint-oid' + i]) {
                    datapoints[data['datapoint-oid' + i]] = this.state.values[`${data['datapoint-oid' + i]}.val`];
                }
            }

            template = data?.template || '';
            this.renderText =
                ejs.render(template, { widgetid: props.id, data: oiddata, dp: datapoints, style: props.style }) + ' ';
        } catch (e) {
            text = this.escapeHTML(e.message).replace(/(?:\r\n|\r|\n)/g, '<br>');
            text = text.replace(/ /gm, '&nbsp;');
            this.renderText = `<code style="color:red;">${text}</code>`;
        }
        return <InnerHtml html={this.renderText || ' '} />;
    }
}
JSONTemplateWidget.propTypes = {
    systemConfig: PropTypes.object,
    socket: PropTypes.object,
    style: PropTypes.object,
    data: PropTypes.object,
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
