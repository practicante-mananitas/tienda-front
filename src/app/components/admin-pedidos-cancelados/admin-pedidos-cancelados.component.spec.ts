import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPedidosCanceladosComponent } from './admin-pedidos-cancelados.component';

describe('AdminPedidosCanceladosComponent', () => {
  let component: AdminPedidosCanceladosComponent;
  let fixture: ComponentFixture<AdminPedidosCanceladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPedidosCanceladosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPedidosCanceladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
