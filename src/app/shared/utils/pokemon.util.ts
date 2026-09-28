import {
    DEFAULT_TYPE_COLOR,
    POKEMON_TYPE_COLORS,
    POKEMON_TYPE_LABELS
} from '../../core/constants/pokemon-types.constants';

// Colour of the first type, which is the main one
export function getTypeColor(types: string[]): string {
    return POKEMON_TYPE_COLORS[types[0]] ?? DEFAULT_TYPE_COLOR;
}

// "grass", "poison" -> "Planta/Veneno"
export function formatTypes(types: string[]): string {
    return types.map((type) => POKEMON_TYPE_LABELS[type] ?? type).join('/');
}