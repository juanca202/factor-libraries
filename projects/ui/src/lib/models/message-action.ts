export interface MessageAction {
    type: 'raised' | 'flat' | 'stroked';
    label: string;
    value: string;
    metadata?: {
        color?: string;
    };
}