import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { LoginVoluntariosComponent } from './login-voluntarios.component';

describe('LoginVoluntariosComponent', () => {
  let component: LoginVoluntariosComponent;
  let fixture: ComponentFixture<LoginVoluntariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginVoluntariosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginVoluntariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
