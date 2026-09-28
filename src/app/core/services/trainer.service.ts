import { Injectable, signal, computed } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';
import { TrainerProfile } from '../models/trainer.model';

const STORAGE_KEY = 'trainer-profile';

@Injectable({
    providedIn: 'root'
})
export class TrainerService {
    // Only this service can write to this signal
    private readonly _trainer = signal<TrainerProfile | null>(this.loadFromStorage());

    // Read only version for components, so changes have to go through our methods
    readonly trainer = this._trainer.asReadonly();

    // True once the team has exactly 3 Pokémon
    readonly isTeamComplete = computed(() => this._trainer()?.team.length === 3);

    // True as soon as a trainer exists (doesn't check individual fields)
    readonly hasProfile = computed(() => this._trainer() !== null);

    // First submit of the form. Keeps the team if there was one already
    setProfile(profile: Omit<TrainerProfile, 'team'>): void {
        const current = this._trainer();
        this._trainer.set({ ...profile, team: current?.team ?? [] });
        this.saveToStorage();
    }

    // Edit flow: only overwrites the fields we receive, the team stays untouched
    updateProfile(profile: Partial<Omit<TrainerProfile, 'team'>>): void {
        const current = this._trainer();
        if (!current) return;
        this._trainer.set({ ...current, ...profile });
        this.saveToStorage();
    }

    // Needs exactly 3 Pokémon, the tuple type enforces that
    updateTeam(team: [Pokemon, Pokemon, Pokemon]): void {
        const current = this._trainer();
        if (!current) return;
        this._trainer.set({ ...current, team });
        this.saveToStorage();
    }

    // Wipes everything, memory and localStorage
    clear(): void {
        this._trainer.set(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    private saveToStorage(): void {
        const current = this._trainer();
        if (current) localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }

    private loadFromStorage(): TrainerProfile | null {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as TrainerProfile;
        } catch {
            // Corrupted JSON, better to start fresh than crash on startup
            return null;
        }
    }
}