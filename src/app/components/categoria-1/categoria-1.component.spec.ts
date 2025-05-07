import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categoria1Component } from './categoria-1.component';

describe('Categoria1Component', () => {
  let component: Categoria1Component;
  let fixture: ComponentFixture<Categoria1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categoria1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Categoria1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
