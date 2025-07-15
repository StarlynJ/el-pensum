import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beca } from '../../core/models/beca.model';
import { BecaService } from '../../core/services/beca.service';

@Component({
  selector: 'app-becas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './becas.component.html',
  styleUrls: ['./becas.component.css']
})
export class BecasComponent implements OnInit {
  becas: Beca[] = [];
  isLoading = true;
  error = '';

  constructor(private becaService: BecaService) {}

  ngOnInit(): void {
    this.becaService.getBecas().subscribe({
      next: (data) => {
        this.becas = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las becas en este momento.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}