export function createPokemonCard(pokemon, isFavorite = false) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    card.innerHTML = `
    <h3>${pokemon.name}</h3>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
  `;

    return card;
}
