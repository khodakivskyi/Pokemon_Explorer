let currentOffset = 0;
const limit = 24;

window.addEventListener("hashchange", renderPage);
window.addEventListener("DOMContentLoaded", renderPage);

function renderPage() {
    const hash = window.location.hash || "#gallery";
    const app = document.getElementById("app");

    if (hash === "#gallery") {
        loadGallery(app);
    } else if (hash === "#favorites") {
        loadFavorites(app);
    }
}

async function loadGallery(container) {
    container.innerHTML = "<h2>Loading Pokémon...</h2>";

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`);
        const data = await response.json();

        const pokemons = await Promise.all(
            data.results.map(p => fetch(p.url).then(res => res.json()))
        );

        container.innerHTML = `
      <h2>Gallery</h2>
      <div class="pokemon-grid">
        ${pokemons.map(p => `
          <div class="pokemon-card">
            <h3>${p.name}</h3>
            <img src="${p.sprites.front_default}" alt="${p.name}" />
          </div>
        `).join("")}
      </div>

      <div class="pagination">
        <button id="prev-btn" ${currentOffset === 0 ? "disabled" : ""}>← Previous</button>
        <button id="next-btn">Next →</button>
      </div>
    `;

        document.getElementById("prev-btn").addEventListener("click", () => {
            if (currentOffset >= limit) {
                currentOffset -= limit;
                loadGallery(container);
            }
        });

        document.getElementById("next-btn").addEventListener("click", () => {
            currentOffset += limit;
            loadGallery(container);
        });

    } catch (error) {
        container.innerHTML = "<p>Error loading Pokémon.</p>";
        console.error(error);
    }
}


function loadFavorites(container) {

}
