import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptService } from '../../../../core/services/receipt.service';
import { Receipt } from '../../models/receipt.model';
import { ReceiptItem } from '../receipt-item/receipt-item';
@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [CommonModule, ReceiptItem],
  templateUrl: './receipt-list.html',
  styleUrl: './receipt-list.css',
})

export class ReceiptListComponent implements OnInit{
    receipts : Receipt[] = [];
    selectedReceipt: Receipt | null = null;
    @Output() edit = new EventEmitter<Receipt>();

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

    editReceipt(receipt: Receipt): void {
      this.edit.emit(receipt);
    }
}
