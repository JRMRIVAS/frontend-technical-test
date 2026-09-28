import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TrainerService } from '../../../core/services/trainer.service';
import { LoadingScreen } from '../../../shared/components/loading-screen/loading-screen';
import { StatBar } from '../../../shared/components/stat-bar/stat-bar';
import { calculateAge } from '../../../shared/utils/trainer-validation.util';
import { formatTypes, getTypeColor } from '../../../shared/utils/pokemon.util';
import { Pokemon } from '../../../core/models/pokemon.model';

// Time the loading screen stays up, just to match the design
const LOADING_MS = 900;

@Component({
  selector: 'app-trainer-detail',
  imports: [LoadingScreen, StatBar],
  templateUrl: './trainer-detail.html',
  styleUrl: './trainer-detail.scss'
})
export class TrainerDetail {
  private readonly trainerService = inject(TrainerService);
  private readonly router = inject(Router);

  // The guard makes sure this is never null here
  readonly trainer = this.trainerService.trainer;

  readonly loading = signal(true);

  readonly age = computed(() => {
    const profile = this.trainer();
    return profile ? calculateAge(profile.birthDate) : 0;
  });

  // Only adults show their document, minors show nothing
  readonly showDocument = computed(
    () => this.trainer()?.documentType === 'DUI' && !!this.trainer()?.documentNumber
  );

  // Just the first name, the greeting uses it
  readonly firstName = computed(() => this.trainer()?.name.split(' ')[0] ?? '');

  constructor() {
    setTimeout(() => this.loading.set(false), LOADING_MS);
  }

  typeLabel(pokemon: Pokemon): string {
    return formatTypes(pokemon.types);
  }

  typeColor(pokemon: Pokemon): string {
    return getTypeColor(pokemon.types);
  }

  editProfile(): void {
    this.router.navigate(['/trainer']);
  }

  editTeam(): void {
    this.router.navigate(['/pokemon']);
  }
}