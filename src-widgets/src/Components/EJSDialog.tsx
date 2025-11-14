// TextDialog
import React, { useEffect, useState } from 'react';

import { I18n } from '@iobroker/adapter-react-v5';
import JSONTemplateDialog from './JSONTemplateDialog';
import EJSAceEditor from './EJSAceEditor';

interface EJSDialogProps {
    onChange: (value: string) => void;
    onClose: () => void;
    open: boolean;
    value: string;
    themeType: string;
}

const EJSDialog = (props: EJSDialogProps): React.JSX.Element | null => {
    const [value, changeValue] = useState('');

    useEffect(() => {
        changeValue(props.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);

    return props.open ? (
        <JSONTemplateDialog
            keyboardDisabled
            title={I18n.t('vis-jsontemplate_dialog_title')}
            open={!0}
            actionTitle={I18n.t('vis-jsontemplate_dialog_save')}
            action={() => props.onChange(value)}
            onClose={props.onClose}
            minWidth={800}
            actionDisabled={value === props.value}
        >
            <EJSAceEditor
                value={value}
                focus
                height={400}
                onChange={newValue => changeValue(newValue)}
                themeType={props.themeType}
            />
        </JSONTemplateDialog>
    ) : null;
};

export default EJSDialog;
