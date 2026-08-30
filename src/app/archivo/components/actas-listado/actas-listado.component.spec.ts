import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActasListadoComponent } from './actas-listado.component';

describe('ActasListadoComponent', () => {
  let component: ActasListadoComponent;
  let fixture: ComponentFixture<ActasListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActasListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
