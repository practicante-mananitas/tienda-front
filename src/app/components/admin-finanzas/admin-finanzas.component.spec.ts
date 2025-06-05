import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFinanzasComponent } from './admin-finanzas.component';

describe('AdminFinanzasComponent', () => {
  let component: AdminFinanzasComponent;
  let fixture: ComponentFixture<AdminFinanzasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFinanzasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFinanzasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
