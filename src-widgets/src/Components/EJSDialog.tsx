// TextDialog
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

import { I18n } from '@iobroker/adapter-react-v5';
import JSONTemplateDialog from './JSONTemplateDialog';
const EJSAceEditor = lazy(() => import('./EJSAceEditor'));

interface EJSDialogProps {
    onChange: (value: string) => void;
    onClose: () => void;
    open: boolean;
    value: string;
    themeType: string;
}

const EJSDialog = (props: EJSDialogProps): JSX.Element | null => {
    const [value, changeValue] = useState('');
    const editorRef = useRef<any>(null);

    const resizeEditor = useCallback(() => editorRef.current?.editor?.resize(), []);
    const openSearch = useCallback(() => editorRef.current?.editor?.execCommand('find'), []);

    useEffect(() => {
        changeValue(props.value);
    }, [props.open, props.value]);

    return props.open ? (
        <JSONTemplateDialog
            keyboardDisabled
            title={I18n.t('vis-jsontemplate_json_dialog_title')}
            open
            actionTitle={I18n.t('vis-jsontemplate_json_dialog_save')}
            action={() => props.onChange(value)}
            onClose={props.onClose}
            minWidth={800}
            actionDisabled={value === props.value}
            onResize={resizeEditor}
            onSearch={openSearch}
            resizable
        >
            <Suspense fallback={null}>
                <EJSAceEditor
                    value={value}
                    focus
                    height="100%"
                    onChange={newValue => changeValue(newValue)}
                    refEditor={editorRef}
                    themeType={props.themeType}
                />
            </Suspense>
        </JSONTemplateDialog>
    ) : null;
};

export default EJSDialog;
