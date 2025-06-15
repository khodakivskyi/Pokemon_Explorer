import { createPokemonCard } from './pokemonCard.js';
import { loadFavoritesFromStorage, saveFavorites } from '../utils/storage.js';

export function renderPokemonGrid(pokemons, gridElement) {
    const favorites = loadFavoritesFromStorage();
    gridElement.innerHTML = '';

    pokemons.forEach(pokemon => {
        const isFav = favorites.some(fav => fav.name === pokemon.name);
        const card = createPokemonCard(pokemon, isFav);

        card.querySelector('.fav-btn').addEventListener('click', () => {
            const updatedFavorites = loadFavoritesFromStorage();
            const idx = updatedFavorites.findIndex(f => f.name === pokemon.name);
            if (idx === -1) {
                updatedFavorites.push(pokemon);
            } else {
                updatedFavorites.splice(idx, 1);
            }
            saveFavorites(updatedFavorites);
            renderPokemonGrid(pokemons, gridElement);
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('.fav-btn')) return;

            window.location.hash = `#pokemon-info?name=${pokemon.name}`;
        })

        gridElement.appendChild(card);
    });
}
