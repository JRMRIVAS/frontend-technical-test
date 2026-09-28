import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerDetail } from './trainer-detail';

describe('TrainerDetail', () => {
  let component: TrainerDetail;
  let fixture: ComponentFixture<TrainerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
