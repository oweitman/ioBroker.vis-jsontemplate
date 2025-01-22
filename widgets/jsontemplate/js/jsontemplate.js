/*
    ioBroker.vis jsontemplate Widget-Set

    version: "1.0.0"

    Copyright 2020-2023 oweitman oweitman@gmx.de
*/
'use strict';
/* globals  $,systemDictionary,vis,ejs,document,ace,window,_ */

// add translations for edit mode
fetch('widgets/jsontemplate/i18n/translations.json').then(async res => {
    const i18n = await res.json();

    $.extend(true, systemDictionary, i18n);
});
// this code can be placed directly in jsontemplate.html
vis.binds['jsontemplate'] = {
    version: '1.0.0',
    showVersion: function () {
        if (vis.binds['jsontemplate'].version) {
            console.log(`Version jsontemplate: ${vis.binds['jsontemplate'].version}`);
            vis.binds['jsontemplate'].version = null;
        }
    },
    jsontemplate2: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['jsontemplate'].jsontemplate2.createWidget(widgetID, view, data, style);
                }, 100);
            }
            const bound = [];
            const oiddata = data.json_oid ? JSON.parse(vis.states.attr(`${data.json_oid}.val`)) : {};
            const template = data.json_template ? data.json_template : '';
            if (data.json_oid) {
                bound.push(data.json_oid);
            }

            const dpCount = data.ova_dpCount ? data.ova_dpCount : 1;
            const datapoints = [];

            for (let i = 1; i <= dpCount; i++) {
                if (data[`ova_dp${i}`]) {
                    datapoints[data[`ova_dp${i}`]] = vis.states.attr(`${data[`ova_dp${i}`]}.val`);
                    bound.push(data[`ova_dp${i}`]);
                }
            }

            /*             function onChange(e, newVal, oldVal) {
                            if (newVal) {
                                vis.binds['jsontemplate'].jsontemplate2.createWidget(widgetID, view, data, style);
                            }
                        } */

            if (bound) {
                if (!vis.editMode) {
                    vis.binds['jsontemplate'].bindStates(
                        $div,
                        bound,
                        vis.binds['jsontemplate'].jsontemplate2.onChange.bind({
                            widgetID: widgetID,
                            view: view,
                            data: data,
                            style: style,
                        }),
                    );
                }
            }
            let text = '';
            try {
                text = ejs.render(template, { widgetID: widgetID, data: oiddata, dp: datapoints });
            } catch (e) {
                text = vis.binds['jsontemplate'].escapeHTML(e.message).replace(/(?:\r\n|\r|\n)/g, '<br>');
                text = text.replace(/ /gm, '&nbsp;');
                text = `<code style="color:red;">${text}</code>`;
            }
            if ((data.json_oid || '') == '') {
                text += 'No json datapoint<br>';
            }
            if (template == '') {
                text += 'No template<br>';
            }
            $(`#${widgetID}`).html(text);
        },

        onChange: function (e, newVal /* , oldVal */) {
            if (newVal) {
                vis.binds['jsontemplate'].jsontemplate2.render(this.widgetID, this.view, this.data, this.style);
            }
        },

        render: function (widgetID, view, data /* , style */) {
            const oiddata = data.json_oid ? JSON.parse(vis.states.attr(`${data.json_oid}.val`)) : {};
            const dpCount = data.ova_dpCount ? data.ova_dpCount : 1;
            const template = data.json_template ? data.json_template : '';
            const datapoints = [];

            for (let i = 1; i <= dpCount; i++) {
                if (data[`ova_dp${i}`]) {
                    datapoints[data[`ova_dp${i}`]] = vis.states.attr(`${data[`ova_dp${i}`]}.val`);
                }
            }
            let text = '';
            try {
                text = ejs.render(template, { widgetID: widgetID, data: oiddata, dp: datapoints });
            } catch (e) {
                text = vis.binds['jsontemplate'].escapeHTML(e.message).replace(/(?:\r\n|\r|\n)/g, '<br>');
                text = text.replace(/ /gm, '&nbsp;');
                text = `<code style="color:red;">${text}</code>`;
            }
            $(`#${widgetID}`).html(text);
        },
    },
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
    escapeHTML: function (html) {
        let escapeEl = document.createElement('textarea');
        escapeEl.textContent = html;
        const ret = escapeEl.innerHTML;
        escapeEl = null;
        return ret;
    },
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
