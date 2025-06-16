import { loadFavoritesFromStorage, saveFavorites } from '../utils/storage.js';
import { createPokemonCard } from '../components/pokemonCard.js';

export function loadFavorites(container) {
    try {
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

            card.addEventListener('click', (e) => {
                if (e.target.closest('.fav-btn')) return;

                window.location.hash = `#pokemon-info?name=${pokemon.name}`;
            })
        });

        container.appendChild(grid);
    } catch (err) {
        container.innerHTML = `<p>Error loading Pokémons: ${err.message}</p>`;
    }
}