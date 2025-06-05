import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDestacadosComponent } from './admin-destacados.component';

describe('AdminDestacadosComponent', () => {
  let component: AdminDestacadosComponent;
  let fixture: ComponentFixture<AdminDestacadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDestacadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDestacadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
