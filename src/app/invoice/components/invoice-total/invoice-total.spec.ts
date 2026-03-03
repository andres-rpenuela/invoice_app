import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTotalComponent } from './invoice-total';

describe('InvoiceTotal', () => {
  let component: InvoiceTotalComponent;
  let fixture: ComponentFixture<InvoiceTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceTotalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceTotalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
