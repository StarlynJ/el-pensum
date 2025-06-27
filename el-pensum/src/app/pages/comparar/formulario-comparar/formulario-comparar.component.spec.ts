import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCompararComponent } from './formulario-comparar.component';

describe('FormularioCompararComponent', () => {
  let component: FormularioCompararComponent;
  let fixture: ComponentFixture<FormularioCompararComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioCompararComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioCompararComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
