const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchAllPokemons(limit = 10000, offset = 0) {
    const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Failed to fetch all pokemons");
    return res.json();
}

export async function fetchPokemons(limit = 20, offset = 0) {
    const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Failed to fetch pokemons");
    return res.json();
}

export async function fetchPokemonByUrl(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch pokemon details");
    return res.json();
}

export async function fetchPokemonByName(name) {
    const res = await fetch(`${BASE_URL}/pokemon/${name}`);
    if (!res.ok) throw new Error("Pokemon not found");
    return res.json();
}

export async function fetchTypes() {
    const res = await fetch(`${BASE_URL}/type`);
    if (!res.ok) throw new Error("Failed to fetch types");
    const data = await res.json();
    return data.results;
}
