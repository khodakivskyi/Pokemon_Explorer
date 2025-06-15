const FAVORITES_KEY = 'favorites';

export function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function loadFavoritesFromStorage() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}
