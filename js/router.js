import { loadGallery } from './pages/galleryPage.js';
import { loadFavorites } from './pages/favoritesPage.js';
import { loadPokemonInfo } from './pages/pokemonInfoPage.js';

export function router() {
    const hash = window.location.hash || "#gallery";
    const app = document.getElementById("app");

    if (hash.startsWith("#gallery")) {
        loadGallery(app);
    } else if (hash.startsWith("#favorites")) {
        loadFavorites(app);
    } else if (hash.startsWith("#pokemon-info")) {
        const params = new URLSearchParams(hash.split("?")[1]);
        const name = params.get("name");
        loadPokemonInfo(app, name);
    }
}