import { Component, signal } from '@angular/core';
import { Receipt } from './features/receipts/models/receipt.model';
import { ReceiptFormComponent } from './features/receipts/components/receipt-form/receipt-form';
import { ReceiptListComponent } from './features/receipts/components/receipt-list/receipt-list';
import { ReceiptStats } from './features/receipts/components/receipt-stats/receipt-stats';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReceiptFormComponent,
    ReceiptStats,
    ReceiptListComponent,
    HttpClientModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('FoodReceipt');

  selectedReceipt: Receipt | null = null;

  handleEdit(receipt: Receipt) {
    this.selectedReceipt = receipt;
  }

}