import { Component, computed, input, output } from '@angular/core';
import { Pokemon } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss'
})
export class PokemonCard {
  readonly pokemon = input.required<Pokemon>();
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly toggled = output<Pokemon>();

  // #001, #025, and so on
  readonly displayId = computed(() => `#${String(this.pokemon().id).padStart(3, '0')}`);

  onClick(): void {
    if (!this.disabled()) this.toggled.emit(this.pokemon());
  }
}