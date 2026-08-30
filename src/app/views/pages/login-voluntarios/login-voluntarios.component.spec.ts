import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginVoluntariosComponent } from './login-voluntarios.component';

describe('LoginVoluntariosComponent', () => {
  let component: LoginVoluntariosComponent;
  let fixture: ComponentFixture<LoginVoluntariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginVoluntariosComponent]
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
