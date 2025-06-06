import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPedidosExcedidosComponent } from './admin-pedidos-excedidos.component';

describe('AdminPedidosExcedidosComponent', () => {
  let component: AdminPedidosExcedidosComponent;
  let fixture: ComponentFixture<AdminPedidosExcedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPedidosExcedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPedidosExcedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
