import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributivoListadoComponent } from './distributivo-listado.component';

describe('DistributivoListadoComponent', () => {
  let component: DistributivoListadoComponent;
  let fixture: ComponentFixture<DistributivoListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributivoListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributivoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
