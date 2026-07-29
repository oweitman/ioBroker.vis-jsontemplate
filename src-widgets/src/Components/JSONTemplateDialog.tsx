// IODialog
import { useEffect, useRef, useState } from 'react';
import type { JSX, ReactNode } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import type { Breakpoint } from '@mui/system';

import { Close as CloseIcon, Fullscreen, FullscreenExit, Search } from '@mui/icons-material';

import { I18n } from '@iobroker/adapter-react-v5';

interface JSONTemplateDialogProps {
    ActionIcon?: any;
    action?: () => void;
    actionColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    actionDisabled?: boolean;
    actionNoClose?: boolean;
    actionTitle?: string;
    children?: ReactNode;
    closeTitle?: string;
    closeDisabled?: boolean;
    dialogActions?: ReactNode;
    keyboardDisabled?: boolean;
    onClose: () => void;
    open: boolean;
    title: string;
    fullScreen?: boolean;
    maxWidth?: Breakpoint | false;
    minWidth?: number | string;
    noTranslation?: boolean;
    onResize?: () => void;
    onSearch?: () => void;
    resizable?: boolean;
}

interface DialogSize {
    height: number;
    width: number;
}

const JSONTemplateDialog = (props: JSONTemplateDialogProps): JSX.Element | null => {
    const paperRef = useRef<HTMLDivElement | null>(null);
    const [fullScreen, setFullScreen] = useState(!!props.fullScreen);
    const fullScreenRef = useRef(fullScreen);
    const { onResize, resizable } = props;
    const [dialogSize, setDialogSize] = useState<DialogSize>({
        height: 600,
        width: typeof props.minWidth === 'number' ? Math.max(props.minWidth + 48, 900) : 900,
    });

    useEffect(() => {
        if (!resizable || fullScreen || !paperRef.current) {
            return undefined;
        }

        const paper = paperRef.current;
        const observer = new ResizeObserver(() => {
            if (fullScreenRef.current) {
                return;
            }
            const rect = paper.getBoundingClientRect();
            setDialogSize(previousSize =>
                Math.abs(previousSize.width - rect.width) < 1 && Math.abs(previousSize.height - rect.height) < 1
                    ? previousSize
                    : { width: rect.width, height: rect.height },
            );
            onResize?.();
        });
        observer.observe(paper);

        return () => observer.disconnect();
    }, [fullScreen, onResize, resizable]);

    useEffect(() => {
        const frame = requestAnimationFrame(() => onResize?.());
        return () => cancelAnimationFrame(frame);
    }, [fullScreen, onResize]);

    if (!props.open) {
        return null;
    }

    return (
        <Dialog
            onClose={props.closeDisabled ? undefined : props.onClose}
            open
            fullScreen={fullScreen}
            maxWidth={props.resizable ? false : props.maxWidth || 'md'}
            slotProps={{
                paper: {
                    ref: paperRef,
                    sx:
                        props.resizable && !fullScreen
                            ? {
                                  boxSizing: 'border-box',
                                  height: dialogSize.height,
                                  maxHeight: 'calc(100vh - 64px)',
                                  maxWidth: 'calc(100vw - 64px)',
                                  minHeight: 360,
                                  minWidth: props.minWidth || 500,
                                  overflow: 'hidden',
                                  resize: 'both',
                                  width: dialogSize.width,
                              }
                            : undefined,
                },
            }}
        >
            <DialogTitle sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Box sx={{ flexGrow: 1 }}>{props.noTranslation ? props.title : I18n.t(props.title)}</Box>
                {props.onSearch ? (
                    <IconButton
                        aria-label="Search"
                        onClick={props.onSearch}
                        title="Search"
                    >
                        <Search />
                    </IconButton>
                ) : null}
                {props.resizable ? (
                    <IconButton
                        aria-label={fullScreen ? 'Restore window' : 'Full screen'}
                        onClick={() => {
                            const nextFullScreen = !fullScreen;
                            if (nextFullScreen && paperRef.current) {
                                const rect = paperRef.current.getBoundingClientRect();
                                setDialogSize({ height: rect.height, width: rect.width });
                            }
                            fullScreenRef.current = nextFullScreen;
                            setFullScreen(nextFullScreen);
                        }}
                        title={fullScreen ? 'Restore window' : 'Full screen'}
                    >
                        {fullScreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: props.minWidth || undefined }}
                onKeyUp={e => {
                    if (props.action) {
                        if (!props.actionDisabled && !props.keyboardDisabled) {
                            if (e.key === 'Enter') {
                                props.action();
                                if (!props.actionNoClose) {
                                    props.onClose();
                                }
                            }
                        }
                    }
                }}
            >
                {props.children}
            </DialogContent>
            <DialogActions>
                {props.dialogActions || null}
                {props.actionTitle ? (
                    <Button
                        variant="contained"
                        onClick={() => {
                            props.action && props.action();
                            if (!props.actionNoClose) {
                                props.onClose();
                            }
                        }}
                        color={props.actionColor || 'primary'}
                        disabled={props.actionDisabled}
                        startIcon={props.ActionIcon ? <props.ActionIcon /> : undefined}
                    >
                        {props.noTranslation ? props.actionTitle : I18n.t(props.actionTitle)}
                    </Button>
                ) : null}
                <Button
                    variant="contained"
                    sx={{ backgroundColor: 'grey' }}
                    onClick={props.onClose}
                    disabled={props.closeDisabled}
                    startIcon={<CloseIcon />}
                >
                    {props.noTranslation && props.closeTitle ? props.closeTitle : I18n.t(props.closeTitle || 'Cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JSONTemplateDialog;
