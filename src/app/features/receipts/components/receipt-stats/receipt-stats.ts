import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptService } from '../../../../core/services/receipt.service';
import { Receipt } from '../../models/receipt.model';
@Component({
  selector: 'app-receipt-stats',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './receipt-stats.html',
  styleUrl: './receipt-stats.css',
})

export class ReceiptStats implements OnInit{

  // Make a initialitation stats
  totalReceipts = 0
  totalSpending = 0
  averageSpending = 0
  mostVisitedRestaurant = '';
  totalItems = 0;

  constructor(private receiptService: ReceiptService) {}

  ngOnInit(): void {
    this.calculateStats();
  }

  calculateStats(): void {

    const receipts: Receipt[] = this.receiptService.getReceipts();

    this.totalReceipts = receipts.length;

    this.totalSpending = receipts.reduce(
      (sum, r) => sum + r.totalAmount,
      0
    );

    this.averageSpending = this.totalReceipts
      ? this.totalSpending / this.totalReceipts
      : 0;

    this.totalItems = receipts.reduce(
      (sum, r) => sum + r.items.reduce(
        (itemSum, item) => itemSum + item.quantity,
        0
      ),
      0
    );

    const restaurantCount: { [key: string]: number } = {};

    receipts.forEach(r => {
      restaurantCount[r.restaurantName] =
        (restaurantCount[r.restaurantName] || 0) + 1;
    });

    this.mostVisitedRestaurant =
      Object.keys(restaurantCount).reduce(
        (a, b) =>
          restaurantCount[a] > restaurantCount[b] ? a : b,
        Object.keys(restaurantCount)[0] || ''
      );

  }

}