import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-bar',
  templateUrl: './stat-bar.html',
  styleUrl: './stat-bar.scss'
})
export class StatBar {
  readonly label = input.required<string>();
  readonly percentage = input.required<number>();
  readonly baseValue = input.required<number>();
  readonly color = input('#9fb3c4');
}