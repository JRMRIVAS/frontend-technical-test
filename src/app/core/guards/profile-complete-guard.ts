import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TrainerService } from '../services/trainer.service';

// Without a profile there's nothing to show here, so we send them back to the form
export const profileCompleteGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(TrainerService).hasProfile() ? true : router.createUrlTree(['/trainer']);
};