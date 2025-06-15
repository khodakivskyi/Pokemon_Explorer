import { loadFavoritesFromStorage, saveFavorites } from '../utils/storage.js';
import { createPokemonCard } from '../components/pokemonCard.js';

export function loadFavorites(container) {
    const favorites = loadFavoritesFromStorage();

    container.innerHTML = '<h2>Favorites</h2>';

    if (favorites.length === 0) {
        container.innerHTML += '<p>No favorite Pokémon yet.</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'pokemon-grid';

    favorites.forEach(pokemon => {
        const card = createPokemonCard(pokemon, true);

        card.querySelector('.fav-btn').textContent = 'Remove';
        card.querySelector('.fav-btn').addEventListener('click', () => {
            const updatedFavorites = loadFavoritesFromStorage().filter(p => p.name !== pokemon.name);
            saveFavorites(updatedFavorites);
            loadFavorites(container);
        });

        grid.appendChild(card);
    });

    container.appendChild(grid);
}