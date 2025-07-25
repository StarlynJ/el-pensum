import { TestBed } from '@angular/core/testing';

import { ContenidoInicioService } from './contenido-inicio.service';

describe('ContenidoInicioService', () => {
  let service: ContenidoInicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContenidoInicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
