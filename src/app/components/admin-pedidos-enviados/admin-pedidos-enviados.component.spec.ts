import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPedidosEnviadosComponent } from './admin-pedidos-enviados.component';

describe('AdminPedidosEnviadosComponent', () => {
  let component: AdminPedidosEnviadosComponent;
  let fixture: ComponentFixture<AdminPedidosEnviadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPedidosEnviadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPedidosEnviadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
