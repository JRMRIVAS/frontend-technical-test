import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerCard } from './trainer-card';

describe('TrainerCard', () => {
  let component: TrainerCard;
  let fixture: ComponentFixture<TrainerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
