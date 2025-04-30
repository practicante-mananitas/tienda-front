import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoConfirmadoComponent } from './pedido-confirmado.component';

describe('PedidoConfirmadoComponent', () => {
  let component: PedidoConfirmadoComponent;
  let fixture: ComponentFixture<PedidoConfirmadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoConfirmadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoConfirmadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
