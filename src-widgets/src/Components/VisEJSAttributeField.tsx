import { useState } from 'react';
import type { JSX } from 'react';

import { TextField, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { I18n } from '@iobroker/adapter-react-v5';

import EJSDialog from './EJSDialog';

interface VisEJSAttributeFieldProps {
    field: {
        name: string;
        label: string;
        type: string;
        set: any;
        singleName: string;
        component: any;
    };
    data: any;
    onDataChange: (data: any) => void;
    props: any;
    visSocket: any;
}
const VisEJSAttributeField = ({
    field, // field properties: {name, label, type, set, singleName, component,...}
    data, // widget data
    onDataChange, // project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, __settings: {}}
    props,
}: VisEJSAttributeFieldProps): JSX.Element => {
    const error = '';

    const [idDialog, setIdDialog] = useState(false);

    return (
        <>
            <TextField
                sx={{
                    '.MuiInputBase-input': {
                        fontSize: '80%',
                    },
                }}
                size="small"
                // placeholder={isDifferent ? t('different') : null}
                variant="standard"
                value={data?.[field.name] ?? ''}
                fullWidth
                error={!!error}
                helperText={typeof error === 'string' ? I18n.t(error) : null}
                onChange={e => {
                    onDataChange({
                        [field.name]: e.target.value,
                    }); // returns all changed field as object.
                    // If some propertiy is null, so it will be deleted from data
                }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <Button
                                size="small"
                                aria-label={I18n.t('vis-jsontemplate_json_dialog_title')}
                                onClick={() => setIdDialog(true)}
                            >
                                <EditIcon />
                            </Button>
                        ),
                    },
                }}
                rows={2}
            />
            {idDialog ? (
                <EJSDialog
                    open
                    value={data?.[field.name] ?? ''}
                    onChange={newValue => onDataChange({ [field.name]: newValue })}
                    onClose={() => setIdDialog(false)}
                    themeType={props.context.theme.name}
                />
            ) : null}
        </>
    );
};
export default VisEJSAttributeField;
