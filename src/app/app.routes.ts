import { Routes } from '@angular/router';
import { entryRedirectGuard } from './core/guards/entry-redirect-guard';
import { profileCompleteGuard } from './core/guards/profile-complete-guard';
import { teamCompleteGuard } from './core/guards/team-complete-guard';

export const routes: Routes = [
    // Empty component, the guard always redirects before it renders
    {
        path: '',
        pathMatch: 'full',
        canActivate: [entryRedirectGuard],
        children: []
    },
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
    {
        path: 'profile',
        canActivate: [teamCompleteGuard],
        loadComponent: () =>
            import('./features/trainer/trainer-detail/trainer-detail').then((m) => m.TrainerDetail)
    },
    { path: '**', redirectTo: '' }
];