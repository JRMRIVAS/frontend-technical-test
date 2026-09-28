import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TrainerService } from '../services/trainer.service';

// The root sends you to the step you're actually on: form, team or summary
export const entryRedirectGuard: CanActivateFn = () => {
    const router = inject(Router);
    const trainerService = inject(TrainerService);

    if (trainerService.isTeamComplete()) return router.createUrlTree(['/profile']);
    if (trainerService.hasProfile()) return router.createUrlTree(['/pokemon']);
    return router.createUrlTree(['/trainer']);
};