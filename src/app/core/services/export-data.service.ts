import { Injectable } from '@angular/core';
import { Receipt } from '../../features/receipts/models/receipt.model';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {

  constructor() { }

  /**
   * Export receipts to CSV file
   */
  exportToCSV(receipts: Receipt[], filename: string = 'food_receipts'): void {
    if (receipts.length === 0) {
      alert('Tidak ada data untuk diexport!');
      return;
    }

    // Header CSV
    const headers = [
      'ID',
      'Restaurant Name',
      'Date',
      'Country',
      'Items',
      'Total Amount'
    ];

    // Konversi data ke CSV rows
    const rows = receipts.map(receipt => [
      receipt.id,
      receipt.restaurantName,
      receipt.date,
      receipt.country,
      receipt.items.map(item => `${item.name} (${item.quantity}x)`).join('; '),
      receipt.totalAmount
    ]);

    // Buat CSV content
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      const escapedRow = row.map(cell => {
        // Escape double quotes dan wrap dalam quotes jika ada comma
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      });
      csvContent += escapedRow.join(',') + '\n';
    });

    // Download CSV
    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  /**
   * Export receipts to PDF file with summary
   */
  async exportToPDF(
    receipts: Receipt[],
    stats?: {
      totalReceipts: number;
      totalSpending: number;
      averageSpending: number;
      mostVisitedRestaurant: string;
      totalItems: number;
    },
    filename: string = 'food_receipts'
  ): Promise<void> {
    if (receipts.length === 0) {
      alert('Tidak ada data untuk diexport!');
      return;
    }

    const doc = new (jsPDF as any).jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 10;
    const margin = 10;
    const lineHeight = 7;

    // Title
    doc.setFontSize(16);
    doc.text('Food Receipt Report', margin, currentY);
    currentY += 15;

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, currentY);
    currentY += 10;

    // Statistics Section
    if (stats) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Summary Statistics', margin, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setTextColor(50);
      const statsText = [
        `Total Receipts: ${stats.totalReceipts}`,
        `Total Spending: ${this.formatCurrency(stats.totalSpending)}`,
        `Average per Receipt: ${this.formatCurrency(stats.averageSpending)}`,
        `Most Visited: ${stats.mostVisitedRestaurant || 'N/A'}`,
        `Total Items: ${stats.totalItems}`
      ];

      statsText.forEach(text => {
        doc.text(text, margin, currentY);
        currentY += lineHeight;
      });
      currentY += 5;
    }

    // Receipts Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Receipt Details', margin, currentY);
    currentY += 8;

    receiptIndex = 1;
    receipts.forEach((receipt, index) => {
      // Check if need new page
      if (currentY > pageHeight - 30) {
        doc.addPage();
        currentY = margin;
      }

      // Receipt header
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`${index + 1}. ${receipt.restaurantName}`, margin, currentY);
      currentY += lineHeight;

      // Receipt details
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text(`Date: ${receipt.date} | Country: ${receipt.country}`, margin + 5, currentY);
      currentY += lineHeight;

      // Items
      doc.setTextColor(100);
      receipt.items.forEach(item => {
        const itemText = `• ${item.name} - Qty: ${item.quantity}, Price: ${this.formatCurrency(item.price)}`;
        doc.text(itemText, margin + 10, currentY);
        currentY += lineHeight;
      });

      // Total
      doc.setTextColor(0);
      doc.setFont(undefined, 'bold');
      doc.text(`Total: ${this.formatCurrency(receipt.totalAmount)}`, margin + 5, currentY);
      doc.setFont(undefined, 'normal');
      currentY += lineHeight + 5;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Total Receipts: ${receipts.length}`, margin, pageHeight - 10);

    doc.save(`${filename}.pdf`);
  }

  /**
   * Export to HTML Table (untuk print preview)
   */
  exportToHTML(receipts: Receipt[], stats?: any): string {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Food Receipt Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
        .stat-box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9; }
        .stat-box h3 { margin: 0; color: #666; font-size: 12px; }
        .stat-box p { margin: 10px 0 0 0; font-size: 20px; font-weight: bold; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #4CAF50; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f5f5f5; }
        .total { font-weight: bold; color: #4CAF50; }
        .generated { color: #999; font-size: 12px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>Food Receipt Report</h1>
      <div class="generated">Generated: ${new Date().toLocaleString()}</div>
    `;

    // Add Statistics
    if (stats) {
      html += `
      <div class="stats">
        <div class="stat-box">
          <h3>Total Receipts</h3>
          <p>${stats.totalReceipts}</p>
        </div>
        <div class="stat-box">
          <h3>Total Spending</h3>
          <p>${this.formatCurrency(stats.totalSpending)}</p>
        </div>
        <div class="stat-box">
          <h3>Average Spending</h3>
          <p>${this.formatCurrency(stats.averageSpending)}</p>
        </div>
        <div class="stat-box">
          <h3>Most Visited</h3>
          <p>${stats.mostVisitedRestaurant || 'N/A'}</p>
        </div>
        <div class="stat-box">
          <h3>Total Items</h3>
          <p>${stats.totalItems}</p>
        </div>
      </div>
      `;
    }

    // Add Table
    html += `
    <table>
      <thead>
        <tr>
          <th>Restaurant</th>
          <th>Date</th>
          <th>Country</th>
          <th>Items</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
    `;

    receipts.forEach(receipt => {
      const itemsText = receipt.items.map(item => `${item.name} (${item.quantity})`).join(', ');
      html += `
        <tr>
          <td>${receipt.restaurantName}</td>
          <td>${receipt.date}</td>
          <td>${receipt.country}</td>
          <td>${itemsText}</td>
          <td class="total">${this.formatCurrency(receipt.totalAmount)}</td>
        </tr>
      `;
    });

    html += `
      </tbody>
    </table>
    </body>
    </html>
    `;

    return html;
  }

  /**
   * Helper: Download file
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Helper: Format currency
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(value);
  }
}

let receiptIndex = 1;
