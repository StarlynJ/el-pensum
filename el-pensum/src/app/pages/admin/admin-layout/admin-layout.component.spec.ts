// Pruebas para el layout de administración
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLayoutComponent } from './admin-layout.component';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  // Antes de cada test, configuramos el módulo y creamos el componente
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test básico: el componente debería crearse sin problemas
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
