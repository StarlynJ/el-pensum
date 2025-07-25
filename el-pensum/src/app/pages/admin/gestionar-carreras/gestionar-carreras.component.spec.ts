
// Importamos lo necesario para testear el componente
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarCarrerasComponent } from './gestionar-carreras.component';

// Test suite para el componente de gestión de carreras
describe('GestionarCarrerasComponent', () => {
  let component: GestionarCarrerasComponent;
  let fixture: ComponentFixture<GestionarCarrerasComponent>;

  // Antes de cada test, configuramos el módulo de pruebas y creamos el componente
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarCarrerasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test básico: el componente debería crearse sin problemas
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
