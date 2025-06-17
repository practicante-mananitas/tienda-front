import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPedidosEntregadosComponent } from './admin-pedidos-entregados.component';

describe('AdminPedidosEntregadosComponent', () => {
  let component: AdminPedidosEntregadosComponent;
  let fixture: ComponentFixture<AdminPedidosEntregadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPedidosEntregadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPedidosEntregadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
