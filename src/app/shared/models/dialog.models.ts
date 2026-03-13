export interface DialogProps {
    title?: string;
    description?: string;
    width?: string | number;
    showCloseButton?: boolean;
    icon?: string;
    iconColor?: string;
    showBody?: boolean;
    bodyPadding?: boolean;
}

export interface ConfirmDialogProps extends DialogProps {
    confirmText?: string;
    confirmColor?: string;
    confirmIcon?: string;
    cancelText?: string;
    loading?: boolean;
}
