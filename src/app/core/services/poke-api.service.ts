import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
    PokeApiListResponse,
    PokeApiPokemonResponse,
    Pokemon,
    PokemonStat,
    StatName
} from '../models/pokemon.model';
import {
    POKEMON_STAT_LABELS,
    POKEMON_STAT_MAX_VALUES
} from '../constants/pokemon-stats.constants';

@Injectable({
    providedIn: 'root'
})
export class PokeApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'https://pokeapi.co/api/v2';

    // Basic list of the 151 first generation Pokémon (just names and urls)
    getGen1PokemonList(): Observable<PokeApiListResponse> {
        return this.http
            .get<PokeApiListResponse>(`${this.baseUrl}/pokemon?limit=151&offset=0`)
            .pipe(catchError(this.handleError));
    }

    // Full details for one Pokémon, by id or by name
    getPokemonDetail(idOrName: string | number): Observable<Pokemon> {
        const query = typeof idOrName === 'string' ? idOrName.toLowerCase().trim() : idOrName;
        return this.http
            .get<PokeApiPokemonResponse>(`${this.baseUrl}/pokemon/${query}`)
            .pipe(
                map((response) => this.mapPokemonResponse(response)),
                catchError(this.handleError)
            );
    }

    // All 151 Pokémon with their details. The requests run in parallel with forkJoin,
    // so the whole collection is ready for searching and filtering
    getGen1PokemonWithDetails(): Observable<Pokemon[]> {
        return this.getGen1PokemonList().pipe(
            switchMap((listResponse) => {
                const detailRequests: Observable<Pokemon>[] = listResponse.results.map((item) =>
                    this.http
                        .get<PokeApiPokemonResponse>(item.url)
                        .pipe(map((detail) => this.mapPokemonResponse(detail)))
                );
                return forkJoin(detailRequests);
            }),
            catchError(this.handleError)
        );
    }

    // Turns the raw API response into our own Pokemon model
    private mapPokemonResponse(raw: PokeApiPokemonResponse): Pokemon {
        // The spec asks for home -> front_default, with the regular sprite as backup
        const homeSprite = raw.sprites.other?.home?.front_default;
        const fallbackSprite = raw.sprites.front_default ?? '';
        const finalSprite = homeSprite ?? fallbackSprite;

        const types = raw.types.map((t) => t.type.name);

        const stats: PokemonStat[] = raw.stats.map((statItem) => {
            const baseValue = statItem.base_stat;

            // If the API sends a stat we don't know, fall back to hp instead of crashing
            const name: StatName = this.isKnownStat(statItem.stat.name)
                ? statItem.stat.name
                : 'hp';
            const maxValue = POKEMON_STAT_MAX_VALUES[name];
            const percentage = Math.min(100, Math.round((baseValue / maxValue) * 100));

            return {
                name,
                label: POKEMON_STAT_LABELS[name],
                baseValue,
                maxValue,
                percentage
            };
        });

        return {
            id: raw.id,
            name: raw.name,
            sprite: finalSprite,
            types,
            stats
        };
    }

    // Type guard: checks a plain string is one of our valid stat names
    private isKnownStat(name: string): name is StatName {
        return name in POKEMON_STAT_MAX_VALUES;
    }

    // One place for all HTTP errors. It's an arrow function so `this` doesn't get lost
    // when we pass it around as a callback
    private handleError = (error: HttpErrorResponse): Observable<never> => {
        let errorMessage = 'An unexpected error occurred while communicating with PokeAPI.';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Network error: ${error.error.message}`;
        } else if (error.status === 404) {
            errorMessage = 'Pokémon not found.';
        } else if (error.status === 0) {
            errorMessage = 'Could not reach PokeAPI. Please check your connection.';
        } else {
            errorMessage = `Server returned code ${error.status}: ${error.message}`;
        }

        return throwError(() => new Error(errorMessage));
    };
}