export interface ReceiptItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Receipt {
    id: string;
    restaurantName: string;
    date: string;
    items: ReceiptItem[];
    totalAmount: number;
}