import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosListadoComponent } from './documentos-listado.component';

describe('DocumentosListadoComponent', () => {
  let component: DocumentosListadoComponent;
  let fixture: ComponentFixture<DocumentosListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
