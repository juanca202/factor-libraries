/** @deprecated Use 'filled' or 'outlined' instead */
export type MessageActionTypeDeprecated = 'raised' | 'flat' | 'stroked';

export type MessageActionType = MessageActionTypeDeprecated | 'outlined' | 'filled';

export interface MessageAction {
    /**
     * Estilo del botón. Preferir 'outlined' | 'filled'.
     * Los valores 'raised', 'flat' y 'stroked' están descontinuados pero siguen soportados.
     */
    type: MessageActionType;
    label: string;
    value: string | number;
    metadata?: {
        color?: string;
    };
}