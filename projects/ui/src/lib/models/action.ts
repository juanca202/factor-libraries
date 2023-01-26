export interface Action {
    children?: Action[];
    class?: string;
    click?: (event?: Event) => void;
    disabled?: boolean;
    iconCollection?: string;
    iconName?: string;
    id?: string;
    label?: string;
    url?: string;
    type?: string;
    metadata?: any;
    value?: any;
}