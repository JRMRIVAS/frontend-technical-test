// Union type restricting valid stat names — prevents typos and missing entries
export type StatName =
    | 'hp'
    | 'attack'
    | 'defense'
    | 'special-attack'
    | 'special-defense'
    | 'speed';

// Represents a single processed stat with its base value and calculated percentage
export interface PokemonStat {
    name: StatName;
    label: string;
    baseValue: number;
    maxValue: number;
    percentage: number;
}

// Clean domain model consumed by our UI components
export interface Pokemon {
    id: number;
    name: string;
    sprite: string;
    types: string[];
    stats: PokemonStat[];
}

// A single item in PokeAPI's paginated list response
export interface PokeApiListResult {
    name: string;
    url: string;
}

// PokeAPI's Pokemon list response (/pokemon?limit=151)
export interface PokeApiListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokeApiListResult[];
}

// Raw shape returned by PokeAPI's Pokemon detail endpoint (/pokemon/{id})
export interface PokeApiPokemonResponse {
    id: number;
    name: string;
    sprites: {
        other?: {
            home?: {
                front_default: string | null;
            };
        };
        front_default?: string | null;
    };
    types: Array<{
        slot: number;
        type: {
            name: string;
            url: string;
        };
    }>;
    stats: Array<{
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        };
    }>;
}