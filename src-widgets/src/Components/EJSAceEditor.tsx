// CustomAceEditor
import React, { useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import Ace from 'ace-builds';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools'; // autocomplete
import 'ace-builds/src-noconflict/theme-clouds_midnight';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/mode-ejs';

import { I18n } from '@iobroker/adapter-react-v5';

/* globals themeType */

Ace.config.set('basePath', './lib/js/ace');
Ace.config.setModuleUrl('ace/ext/language_tools', './lib/js/ace/ext-language_tools.js');
Ace.config.setModuleUrl('ace/theme/clouds_midnight', './lib/js/ace/theme-clouds_midnight.js');
Ace.config.setModuleUrl('ace/theme/chrome', './lib/js/ace/theme-chrome.js');
Ace.config.setModuleUrl('ace/ext/searchbox', './lib/js/ace/ext-searchbox.js');

Ace.config.setModuleUrl('ace/snippets/ejs', './lib/js/ace/snippets/ejs.js');
Ace.config.setModuleUrl('ace/mode/ejs', './lib/js/ace/mode-ejs.js');

interface EJSAceEditorProps {
    // eslint-disable-next-line no-unused-vars
    onChange?: (value: string) => void;
    value: string;
    readOnly?: boolean;
    height?: number | string;
    width?: number | string;
    // eslint-disable-next-line no-unused-vars
    refEditor?: (editor: AceEditor) => void;
    error?: boolean;
    focus?: boolean;
}

export const EJSAceEditor = (props: EJSAceEditorProps) => {
    const refEditor = useRef();
    useEffect(() => {
        let content: HTMLInputElement | null = null;
        let timer: ReturnType<typeof setTimeout>;
        const keyDown = (e: KeyboardEvent) => {
            if (e.key === 'f' && e.ctrlKey) {
                // make translations
                timer = setInterval(() => {
                    if (!content) return;
                    const parent = content.parentNode;
                    if (!parent) return;
                    let el: HTMLInputElement | null = parent.querySelector('.ace_search_field') as HTMLInputElement;
                    if (el) {
                        clearInterval(timer);
                        // @ts-ignore
                        timer = null;
                    }
                    if (el?.placeholder === 'Search for') {
                        el.placeholder = I18n.t('ace_Search for');
                    }
                    el = parent.querySelector('.ace_searchbtn[action="findAll"]');
                    if (el?.innerHTML === 'All') {
                        el.innerHTML = I18n.t('ace_All');
                    }
                    el = parent.querySelector('.ace_button[action="toggleRegexpMode"]');
                    if (el?.title === 'RegExp Search') {
                        el.title = I18n.t('ace_RegExp Search');
                    }
                    el = parent.querySelector('.ace_button[action="toggleCaseSensitive"]');
                    if (el?.title === 'CaseSensitive Search') {
                        el.title = I18n.t('ace_CaseSensitive Search');
                    }
                    el = parent.querySelector('.ace_button[action="toggleWholeWords"]');
                    if (el?.title === 'Whole Word Search') {
                        el.title = I18n.t('ace_Whole Word Search');
                    }
                    el = parent.querySelector('.ace_button[action="searchInSelection"]');
                    if (el?.title === 'Search In Selection') {
                        el.title = I18n.t('ace_Search In Selection');
                    }
                    el = parent.querySelector('.ace_button[action="toggleReplace"]');
                    if (el?.title === 'Toggle Replace mode') {
                        el.title = I18n.t('ace_Toggle Replace mode');
                    }

                    content?.removeEventListener('keydown', keyDown);
                    content = null;
                }, 100);
            }
        };

        if (I18n.getLanguage() !== 'en') {
            setTimeout(() => {
                content = window.document.querySelector('.ace_text-input');
                content?.addEventListener('keydown', keyDown);
            }, 200);
        }

        return () => {
            timer && clearTimeout(timer);
            // @ts-ignore
            timer = null;
            content?.removeEventListener('keydown', keyDown);
            content = null;
        };
    }, []);

    return <div
        style={{
            width: props.width || '100%',
            height: props.height || '100%',
            border: props.error ? '1px solid #800' : '1px solid transparent',
        }}
        // @ts-ignore
        ref={refEditor}
    >
        <AceEditor
            mode="ejs"
            // @ts-ignore
            theme={themeType === 'dark' ? 'clouds_midnight' : 'chrome'}
            width="100%"
            height="100%"
            value={props.value}
            // @ts-ignore
            onChange={newValue => props.onChange(newValue)}
            readOnly={props.readOnly || false}
            focus={props.focus}
            ref={props.refEditor}
            highlightActiveLine
            enableBasicAutocompletion
            enableLiveAutocompletion
            enableSnippets
        />
    </div>;
};

export default EJSAceEditor;
