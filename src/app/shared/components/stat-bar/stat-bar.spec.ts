import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatBar } from './stat-bar';

describe('StatBar', () => {
  let component: StatBar;
  let fixture: ComponentFixture<StatBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatBar],
    }).compileComponents();

    fixture = TestBed.createComponent(StatBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
