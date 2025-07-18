import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedResultsComponent } from './advanced-results.component';

describe('AdvancedResultsComponent', () => {
  let component: AdvancedResultsComponent;
  let fixture: ComponentFixture<AdvancedResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
