import { Injectable } from '@angular/core';
import { Receipt } from './../../features/receipts/models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  private storageKey = 'food_receipts';

  getReceipts(): Receipt[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addReceipt(receipt: Receipt): void {
    const receipts = this.getReceipts();
    receipts.push(receipt);
    localStorage.setItem(this.storageKey, JSON.stringify(receipts));
  }

  deleteReceipt(id: string): void {
    const receipts = this.getReceipts().filter(r => r.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(receipts));
  }
}