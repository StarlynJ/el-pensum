import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversidadesComponent } from './universidades.component';

describe('UniversidadesComponent', () => {
  let component: UniversidadesComponent;
  let fixture: ComponentFixture<UniversidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
