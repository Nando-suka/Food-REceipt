import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptService } from '../../../../core/services/receipt.service';
import { Receipt } from '../../models/receipt.model';
@Component({
  selector: 'app-receipt-list',
  imports: [CommonModule],
  templateUrl: './receipt-list.html',
  styleUrl: './receipt-list.css',
})

export class ReceiptListComponent implements OnInit{
    receipts : Receipt[] = [];

    constructor(private receiptService: ReceiptService) {}

    ngOnInit(): void {
      this.loadReceipts();
    }

    loadReceipts(): void {
      this.receipts = this.receiptService.getReceipts();
    }

    deleteReceipt(id: string): void {
      this.receiptService.deleteReceipt(id);
      this.loadReceipts();
    }
}
