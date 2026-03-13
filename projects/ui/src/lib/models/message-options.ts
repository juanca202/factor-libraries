import { MessagePosition } from "../constants/message-position";
import { MessageType } from "../constants/message-type";
import { MessageAction } from "./message-action";

export interface MessageOptions {
    type?: MessageType;
    actions?: MessageAction[];
    actionsVisible?: boolean;
    class?: string;
    duration?: number;
    title?: string;
    titleIcon?: any;
    icon?: any;
    width?: string;
    verticalPosition?: MessagePosition
}