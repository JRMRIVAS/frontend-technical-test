import { Component, computed, inject } from '@angular/core';
import { TrainerService } from '../../../core/services/trainer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private readonly trainerService = inject(TrainerService);

  // The name chip and the search icon only show up once everything is set
  readonly showActions = this.trainerService.isTeamComplete;

  readonly firstName = computed(() => this.trainerService.trainer()?.name.split(' ')[0] ?? '');
}