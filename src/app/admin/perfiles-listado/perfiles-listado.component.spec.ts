import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesListadoComponent } from './perfiles-listado.component';

describe('PerfilesListadoComponent', () => {
  let component: PerfilesListadoComponent;
  let fixture: ComponentFixture<PerfilesListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilesListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
