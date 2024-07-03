// Select DOM elements
const animeTableBody = document.getElementById("animeTableBody");
const updateModal = document.getElementById("update-modal");
const closeModal = document.getElementById("close-modal");
const saveUpdateButton = document.getElementById("save-update");
const statusSelectModal = document.getElementById("status-select-modal");
const currentEpisodeModal = document.getElementById("current-episode-modal");
const ratingModal = document.getElementById("rating-modal");

let currentAnimeIndex;
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Function to render the anime list
function renderAnimeList() {
    animeTableBody.innerHTML = ""; // Clear the table body

    if (wishlist.length === 0) {
        animeTableBody.innerHTML = "<tr><td colspan='5'>No wishlist created</td></tr>";
        return;
    }

    wishlist.forEach((anime, index) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const image = document.createElement("img");
        image.src = anime.image_url; // Use the correct property for the image URL
        image.alt = anime.title;
        image.classList.add("anime-image"); // Add a class for styling
        nameCell.appendChild(image);

        const title = document.createElement("div");
        title.textContent = anime.title;
        nameCell.appendChild(title);

        nameCell.addEventListener("click", () => {
            localStorage.setItem("currentAnime", JSON.stringify(anime));
            window.location.href = `animedetails.html?id=${anime.mal_id}`;
        });
        row.appendChild(nameCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = anime.status;
        row.appendChild(statusCell);

        const episodesCell = document.createElement("td");
        episodesCell.textContent = `${anime.current_episode} / ${anime.total_episodes}`;
        row.appendChild(episodesCell);

        const ratingCell = document.createElement("td");
        ratingCell.textContent = getRatingText(anime.rating);
        row.appendChild(ratingCell);

        const actionsCell = document.createElement("td");
        actionsCell.classList.add("actions-container");

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => {
            showModal(anime, index);
        });
        actionsCell.appendChild(updateButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button"); // Add a class for styling
        deleteButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this anime from your wishlist?")) {
                const index = wishlist.indexOf(anime);
                if (index !== -1) {
                    wishlist.splice(index, 1);
                    localStorage.setItem("wishlist", JSON.stringify(wishlist));
                    renderAnimeList();
                    alert("Anime deleted from wishlist.");
                }
            }
        });
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);

        animeTableBody.appendChild(row);
    });
}

// Function to convert numeric ratings to text
function getRatingText(value) {
    switch (value) {
        case "1":
            return "Bad";
        case "2":
            return "Poor";
        case "3":
            return "Average";
        case "4":
            return "Good";
        case "5":
            return "Very Good";
        default:
            return "";
    }
}

// Function to show the modal for updating anime details
function showModal(anime, index) {
    currentAnimeIndex = index;
    statusSelectModal.value = anime.status;
    currentEpisodeModal.value = anime.current_episode;
    ratingModal.value = anime.rating;
    updateModal.style.display = "flex";
}

// Event listener for the close modal button
closeModal.onclick = function() {
    updateModal.style.display = "none";
}

// Event listener to close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === updateModal) {
        updateModal.style.display = "none";
    }
}

// Event listener for the save update button in the modal
saveUpdateButton.onclick = function() {
    const updatedAnime = wishlist[currentAnimeIndex];
    const currentEpisode = parseInt(currentEpisodeModal.value);
    const totalEpisodes = parseInt(updatedAnime.total_episodes);

    if (isNaN(currentEpisode) || currentEpisode < 1) {
        alert("Please enter a valid number for the current episode.");
        return;
    }

    if (currentEpisode > totalEpisodes) {
        alert("Current episode cannot exceed the total number of episodes.");
        return;
    }

    updatedAnime.status = statusSelectModal.value;
    updatedAnime.current_episode = currentEpisode;
    updatedAnime.rating = ratingModal.value;
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderAnimeList();
    updateModal.style.display = "none";
}

// Initialize the anime list on page load
document.addEventListener("DOMContentLoaded", function () {
    renderAnimeList();
});
