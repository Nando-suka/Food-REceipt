import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptItem } from './receipt-item';

describe('ReceiptItem', () => {
  let component: ReceiptItem;
  let fixture: ComponentFixture<ReceiptItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
