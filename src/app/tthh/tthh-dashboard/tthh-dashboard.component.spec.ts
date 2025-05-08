import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TthhDashboardComponent } from './tthh-dashboard.component';

describe('TthhDashboardComponent', () => {
  let component: TthhDashboardComponent;
  let fixture: ComponentFixture<TthhDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TthhDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TthhDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
