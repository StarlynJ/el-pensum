import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAsignacionesComponent } from './gestionar-asignaciones.component';

describe('GestionarAsignacionesComponent', () => {
  let component: GestionarAsignacionesComponent;
  let fixture: ComponentFixture<GestionarAsignacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAsignacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAsignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
