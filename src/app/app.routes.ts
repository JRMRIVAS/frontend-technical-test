import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'trainer', pathMatch: 'full' },
    {
        path: 'trainer',
        // Lazy loaded, so the form code is only downloaded when someone visits it
        loadComponent: () =>
            import('./features/trainer/trainer-form/trainer-form').then((m) => m.TrainerForm)
    }
];