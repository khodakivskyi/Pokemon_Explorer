import {fetchPokemonByName} from '../api/pokeapi.js';

export async function loadPokemonInfo(container, pokemonName){
    if (!pokemonName) {
        container.innerHTML = '<p>No Pokémon specified.</p>';
        return;
    }

    container.innerHTML = '<h2>Loading Pokémon...</h2>';

    try{
        const pokemon = await fetchPokemonByName(pokemonName);
        container.innerHTML = `
        <div class="pokemon-info">
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />

            <div class="pokemon-details">
                <p><strong>Height:</strong> ${pokemon.height}</p>
                <p><strong>Weight:</strong> ${pokemon.weight}</p>
                <p><strong>Types:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
                <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
            </div>

            <div class="pokemon-stats">
                <h3>Stats:</h3>
                <ul>
                    ${pokemon.stats.map(stat => `
                    <li><strong>${stat.stat.name}:</strong> ${stat.base_stat}</li>
                    `).join('')}
                </ul>
            </div>
        </div>
        <button id="back-btn">← Back</button>
        `;

        container.querySelector('#back-btn').addEventListener('click', () => {
            window.history.back();
        });
    }
    catch(err){
        container.innerHTML = `<p>Error loading Pokémon: ${err.message}</p>`;
    }
}