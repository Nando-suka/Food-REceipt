import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt } from '../../models/receipt.model';
@Component({
  selector: 'app-receipt-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt-item.html',
  styleUrl: './receipt-item.css',
})

export class ReceiptItem {

  @Input() receipt!: Receipt;

  @Output() delete = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.receipt.id);
  }

}
