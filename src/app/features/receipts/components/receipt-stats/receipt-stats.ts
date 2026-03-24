import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptService } from '../../../../core/services/receipt.service';
import { ExportDataService } from '../../../../core/services/export-data.service';
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
  receipts: Receipt[] = [];
  isExporting = false;

  constructor(
    private receiptService: ReceiptService,
    private exportDataService: ExportDataService
  ) {}

  ngOnInit(): void {
    this.calculateStats();
  }

  calculateStats(): void {

    const receipts: Receipt[] = this.receiptService.getReceipts();
    this.receipts = receipts;

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

  /**
   * Export data to CSV format
   */
  exportAsCSV(): void {
    this.exportDataService.exportToCSV(this.receipts, 'food_receipts');
  }

  /**
   * Export data to PDF format
   */
  async exportAsPDF(): Promise<void> {
    this.isExporting = true;
    try {
      const stats = {
        totalReceipts: this.totalReceipts,
        totalSpending: this.totalSpending,
        averageSpending: this.averageSpending,
        mostVisitedRestaurant: this.mostVisitedRestaurant,
        totalItems: this.totalItems
      };
      await this.exportDataService.exportToPDF(this.receipts, stats, 'food_receipts');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Gagal mengexport ke PDF');
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Print receipts
   */
  printReceipts(): void {
    const htmlContent = this.exportDataService.exportToHTML(this.receipts, {
      totalReceipts: this.totalReceipts,
      totalSpending: this.totalSpending,
      averageSpending: this.averageSpending,
      mostVisitedRestaurant: this.mostVisitedRestaurant,
      totalItems: this.totalItems
    });

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }

}