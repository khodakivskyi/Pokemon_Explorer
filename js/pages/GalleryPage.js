import { fetchPokemons, fetchPokemonByUrl } from '../api/pokeapi.js';
import { createPokemonCard } from '../components/PokemonCard.js';

let currentOffset = 0;
const limit = 24;

const containerRef = { container: null };

export async function loadGallery(container) {
    containerRef.container = container;
    container.innerHTML = "<h2>Loading Pokémon...</h2>";

    try {
        console.log("fetching pokemons...");
        const data = await fetchPokemons(limit, currentOffset);
        const pokemons = await Promise.all(
            data.results.map(p => fetchPokemonByUrl(p.url))
        );


        container.innerHTML = '<h2>Gallery</h2><div class="pokemon-grid"></div><div class="pagination"></div>';

        const grid = container.querySelector('.pokemon-grid');
        pokemons.forEach(pokemon => {
            /*const card = createPokemonCard(pokemon, isFav);*/

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
