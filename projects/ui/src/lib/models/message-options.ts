export interface MessageOptions {
    type?: 'modal' | 'notification';
    actions?: any[];
    actionsVisible?: boolean;
    class?: string;
    duration?: number;
    title?: string;
    titleIcon?: any;
    icon?: any;
    width?: string;
    verticalPosition?: 'top' | 'bottom'
}