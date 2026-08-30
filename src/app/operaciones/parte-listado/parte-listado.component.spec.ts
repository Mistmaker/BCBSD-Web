import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParteListadoComponent } from './parte-listado.component';

describe('ParteListadoComponent', () => {
  let component: ParteListadoComponent;
  let fixture: ComponentFixture<ParteListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParteListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParteListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
