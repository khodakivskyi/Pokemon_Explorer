import { fetchPokemons, fetchPokemonByUrl } from '../api/pokeapi.js';
import { createPokemonCard } from '../components/PokemonCard.js';
import { loadFavoritesFromStorage, saveFavorites } from '../utils/storage.js';

let currentOffset = 0;
const limit = 24;

const containerRef = { container: null };

export async function loadGallery(container) {
    containerRef.container = container;
    container.innerHTML = "<h2>Loading Pokémon...</h2>";

    try {
        const data = await fetchPokemons(limit, currentOffset);
        const pokemons = await Promise.all(
            data.results.map(p => fetchPokemonByUrl(p.url))
        );

        const favorites = loadFavoritesFromStorage();

        container.innerHTML = '<h2>Gallery</h2><div class="pokemon-grid"></div><div class="pagination"></div>';

        const grid = container.querySelector('.pokemon-grid');
        pokemons.forEach(pokemon => {
            const isFav = favorites.some(fav => fav.name === pokemon.name);
            const card = createPokemonCard(pokemon, isFav);

            card.querySelector('.fav-btn').addEventListener('click', () => {
                const favorites = loadFavoritesFromStorage();
                const idx = favorites.findIndex(f => f.name === pokemon.name);
                if (idx === -1) {
                    favorites.push(pokemon);
                } else {
                    favorites.splice(idx, 1);
                }
                saveFavorites(favorites);
                loadGallery(containerRef.container);
            });

            grid.appendChild(card);
        });

        const pagination = container.querySelector('.pagination');
        pagination.innerHTML = `
      <button id="prev-btn" ${currentOffset === 0 ? 'disabled' : ''}>← Previous</button>
      <button id="next-btn">Next →</button>
    `;
        pagination.querySelector('#prev-btn').addEventListener('click', () => {
            if (currentOffset >= limit) {
                currentOffset -= limit;
                loadGallery(containerRef.container);
            }
        });
        pagination.querySelector('#next-btn').addEventListener('click', () => {
            currentOffset += limit;
            loadGallery(containerRef.container);
        });

    } catch (err) {
        container.innerHTML = `<p>Error loading Pokémon: ${err.message}</p>`;
    }
}