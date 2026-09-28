import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TrainerService } from '../services/trainer.service';

// The summary needs the full team, otherwise there's nothing to show
export const teamCompleteGuard: CanActivateFn = () => {
  const router = inject(Router);
  const trainerService = inject(TrainerService);

  if (trainerService.isTeamComplete()) return true;

  // Sends them to whichever step is still pending
  return router.createUrlTree([trainerService.hasProfile() ? '/pokemon' : '/trainer']);
};