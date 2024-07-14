import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerInformationComponent } from './modal-customer-information.component';

describe('ModalCustomerInformationComponent', () => {
  let component: ModalCustomerInformationComponent;
  let fixture: ComponentFixture<ModalCustomerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCustomerInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCustomerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
