export interface Product {
    _id?: string;
    description: string;
    brand?: string;
    location: string;
    expiration_date: string;
    insertion_date?: string;
    units: number;

    optional?: string;

    // [2023-07-03] Aggiunta gestione di peso, calorie*100g e calcolo calorie
    cal?: number | undefined;
    wgt?: number | undefined;
}