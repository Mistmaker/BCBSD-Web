import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntariosListadoComponent } from './voluntarios-listado.component';

describe('VoluntariosListadoComponent', () => {
  let component: VoluntariosListadoComponent;
  let fixture: ComponentFixture<VoluntariosListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoluntariosListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoluntariosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
