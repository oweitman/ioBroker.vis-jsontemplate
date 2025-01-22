// TextDialog
import React, { useEffect, useState } from 'react';

import { I18n } from '@iobroker/adapter-react-v5';
import RSSDialog from './RSSDialog.tsx';
import EJSAceEditor from './EJSAceEditor.tsx';

interface EJSDialogProps {
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    onClose: () => void;
    open: boolean;
    value: string;
}

const EJSDialog = (props: EJSDialogProps) => {
    const [value, changeValue] = useState('');

    useEffect(() => {
        changeValue(props.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);

    return props.open ? (
        <RSSDialog
            keyboardDisabled
            title={I18n.t('vis_2_widgets_json_widget_title')}
            open={!0}
            actionTitle={I18n.t('vis_2_widgets_json_widget_save')}
            action={() => props.onChange(value)}
            onClose={props.onClose}
            minWidth={800}
            actionDisabled={value === props.value}
        >
            <EJSAceEditor value={value} focus height={400} onChange={(newValue) => changeValue(newValue)} />
        </RSSDialog>
    ) : null;
};

export default EJSDialog;
