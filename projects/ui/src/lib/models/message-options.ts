import { Action } from "./action";
import { Icon } from "./icon";

export interface MessageOptions {
    type?: 'modal' | 'notification';
    actions?: Action[];
    actionsVisible?: boolean;
    class?: string;
    duration?: number;
    title?: string;
    titleIcon?: Icon;
    icon?: Icon;
    width?: string;
}