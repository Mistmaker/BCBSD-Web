import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbjDashboardComponent } from './sbj-dashboard.component';

describe('SbjDashboardComponent', () => {
  let component: SbjDashboardComponent;
  let fixture: ComponentFixture<SbjDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbjDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SbjDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
