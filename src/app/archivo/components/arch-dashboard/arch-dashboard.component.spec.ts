import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchDashboardComponent } from './arch-dashboard.component';

describe('ArchDashboardComponent', () => {
  let component: ArchDashboardComponent;
  let fixture: ComponentFixture<ArchDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
