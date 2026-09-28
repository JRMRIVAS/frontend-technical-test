import { Routes } from '@angular/router';
import { profileCompleteGuard } from './core/guards/profile-complete-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'trainer', pathMatch: 'full' },
    {
        path: 'trainer',
        loadComponent: () =>
            import('./features/trainer/trainer-form/trainer-form').then((m) => m.TrainerForm)
    },
    {
        path: 'pokemon',
        canActivate: [profileCompleteGuard],
        loadComponent: () =>
            import('./features/pokemon/pokemon-list/pokemon-list').then((m) => m.PokemonList)
    },
    { path: '**', redirectTo: 'trainer' }
];