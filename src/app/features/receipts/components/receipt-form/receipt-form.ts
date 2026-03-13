import { Component, input } from '@angular/core';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';   // 
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReceiptService } from '../../../../core/services/receipt.service';
import { v4 as uuidv4 } from 'uuid';
import { Receipt } from '../../models/receipt.model';
import { CountryService } from '../../../../core/country.service';

@Component({
  selector: 'app-receipt-form',
  standalone: true,
  imports: [
    CommonModule,        //
    ReactiveFormsModule
  ],
  templateUrl: './receipt-form.html',
  styleUrl: './receipt-form.css'
})
export class ReceiptFormComponent implements OnChanges {

  receiptForm: FormGroup;
  isEditMode = false;
  editingReceiptId: string | null = null;
  countries: string[] = [];
  @Input() receiptToEdit: Receipt | null = null;

  constructor(
    private fb: FormBuilder,
    private receiptService: ReceiptService,
    private countryService: CountryService
  ) {

    this.receiptForm = this.fb.group({
      restaurantName: ['', Validators.required],
      date: ['', Validators.required],
      country: ['', Validators.required],
      items: this.fb.array([])
    });

    this.addItem();
    this.loadCountries();
  }

  get items(): FormArray {
    return this.receiptForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        name: ['', Validators.required],
        quantity: [1],
        price: [0]
      })
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  loadReceiptForEdit(receipt: Receipt): void {
    this.isEditMode = true;
    this.editingReceiptId = receipt.id;

    this.receiptForm.patchValue({
      restaurantName: receipt.restaurantName,
      date: receipt.date
    });

    this.items.clear();

    receipt.items.forEach(item => {
      this.items.push(
        this.fb.group({
          name: [item.name],
          quantity: [item.quantity],
          price: [item.price]
        })
      );
    });
  }
  resetForm(): void {

    this.isEditMode = false;
    this.editingReceiptId = null;

    this.receiptForm.reset();
    this.items.clear();
    this.addItem();

  }

  submit(): void {

    if (this.receiptForm.invalid) return;

    const items = this.receiptForm.value.items;

    const totalAmount = items.reduce(
      (sum: number, item: any) =>
        sum + (item.quantity * item.price),
      0
    );

    if (this.isEditMode && this.editingReceiptId) {

      const updatedReceipt = {
        id: this.editingReceiptId,
        ...this.receiptForm.value,
        totalAmount
      };

      this.receiptService.updateReceipt(updatedReceipt);

    } else {

      const newReceipt = {
        id: uuidv4(),
        ...this.receiptForm.value,
        totalAmount
      };

      this.receiptService.addReceipt(newReceipt);

    }

    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receiptToEdit'] && this.receiptToEdit) {
      this.loadReceiptForEdit(this.receiptToEdit);
    }
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(data => {
      console.log(data); // DEBUG
      this.countries = data;
    });
  }
}