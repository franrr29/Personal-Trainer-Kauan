export interface Plan {
    id: number;
    name: string;
    description: string;
    features: string[];
    price: number;
    duration_value: number;
    duration_unit: string;
}