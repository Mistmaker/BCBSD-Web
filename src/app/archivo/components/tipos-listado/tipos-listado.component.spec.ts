import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposListadoComponent } from './tipos-listado.component';

describe('TiposListadoComponent', () => {
  let component: TiposListadoComponent;
  let fixture: ComponentFixture<TiposListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
