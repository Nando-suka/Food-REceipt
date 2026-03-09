import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptStats } from './receipt-stats';

describe('ReceiptStats', () => {
  let component: ReceiptStats;
  let fixture: ComponentFixture<ReceiptStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
