import {fetchPokemonByName} from '../api/pokeapi.js';

export async function loadPokemonInfo(container, pokemonName){
    if (!name) {
        container.innerHTML = '<p>No Pokémon specified.</p>';
        return;
    }

    container.innerHTML = '<h2>Loading Pokémon...</h2>';

    try{
        const pokemon = await fetchPokemonByName(pokemonName);

    }
    catch(error){

    }
}