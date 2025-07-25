import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarContenidoInicioComponent } from './gestionar-contenido-inicio.component';

describe('GestionarContenidoInicioComponent', () => {
  let component: GestionarContenidoInicioComponent;
  let fixture: ComponentFixture<GestionarContenidoInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarContenidoInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarContenidoInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
