import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReceiptFormComponent } from './features/receipts/components/receipt-form/receipt-form';
import { ReceiptListComponent } from './features/receipts/components/receipt-list/receipt-list';

@Component({
  selector: 'app-root',
  imports: [
    ReceiptFormComponent,
    ReceiptListComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FoodReceipt');
}
