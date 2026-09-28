import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.scss'
})
export class LoadingScreen {
  readonly message = input('Cargando...');
  // Just to repeat the rain lines in the template
  readonly lines = Array(9);
}