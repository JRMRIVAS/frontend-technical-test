import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../../../core/models/pokemon.model';
import { PokeApiService } from '../../../core/services/poke-api.service';
import { TrainerService } from '../../../core/services/trainer.service';
import { LoadingScreen } from '../../../shared/components/loading-screen/loading-screen';
import { TrainerCard } from '../../../shared/components/trainer-card/trainer-card';
import { PokemonCard } from '../pokemon-card/pokemon-card';

const TEAM_SIZE = 3;

@Component({
  selector: 'app-pokemon-list',
  imports: [LoadingScreen, TrainerCard, PokemonCard],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss'
})
export class PokemonList {
  private readonly pokeApi = inject(PokeApiService);
  private readonly trainerService = inject(TrainerService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  // The guard makes sure this is never null here
  readonly trainer = this.trainerService.trainer;

  readonly pokemons = signal<Pokemon[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly search = signal('');

  // Ids instead of whole objects, easier to compare
  readonly selectedIds = signal<number[]>([]);

  readonly teamSize = TEAM_SIZE;
  readonly teamFull = computed(() => this.selectedIds().length === TEAM_SIZE);

  // Matches by name or by index, so "7", "007" and "#007" all work
  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase().replace('#', '');
    if (!term) return this.pokemons();

    return this.pokemons().filter(
      (pokemon) =>
        pokemon.name.includes(term) ||
        String(pokemon.id) === term ||
        String(pokemon.id).padStart(3, '0') === term
    );
  });

  constructor() {
    // If they came back to edit the team, their picks are already marked
    this.selectedIds.set(this.trainer()?.team.map((pokemon) => pokemon.id) ?? []);
    this.loadPokemons();
  }

  loadPokemons(): void {
    this.loading.set(true);
    this.error.set('');

    this.pokeApi.getGen1PokemonWithDetails().subscribe({
      next: (pokemons) => {
        this.pokemons.set(pokemons);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  onToggle(pokemon: Pokemon): void {
    const current = this.selectedIds();

    if (current.includes(pokemon.id)) {
      this.selectedIds.set(current.filter((id) => id !== pokemon.id));
    } else if (current.length < TEAM_SIZE) {
      this.selectedIds.set([...current, pokemon.id]);
    }
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (!this.teamFull()) return;

    // Looked up by id and kept in the order they were picked.
    // Anything we can't find is dropped instead of leaving an undefined in the team
    const team = this.selectedIds()
      .map((id) => this.pokemons().find((pokemon) => pokemon.id === id))
      .filter((pokemon): pokemon is Pokemon => pokemon !== undefined);

    if (team.length !== TEAM_SIZE) {
      this.error.set('No pudimos guardar el equipo. Intenta seleccionarlos de nuevo.');
      return;
    }

    this.trainerService.updateTeam(team as [Pokemon, Pokemon, Pokemon]);
    this.router.navigate(['/profile']);
  }
}