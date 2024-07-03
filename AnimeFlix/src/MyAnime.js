document.addEventListener("DOMContentLoaded", function () {
    fetchTopAiringAnime();
    fetchAnimeByGenre('action', '1', 'action-slides');
    fetchAnimeByGenre('adventure', '2', 'adventure-slides');
    fetchAnimeByGenre('comedy', '4', 'comedy-slides');
    fetchAnimeByGenre('fantasy', '10', 'fantasy-slides');

    document.getElementById('slide-left').addEventListener('click', function () {
        document.getElementById('anime-slides').scrollBy({ left: -300, behavior: 'smooth' });
    });

    document.getElementById('slide-right').addEventListener('click', function () {
        document.getElementById('anime-slides').scrollBy({ left: 300, behavior: 'smooth' });
    });

    document.getElementById('slide-left-action').addEventListener('click', function () {
        document.getElementById('action-slides').scrollBy({ left: -300, behavior: 'smooth' });
    });

    document.getElementById('slide-right-action').addEventListener('click', function () {
        document.getElementById('action-slides').scrollBy({ left: 300, behavior: 'smooth' });
    });

    document.getElementById('slide-left-adventure').addEventListener('click', function () {
        document.getElementById('adventure-slides').scrollBy({ left: -300, behavior: 'smooth' });
    });

    document.getElementById('slide-right-adventure').addEventListener('click', function () {
        document.getElementById('adventure-slides').scrollBy({ left: 300, behavior: 'smooth' });
    });

    document.getElementById('slide-left-comedy').addEventListener('click', function () {
        document.getElementById('comedy-slides').scrollBy({ left: -300, behavior: 'smooth' });
    });

    document.getElementById('slide-right-comedy').addEventListener('click', function () {
        document.getElementById('comedy-slides').scrollBy({ left: 300, behavior: 'smooth' });
    });

    document.getElementById('slide-left-fantasy').addEventListener('click', function () {
        document.getElementById('fantasy-slides').scrollBy({ left: -300, behavior: 'smooth' });
    });

    document.getElementById('slide-right-fantasy').addEventListener('click', function () {
        document.getElementById('fantasy-slides').scrollBy({ left: 300, behavior: 'smooth' });
    });
});

function fetchTopAiringAnime() {
    fetchWithRetry('https://api.jikan.moe/v4/top/anime?filter=airing', 3)
        .then((data) => {
            displayAnimeSlides(data.data.slice(0, 25), 'anime-slides');
        })
        .catch((error) => {
            console.error("Error fetching top airing anime", error);
        });
}



function fetchAnimeByGenre(genre, genreId, elementId) {
    fetchWithRetry(`https://api.jikan.moe/v4/anime?genres=${genreId}`, 3)
        .then((data) => {
            displayAnimeSlides(data.data.slice(0, 20), elementId);
        })
        .catch((error) => {
            console.error(`Error fetching ${genre} anime`, error);
        });
}

function fetchWithRetry(url, retries) {
    return fetch(url)
        .then(response => {
            if (response.status === 429) {
                if (retries > 0) {
                    console.warn(`Rate limit exceeded. Retrying in 5 seconds... (${retries} retries left)`);
                    return new Promise((resolve) => setTimeout(resolve, 5000))
                        .then(() => fetchWithRetry(url, retries - 1));
                } else {
                    throw new Error('Max retries exceeded');
                }
            } else if (response.status === 404) {
                throw new Error('Resource not found');
            }
            return response.json();
        });
}

function buttonClicked() {
    const animename = document.getElementById("name").value;
    
    // Set the search result heading
    document.getElementById('search-query').textContent = animename;
    document.getElementById('search-result').style.display = 'block';  // Make the h2 visible

    fetchWithRetry(`https://api.jikan.moe/v4/anime?q=${animename}`, 3)
        .then((data) => {
            if (data && data.data) {
                displayAnime(data.data, 'demo');
            } else {
                console.error("Invalid API response");
                document.getElementById("demo").innerHTML = "No anime found";
            }
        })
        .catch((error) => {
            console.error("Error fetching API", error);
            document.getElementById("demo").innerHTML = "Error fetching anime data";
        });
}

// Initialize the search result heading to be hidden
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('search-result').style.display = 'none';
});


function displayAnime(animeList, elementId) {
    let html = '';
    animeList.forEach((anime) => {
        html += `
            <div class="anime-card-search-container">
                <div class="anime-card-search" onclick="redirectToDetails(${anime.mal_id})">
                    <img  class="anime-search" src="${anime.images.jpg.image_url}" alt="${anime.title}">
                    <div class="info">
                        <div class="title">${anime.title}</div>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById(elementId).innerHTML = html;
}

function displayAnimeSlides(animeList, elementId) {
    let html = '';
    animeList.forEach((anime) => {
        html += `
            <div class="anime-card" style="flex: 0 0 calc(16.66% - 10px);" onclick="redirectToDetails(${anime.mal_id})">
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <div class="info">
                    <div class="title">${anime.title}</div>
                </div>
            </div>
        `;
    });
    document.getElementById(elementId).innerHTML = html;
}

function redirectToDetails(animeId) {
    window.location.href = `animedetails.html?id=${animeId}`;
}
