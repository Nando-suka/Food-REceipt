import { Component, OnInit } from '@angular/core';
import { ReceiptService } from '../../../../core/services/receipt.service';
import { Receipt } from '../../models/receipt.model';
import { NgForOf } from "../../../../../../node_modules/@angular/common/types/_common_module-chunk";
@Component({
  selector: 'app-receipt-list',
  imports: [NgForOf],
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
