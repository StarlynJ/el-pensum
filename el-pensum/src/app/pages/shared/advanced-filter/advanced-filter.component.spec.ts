import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterComponent } from './advanced-filter.component';

describe('AdvancedFilterComponent', () => {
  let component: AdvancedFilterComponent;
  let fixture: ComponentFixture<AdvancedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
