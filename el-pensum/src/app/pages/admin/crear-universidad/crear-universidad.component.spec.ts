import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUniversidadComponent } from './crear-universidad.component';

describe('CrearUniversidadComponent', () => {
  let component: CrearUniversidadComponent;
  let fixture: ComponentFixture<CrearUniversidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearUniversidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearUniversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
