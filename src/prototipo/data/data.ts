export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export const DATA = [
    {
        id: crypto.randomUUID() as string,
        name: 'Producto1',
        price: 1,
        stock: 100,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: crypto.randomUUID,
        name: 'Producto2',
        price: 2,
        stock: 100,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: crypto.randomUUID,
        name: 'Producto3',
        price: 3,
        stock: 100,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
    },
];
