export interface ReceiptItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Receipt {
    id: string;
    restaurantName: string;
    date: string;
    country: string;
    items: ReceiptItem[];
    totalAmount: number;
}