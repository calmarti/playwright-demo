export type Order = 'asc' | 'desc';
export type By = 'name' | 'price';

export interface Item {
    id: number,
    name: string,
    description: string,
    price: number
}