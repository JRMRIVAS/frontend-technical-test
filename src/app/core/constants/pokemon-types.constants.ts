// Official colours for each Pokémon type, used in the stat bars
export const POKEMON_TYPE_COLORS: Record<string, string> = {
    normal: '#a8a77a',
    fighting: '#c22e28',
    flying: '#a98ff3',
    poison: '#a33ea1',
    ground: '#e2bf65',
    rock: '#b6a136',
    bug: '#a6b91a',
    ghost: '#735797',
    steel: '#b7b7ce',
    fire: '#ee8130',
    water: '#6390f0',
    grass: '#7ac74c',
    electric: '#f7d02c',
    psychic: '#f95587',
    ice: '#96d9d6',
    dragon: '#6f35fc',
    dark: '#705746',
    fairy: '#d685ad'
};

// Type names in Spanish, for the label under each Pokémon name
export const POKEMON_TYPE_LABELS: Record<string, string> = {
    normal: 'Normal',
    fighting: 'Lucha',
    flying: 'Volador',
    poison: 'Veneno',
    ground: 'Tierra',
    rock: 'Roca',
    bug: 'Bicho',
    ghost: 'Fantasma',
    steel: 'Acero',
    fire: 'Fuego',
    water: 'Agua',
    grass: 'Planta',
    electric: 'Eléctrico',
    psychic: 'Psíquico',
    ice: 'Hielo',
    dragon: 'Dragón',
    dark: 'Siniestro',
    fairy: 'Hada'
};

// Fallback when the API sends a type we don't know
export const DEFAULT_TYPE_COLOR = '#9fb3c4';