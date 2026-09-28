import { Component, computed, input } from '@angular/core';
import { TrainerProfile } from '../../../core/models/trainer.model';
import { calculateAge } from '../../utils/trainer-validation.util';

@Component({
  selector: 'app-trainer-card',
  templateUrl: './trainer-card.html',
  styleUrl: './trainer-card.scss'
})
export class TrainerCard {
  readonly trainer = input.required<TrainerProfile>();

  readonly age = computed(() => calculateAge(this.trainer().birthDate));

  // Only adults show their document, minors show nothing
  readonly showDocument = computed(
    () => this.trainer().documentType === 'DUI' && !!this.trainer().documentNumber
  );
}