import {fetchPokemons, fetchPokemonByUrl, fetchTypes} from '../api/pokeapi.js';
import {renderPokemonGrid} from "../components/gridRenderer.js";

let currentOffset = 0;
const limit = 24;
let pokemons = [];

const containerRef = {container: null};

export async function loadGallery(container) {
    containerRef.container = container;
    container.innerHTML = "<h2>Loading Pokémons...</h2>";

    try {
        const data = await fetchPokemons(limit, currentOffset);
        pokemons = await Promise.all(
            data.results.map(p => fetchPokemonByUrl(p.url))
        );

        container.innerHTML = `
            <div class="gallery-header">
                <h2>Gallery</h2>
                <div class="controls">
                    <input type="text" id="search-input" placeholder="Search Pokémon by name..." />
                    <select id="type-filter">
                        <option value="all">All types</option>
                    </select>
                    <button id="clear-filters-btn" title="Очистити фільтри">✖️</button>
                </div>
            </div>
            <div class="pokemon-grid"></div>
            <div class="pagination"></div>
        `;

        const typeSelect = container.querySelector('#type-filter');
        fetchTypes().then(types => {
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type.name;
                option.textContent = type.name;
                typeSelect.appendChild(option);
            });
        });

        filterAndRender();

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

function filterAndRender() {
    const grid = containerRef.container.querySelector('.pokemon-grid');
    const searchInput = containerRef.container.querySelector('#search-input');
    const typeFilter = containerRef.container.querySelector('#type-filter');

    searchInput.addEventListener('input', filterAndRender);
    typeFilter.addEventListener('change', filterAndRender);

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;

    const filtered = pokemons.filter(pokemon => {
        const matchesName = pokemon.name.includes(searchTerm);
        const matchesType = selectedType === "all" || pokemon.types.some(t => t.type.name === selectedType);
        return matchesName && matchesType;
    });

    renderPokemonGrid(filtered, grid);

    const clearBtn = containerRef.container.querySelector('#clear-filters-btn');
    clearBtn.addEventListener('click', ()=>{
        searchInput.value = '';
        typeFilter.value = 'all';

        filterAndRender();
    });
}