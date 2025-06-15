import { loadGallery } from './pages/GalleryPage.js';

export function router() {
    const hash = window.location.hash || "#gallery";
    const app = document.getElementById("app");

    if (hash === "#gallery") {
        loadGallery(app);
    } else if (hash === "#favorites") {

    }
}
