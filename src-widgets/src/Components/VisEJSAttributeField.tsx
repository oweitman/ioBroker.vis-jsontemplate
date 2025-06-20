import React, { useState } from 'react';

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
}
const VisEJSAttributeField = ({
    field, // field properties: {name, label, type, set, singleName, component,...}
    data, // widget data
    onDataChange, // project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, __settings: {}}
}: VisEJSAttributeFieldProps): React.JSX.Element => {
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
                value={data && data[field.name]}
                fullWidth
                error={!!error}
                helperText={typeof error === 'string' ? I18n.t(error) : null}
                onChange={e => {
                    onDataChange({
                        [field.name]: e.target.value,
                    }); // returns all changed field as object.
                    // If some propertiy is null, so it will be deleted from data
                }}
                InputProps={{
                    endAdornment: (
                        <Button
                            size="small"
                            onClick={() => setIdDialog(true)}
                        >
                            <EditIcon />
                        </Button>
                    ),
                }}
                rows={2}
            />
            {idDialog ? (
                <EJSDialog
                    open={!0}
                    value={data[field.name]}
                    onChange={newValue => onDataChange({ [field.name]: newValue })}
                    onClose={() => setIdDialog(false)}
                />
            ) : null}
        </>
    );
};
export default VisEJSAttributeField;
