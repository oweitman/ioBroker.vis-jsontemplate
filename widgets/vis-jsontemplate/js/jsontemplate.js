/*
    ioBroker.vis jsontemplate Widget-Set

    Copyright 2020-2025 oweitman oweitman@gmx.de
*/
'use strict';
/* jshint -W069 */
/* globals $,window,document,systemDictionary,vis,ejs,ace,_ */

// add translations for edit mode
// add translations for edit mode
import { version as pkgVersion } from '../../../package.json';

fetch('widgets/vis-jsontemplate/i18n/words.json').then(async res => {
    const i18n = await res.json();

    $.extend(true, systemDictionary, i18n);
});

// this code can be placed directly in jsontemplate.html
vis.binds['jsontemplate'] = {
    version: pkgVersion,
    /**
     * Log the version of jsontemplate and remove it.
     * Should be called from the main thread, as it logs to the console.
     */
    showVersion: function () {
        if (vis.binds['jsontemplate'].version) {
            console.log(`Version jsontemplate: ${vis.binds['jsontemplate'].version}`);
            vis.binds['jsontemplate'].version = null;
        }
    },
    jsontemplate4: {
        /**
         * Initializes and creates a JSON template widget.
         *
         * @param widgetID - The ID of the widget element.
         * @param view - The view object containing widget information.
         * @param data - Contains configuration data for the widget, including JSON object ID and template.
         * @param style - Style settings for the widget.       *
         * The function checks for the widget element by its ID. If not found, it retries after a delay.
         * It parses the JSON data from the specified object ID, processes additional data points,
         * and binds states if necessary. It then renders the widget using the EJS template with
         * the provided data and style.
         
        Testtemplate:
         
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
        createWidget: function (widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['jsontemplate'].jsontemplate4.createWidget(widgetID, view, data, style);
                }, 100);
            }
            const bound = [];
            // const oiddata = data.json_oid ? JSON.parse(vis.states.attr(`${data.json_oid}.val`)) : {};
            // const template = data.json_template ? data.json_template : '';
            if (data.json_oid) {
                bound.push(data.json_oid);
            }

            const dpCount = data.json_dpCount ? data.json_dpCount : 1;
            const datapoints = [];

            for (let i = 1; i <= dpCount; i++) {
                if (data[`json_dp${i}`]) {
                    datapoints[data[`json_dp${i}`]] = vis.states.attr(`${data[`json_dp${i}`]}.val`);
                    bound.push(data[`json_dp${i}`]);
                }
            }

            if (bound) {
                if (!vis.editMode) {
                    vis.binds['jsontemplate'].bindStates(
                        $div,
                        bound,
                        vis.binds['jsontemplate'].jsontemplate4.onChange.bind({
                            widgetID: widgetID,
                            view: view,
                            data: data,
                            style: style,
                        }),
                    );
                }
            }
            this.render(widgetID, view, data);
            // let text = '';
            // try {
            //     text = ejs.render(template, { widgetID: widgetID, data: oiddata, dp: datapoints });
            // } catch (e) {
            //     text = vis.binds['jsontemplate'].escapeHTML(e.message).replace(/(?:\r\n|\r|\n)/g, '<br>');
            //     text = text.replace(/ /gm, '&nbsp;');
            //     text = `<code style="color:red;">${text}</code>`;
            // }
            // $(`#${widgetID}`).html(text);
        },

        /**
         * Will be called if the value of the bound data point changes.
         *
         * @param e event object
         * @param newVal new value of the bound data point
         */
        onChange: function (e, newVal) {
            if (newVal) {
                vis.binds['jsontemplate'].jsontemplate4.render(this.widgetID, this.view, this.data, this.style);
            }
        },

        /**
         * Renders the widget using the provided EJS template.
         *
         * @param widgetID - The ID of the widget element to be rendered.
         * @param view - The view object containing widget information.
         * @param data - Contains configuration data for the widget, including JSON object ID and template.
         *
         * The function retrieves data associated with the JSON object ID and additional data points.
         * It then uses EJS to render the template with the provided data and updates the widget's HTML content.
         * In case of an error during rendering, it escapes and formats the error message to display it in the widget.
         */
        render: async function (widgetID, view, data) {
            const oiddata = data.json_oid ? JSON.parse(vis.states.attr(`${data.json_oid}.val`)) : {};
            const dpCount = data.json_dpCount ? data.json_dpCount : 1;
            const template = data.json_template ? data.json_template : '';
            const datapoints = [];

            for (let i = 1; i <= dpCount; i++) {
                if (data[`json_dp${i}`]) {
                    datapoints[data[`json_dp${i}`]] = vis.states.attr(`${data[`json_dp${i}`]}.val`);
                }
            }
            let text = '';
            try {
                text = await ejs.render(
                    template,
                    { widgetID: widgetID, data: oiddata, dp: datapoints },
                    { async: true },
                );
            } catch (e) {
                text = vis.binds['jsontemplate'].escapeHTML(e.message).replace(/(?:\r\n|\r|\n)/g, '<br>');
                text = text.replace(/ /gm, '&nbsp;');
                text = `<code style="color:red;">${text}</code>`;
            }
            $(`#${widgetID}`).html(text);
        },
    },
    /**
     * Bind states to an element.
     *
     * First unbind all previously bound states and then get the current values of the states.
     * Then subscribe to the states and bind the callback to the states.
     * Finally, update the states of the element.
     *
     * @param elem - the element to bind the states to
     * @param bound - the states to bind
     * @param change_callback - the callback to call if one of the states changes
     */
    bindStates: function (elem, bound, change_callback) {
        const $div = $(elem);
        const boundstates = $div.data('bound');
        if (boundstates) {
            for (let i = 0; i < boundstates.length; i++) {
                vis.states.unbind(boundstates[i], change_callback);
            }
        }
        $div.data('bound', null);
        $div.data('bindHandler', null);

        vis.conn.gettingStates = 0;
        vis.conn.getStates(
            bound,
            function (error, states) {
                vis.conn.subscribe(bound);
                $div.data('bound', bound);
                $div.data('bindHandler', change_callback);
                for (let i = 0; i < bound.length; i++) {
                    bound[i] = `${bound[i]}.val`;
                    vis.states.bind(bound[i], change_callback);
                }
                vis.updateStates(states);
            }.bind({ change_callback }),
        );
    },
    /**
     * Escapes HTML special characters in a given string.
     *
     * @param html - The string to escape.
     * @returns The escaped string.
     */
    escapeHTML: function (html) {
        let escapeEl = document.createElement('textarea');
        escapeEl.textContent = html;
        const ret = escapeEl.innerHTML;
        escapeEl = null;
        return ret;
    },
    /**
     * Shows a dialog for editing a template.
     *
     * @param widAttr - The attribute of the widget to edit.
     * @returns A object with two properties: 'input' and 'button'. 'input' is a string containing the HTML of a
     *      'textarea' element with id 'inspect_<widAttr>'. 'button' is an object with properties 'icon', 'text', 'title',
     *      'click'. 'click' is a function which is called when the button is clicked. The function shows a dialog with
     *      the 'textarea' element. The dialog has a 'save' and a 'cancel' button. The 'save' button saves the changes to
     *      the attribute and closes the dialog. The 'cancel' button just closes the dialog.
     */
    editEjs: function (widAttr) {
        const that = vis;
        const line = {
            input: `<textarea id="inspect_${widAttr}"></textarea>`,
        };

        line.button = {
            icon: 'ui-icon-note',
            text: false,
            title: _('Select color'),
            click: function (/*event*/) {
                const wdata = $(this).data('wdata');
                let data = {};
                if (that.config['dialog-edit-text']) {
                    data = JSON.parse(that.config['dialog-edit-text']);
                }
                ace.config.setModuleUrl('ace/mode/ejs', 'widgets/jsontemplate/js/mode-ejs.js');
                const editor = ace.edit('dialog-edit-text-textarea');
                let changed = false;
                $('#dialog-edit-text')
                    .dialog({
                        autoOpen: true,
                        width: data.width || 800,
                        height: data.height || 600,
                        modal: true,
                        resize: function () {
                            editor.resize();
                        },
                        open: function (event) {
                            $(event.target).parent().find('.ui-dialog-titlebar-close .ui-button-text').html('');
                            $(this).parent().css({ 'z-index': 1000 });
                            if (data.top !== undefined) {
                                if (data.top >= 0) {
                                    $(this).parent().css({ top: data.top });
                                } else {
                                    $(this).parent().css({ top: 0 });
                                }
                            }
                            if (data.left !== undefined) {
                                if (data.left >= 0) {
                                    $(this).parent().css({ left: data.left });
                                } else {
                                    $(this).parent().css({ left: 0 });
                                }
                            }
                            editor.getSession().setMode('ace/mode/ejs');
                            editor.setOptions({
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                            });
                            editor.$blockScrolling = Infinity;
                            editor.getSession().setUseWrapMode(true);
                            editor.setValue($(`#inspect_${wdata.attr}`).val());
                            editor.navigateFileEnd();
                            editor.focus();
                            editor.getSession().on('change', function () {
                                changed = true;
                            });
                        },
                        beforeClose: function () {
                            const $parent = $('#dialog-edit-text').parent();
                            const pos = $parent.position();
                            that.editSaveConfig(
                                'dialog-edit-text',
                                JSON.stringify({
                                    top: pos.top > 0 ? pos.top : 0,
                                    left: pos.left > 0 ? pos.left : 0,
                                    width: $parent.width(),
                                    height: $parent.height() + 9,
                                }),
                            );

                            if (changed) {
                                if (!window.confirm(_('Changes are not saved!. Continue?'))) {
                                    return false;
                                }
                            }
                        },
                        buttons: [
                            {
                                text: _('Ok'),
                                click: function () {
                                    $(`#inspect_${wdata.attr}`).val(editor.getValue()).trigger('change');
                                    changed = false;
                                    $(this).dialog('close');
                                },
                            },
                            {
                                text: _('Cancel'),
                                click: function () {
                                    $(this).dialog('close');
                                },
                            },
                        ],
                    })
                    .show();
            },
        };
        return line;
    },
};

vis.binds['jsontemplate'].showVersion();

/* remember for strip tag function
str='this string has <i>html</i> code i want to <b>remove</b><br>Link Number 1 -><a href="http://www.bbc.co.uk">BBC</a> Link Number 1<br><p>Now back to normal text and stuff</p>
';
str=str.replace(/<br>/gi, "\n");
str=str.replace(/<p.*>/gi, "\n");
str=str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
str=str.replace(/<(?:.|\s)*?>/g, "");
*/

/*
Remember JSON Path finder https://github.com/joebeachjoebeach/json-path-finder
Remember JSON Formatter https://github.com/mohsen1/json-formatter-js

*/
