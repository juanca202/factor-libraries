export const MESSAGE_POSITION = {
    TOP: 'top',
    BOTTOM: 'bottom'
};

export type MessagePosition = (typeof MESSAGE_POSITION)[keyof typeof MESSAGE_POSITION];
