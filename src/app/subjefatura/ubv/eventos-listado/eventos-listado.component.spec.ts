import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { EventosListadoComponent } from './eventos-listado.component';

describe('EventosListadoComponent', () => {
  let component: EventosListadoComponent;
  let fixture: ComponentFixture<EventosListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosListadoComponent],
      providers: [provideNoopAnimations(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
