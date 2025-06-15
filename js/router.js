import { loadGallery } from './pages/galleryPage.js';
import { loadFavorites } from './pages/favoritesPage.js';

export function router() {
    const hash = window.location.hash || "#gallery";
    const app = document.getElementById("app");

    if (hash === "#gallery") {
        loadGallery(app);
    } else if (hash === "#favorites") {
        loadFavorites(app);
    }
}