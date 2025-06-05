import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResumenComponent } from './admin-resumen.component';

describe('AdminResumenComponent', () => {
  let component: AdminResumenComponent;
  let fixture: ComponentFixture<AdminResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
