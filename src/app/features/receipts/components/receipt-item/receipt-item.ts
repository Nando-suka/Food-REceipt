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
  @Input() index!: number;

  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Receipt>();

  onDelete() {
    console.log("Item Delete Clicked")
    this.delete.emit(this.receipt.id);
  }

  onEdit() {
    console.log("ITEM EDIT CLICKED");
    this.edit.emit(this.receipt);
  }

}
