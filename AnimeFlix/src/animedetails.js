document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    if (animeId) {
        fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
            .then((response) => response.json())
            .then((data) => {
                displayDetails(data.data);
            })
            .catch((error) => {
                console.error("Error fetching anime details", error);
                document.getElementById("anime-details").innerHTML = "Error fetching anime details";
            });
    }

    const modal = document.getElementById("wishlist-modal");
    const closeModal = document.getElementById("close-modal");
    closeModal.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

function displayDetails(anime) {
    const wishlist = getWishList();
    const isInWishlist = wishlist.find((item) => item.mal_id === anime.mal_id);
    let buttonHtml = '';
    if (isInWishlist) {
        buttonHtml = `<button class="wishlist-button remove" id="wishlist-button">Remove from Wish List</button>`;
    } else {
        buttonHtml = `<button class="wishlist-button" id="wishlist-button">Add to Wish List</button>`;
    }

    const genres = anime.genres.map(genre => genre.name).join(', ');
    const producers = anime.producers.map(producer => producer.name).join(', ');

    const detailsHtml = `
        <div class="anime-image">
            <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
        </div>
        <div class="anime-details">
            <h1>${anime.title}</h1>
            <p><strong>Synopsis:</strong> ${anime.synopsis}</p>
            <p><strong>Score:</strong> ${anime.score}</p>
            <p><strong>Rank:</strong> ${anime.rank}</p>
            <p><strong>Popularity:</strong> ${anime.popularity}</p>
            <p><strong>Genres:</strong> ${genres}</p>
            <p><strong>Producers:</strong> ${producers}</p>
            <p><strong>Source:</strong> ${anime.source}</p>
            <p><strong>Rating:</strong> ${anime.rating}</p>
            <p><strong>Episodes:</strong> ${anime.episodes !== null ? anime.episodes : 'Ongoing'}</p>
            <p><strong>Status:</strong> ${anime.status}</p>
            <p><strong>Releases:</strong> ${anime.aired ? anime.aired.string : 'N/A'}</p>
            <p><strong>Schedules:</strong> ${anime.broadcast ? anime.broadcast.string : 'N/A'}</p>
            <p><strong>Go to website: </strong> <a href="${anime.url}" target="_blank">MyAnimeList</a></p>
            ${buttonHtml}
        </div>
    `;
    document.getElementById("anime-details").innerHTML = detailsHtml;

    const wishlistButton = document.getElementById("wishlist-button");
    wishlistButton.addEventListener("click", function () {
        if (isInWishlist) {
            if (confirm("Are you sure you want to remove this anime from your wish list?")) {
                removeAnimeFromWishList(anime);
            }
        } else {
            showModal(anime);
        }
    });
}

function showModal(anime) {
    const modal = document.getElementById("wishlist-modal");
    modal.style.display = "flex";

    const saveButton = document.getElementById("save-wishlist");

    // Ensure that the event listener is only set once
    saveButton.addEventListener("click", function handleClick() {
        console.log("Save button clicked");
        addAnimeToWishList(anime);
        saveButton.removeEventListener("click", handleClick);  // Remove the event listener after it is used
    }, { once: true });  // This ensures that the listener is only called once
}

function addAnimeToWishList(anime) {
    const wishlist = getWishList();
    const statusSelect = document.getElementById("status-select-modal");
    const currentEpisodeInput = document.getElementById("current-episode-modal");
    const ratingSelect = document.getElementById("rating-modal");

    // Use 0 if the input value is null or empty
    const currentEpisode = currentEpisodeInput.value ? parseInt(currentEpisodeInput.value) : 0;
    const totalEpisodes = anime.episodes !== null ? anime.episodes : 'Ongoing';

    // Validate the current episode input
    if (isNaN(currentEpisode) || currentEpisode < 0) {
        alert("Please enter a valid number for the current episode.");
        return;
    }

    if (totalEpisodes !== 'Ongoing' && currentEpisode > totalEpisodes) {
        alert("Current episode cannot exceed the total number of episodes.");
        return;
    }

    const animeData = {
        mal_id: anime.mal_id,
        title: anime.title,
        image_url: anime.images.jpg.image_url,
        status: statusSelect.value,
        current_episode: currentEpisode,
        total_episodes: totalEpisodes,
        rating: ratingSelect.value
    };

    wishlist.push(animeData);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Anime added to wish list!");
    displayDetails(anime);
    document.getElementById("wishlist-modal").style.display = "none";
}

function removeAnimeFromWishList(anime) {
    const wishlist = getWishList();
    const index = wishlist.findIndex((item) => item.mal_id === anime.mal_id);
    if (index !== -1) {
        if (confirm("Are you sure you want to remove this anime from your wish list?")) {
            wishlist.splice(index, 1);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            alert("Anime removed from wish list!");
            displayDetails(anime);
        }
    }
}

function getWishList() {
    const wishlist = localStorage.getItem("wishlist");
    if (wishlist) {
        return JSON.parse(wishlist);
    } else {
        return [];
    }
}
