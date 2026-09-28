import { StatName } from '../models/pokemon.model';

// Maximum stat limits, per the technical spec
export const POKEMON_STAT_MAX_VALUES: Record<StatName, number> = {
    hp: 255,
    attack: 190,
    defense: 230,
    'special-attack': 194,
    'special-defense': 230,
    speed: 180
};

// Display labels for each Pokemon stat in the UI
export const POKEMON_STAT_LABELS: Record<StatName, string> = {
    hp: 'Salud',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial',
    speed: 'Velocidad'
};