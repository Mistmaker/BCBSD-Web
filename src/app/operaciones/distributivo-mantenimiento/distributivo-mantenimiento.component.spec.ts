import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributivoMantenimientoComponent } from './distributivo-mantenimiento.component';

describe('DistributivoMantenimientoComponent', () => {
  let component: DistributivoMantenimientoComponent;
  let fixture: ComponentFixture<DistributivoMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributivoMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributivoMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
