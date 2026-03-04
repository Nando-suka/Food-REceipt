import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReceiptService } from '../../../../core/services/receipt.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-receipt-form',
  imports: [ReactiveFormsModule],
  templateUrl: './receipt-form.html',
  styleUrl: './receipt-form.css',
})
export class ReceiptForm {
  receiptForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private receiptService: ReceiptService
  ) {
    this.receiptForm = this.fb.group({
      restaurantName: ['', Validators.required],
      date: ['', Validators.required],
      items: this.fb.array([])
    });

    this.addItem();
  }

  get items(): FormArray {
    return this.receiptForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        name: ['', Validators.required],
        quantity: [1, Validators.required],
        price: [0, Validators.required]
      })
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  submit(): void {
    if (this.receiptForm.invalid) return;

    const items = this.receiptForm.value.items;

    const totalAmount = items.reduce(
      (sum: number, item: any) =>
        sum + (item.quantity * item.price),
      0
    );

    const newReceipt = {
      id: uuidv4(),
      ...this.receiptForm.value,
      totalAmount
    };

    this.receiptService.addReceipt(newReceipt);
    this.receiptForm.reset();
    this.items.clear();
    this.addItem();

  }
}
