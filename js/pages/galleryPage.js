import {fetchAllPokemons, fetchPokemons, fetchPokemonByUrl, fetchTypes} from '../api/pokeapi.js';
import {renderPokemonGrid} from "../components/gridRenderer.js";

let currentPage = 0;
const limit = 24;
let paginatedPokemons = [];
let allPokemonList = [];
let typesList = [];
let filteredPokemons = null;

const containerRef = {container: null};

export async function loadGallery(container) {
    containerRef.container = container;
    container.innerHTML = "<h2>Loading Pokémons...</h2>";

    try {
        if (!container.querySelector('.gallery-header')) {
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

            const searchInput = container.querySelector('#search-input');
            const typeSelect = container.querySelector('#type-filter');
            const clearBtn = container.querySelector('#clear-filters-btn');
            const grid = container.querySelector('.pokemon-grid');

            if (typesList.length === 0) {
                typesList = await fetchTypes();
            }

            typesList.forEach(type => {
                const option = document.createElement('option');
                option.value = type.name;
                option.textContent = type.name;
                typeSelect.appendChild(option);
            });

            searchInput.addEventListener('input', () => {
                currentPage = 0;
                filterAndRender(searchInput, typeSelect, grid);
            });

            typeSelect.addEventListener('change', () => {
                currentPage = 0;
                filterAndRender(searchInput, typeSelect, grid);
            });

            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                typeSelect.value = 'all';
                filteredPokemons = null;
                currentPage = 0;
                loadGallery(container);
            });
        }

        if (allPokemonList.length === 0) {
            const data = await fetchAllPokemons(100000, 0);
            allPokemonList = data.results;
        }

        const grid = container.querySelector('.pokemon-grid');

        if (!filteredPokemons) {
            const offset = currentPage * limit;
            const data = await fetchPokemons(limit, offset);
            paginatedPokemons = await Promise.all(data.results.map(p => fetchPokemonByUrl(p.url)));
            renderPokemonGrid(paginatedPokemons, grid);
            renderPagination(container, false);
        } else {
            renderPage(grid);
            renderPagination(container, true);
        }
    } catch (err) {
        container.innerHTML = '<p>Failed to load Pokémons. Please try again later.</p>';
    }
}


async function filterAndRender(searchInput, typeFilter, grid) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;

    if (!searchTerm && selectedType === 'all') {
        filteredPokemons = null;
        loadGallery(containerRef.container);
        return;
    }

    try {
        let matched = allPokemonList.filter(p => p.name.includes(searchTerm));

        if (matched.length === 0) {
            grid.innerHTML = '<p>No Pokémon found matching your search.</p>';
            filteredPokemons = [];
            renderPagination(containerRef.container, true);
            return;
        }

        const detailed = await Promise.all(matched.map(p => fetchPokemonByUrl(p.url)));

        let filtered = detailed.filter(pokemon => {
            return selectedType === 'all' || pokemon.types.some(t => t.type.name === selectedType);
        });

        if (filtered.length === 0) {
            grid.innerHTML = '<p>No Pokémon found for the selected type.</p>';
            filteredPokemons = [];
            renderPagination(containerRef.container, true);
            return;
        }

        filteredPokemons = filtered;
        renderPage(grid);
        renderPagination(containerRef.container, true);
    } catch {
        grid.innerHTML = '<p>Failed to load Pokémons. Please try again later.</p>';
        filteredPokemons = [];
        renderPagination(containerRef.container, true);
    }
}

function renderPage(grid) {
    const start = currentPage * limit;
    const end = start + limit;
    const pagePokemons = filteredPokemons.slice(start, end);

    if (pagePokemons.length === 0) {
        grid.innerHTML = '<p>No Pokémon found on this page.</p>';
        return;
    }

    renderPokemonGrid(pagePokemons, grid);
}

function renderPagination(container, isFiltered) {
    const pagination = container.querySelector('.pagination');
    let totalPages;

    if (isFiltered) {
        totalPages = Math.ceil(filteredPokemons.length / limit);
    } else {
        totalPages = Math.ceil(allPokemonList.length / limit);
    }

    pagination.innerHTML = `
      <button id="prev-btn" ${currentPage === 0 ? 'disabled' : ''}>← Previous</button>
      <span> Page ${currentPage + 1} of ${totalPages} </span>
      <button id="next-btn" ${currentPage + 1 >= totalPages ? 'disabled' : ''}>Next →</button>
    `;

    pagination.querySelector('#prev-btn').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            if (isFiltered) {
                renderPage(container.querySelector('.pokemon-grid'));
                renderPagination(container, true);
            } else {
                loadGallery(container);
            }
        }
    });

    pagination.querySelector('#next-btn').addEventListener('click', () => {
        if (currentPage + 1 < totalPages) {
            currentPage++;
            if (isFiltered) {
                renderPage(container.querySelector('.pokemon-grid'));
                renderPagination(container, true);
            } else {
                loadGallery(container);
            }
        }
    });
}
