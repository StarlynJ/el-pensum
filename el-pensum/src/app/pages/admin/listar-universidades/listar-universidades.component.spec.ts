import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarUniversidadesComponent } from './listar-universidades.component';

describe('ListarUniversidadesComponent', () => {
  let component: ListarUniversidadesComponent;
  let fixture: ComponentFixture<ListarUniversidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarUniversidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarUniversidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
