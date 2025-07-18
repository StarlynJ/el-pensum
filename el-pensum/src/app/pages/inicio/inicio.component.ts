import { Component } from '@angular/core';
import { FormularioCompararComponent } from '../comparar/formulario-comparar/formulario-comparar.component';
import { RouterLink } from '@angular/router'; //  1. IMPORTA RouterLink
import { AdvancedFilterComponent } from '../shared/advanced-filter/advanced-filter.component'; // <-- 1. IMPORTAR EL FILTRO


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [
    FormularioCompararComponent,
    RouterLink, // 2. AÑADE RouterLink A LOS IMPORTS
    AdvancedFilterComponent 
  ]
})
export class InicioComponent { }