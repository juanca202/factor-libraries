export const MESSAGE_TYPE = {
    MODAL: 'modal',
    NOTIFICATION: 'notification'
};

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
