import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importamos CommonModule

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule], // Lo añadimos a los imports
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // ✅ Propiedad para obtener el año actual dinámicamente
  currentYear: number = new Date().getFullYear();
  
  // ✅ Ruta al archivo PDF de términos (puedes cambiarla si es necesario)
  pdfLink: string = '/assets/documents/terminos-y-condiciones.pdf';
}