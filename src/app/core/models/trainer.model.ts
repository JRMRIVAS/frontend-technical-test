import { Pokemon } from './pokemon.model';

export type IdentificationType = 'DUI' | 'CARNET_MINORIDAD';

export interface TrainerProfile {
    photo: string;
    name: string;
    hobby?: string;
    birthDate: string;

    // Determined from birthDate: 'DUI' if the trainer is an adult, 'CARNET_MINORIDAD' otherwise
    documentType: IdentificationType;

    // DUI: required, 8 digits + dash + 1 digit
    // Carnet de minoridad: optional, free format
    documentNumber?: string;

    // Must contain exactly 3 Pokémon once the team is confirmed; empty before selection is complete
    team: [Pokemon, Pokemon, Pokemon] | [];
}