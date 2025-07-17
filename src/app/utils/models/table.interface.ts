export interface IColumnDefinition {
    name: string;
    key: string;
    type: string;
    tooltip?: string;
    options?: {
        label: string;
        value: string;
        navigate?: string;
        data?: any;
    }[];
}