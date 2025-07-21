
const api = '793f95657098381b2f3b21f612e5e816';
const url = 'https://api.themoviedb.org/3';
const Img_url = 'https://image.tmdb.org/t/p/w500';

const searchBar = document.getElementById('searchBar');
const moviesContainer = document.getElementById('movies');
const categoriesContainer = document.getElementById('categoriesContainer');
const genreList = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
    { id: 16, name: 'Animation' },
    { id: 12, name: 'Adventure' }
];

function renderCategoryButtons() {
    genreList.forEach(genre => {
        const btn = document.createElement('button');
        btn.classList.add('category-btn');
        btn.textContent = genre.name;
        btn.addEventListener('click', () => {
            fetchMovies(`${url}/discover/movie?api_key=${api}&with_genres=${genre.id}`);
        });
        categoriesContainer.appendChild(btn);
    });
}

renderCategoryButtons();

window.addEventListener('DOMContentLoaded', () => {
    fetchMovies(`${url}/trending/movie/week?api_key=${api}`);
});

searchBar.addEventListener('input', () => {
    const query = searchBar.value.trim();
    if (query.length > 2) {
        fetchMovies(`${url}/search/movie?api_key=${api}&query=${query}`);
    }
});

async function fetchMovies(url) {
    try {
        const res = await fetch(url);
        const movies = await res.json();
        displayMovies(movies.results);
    } catch (err) {
        console.error('Failed to fetch movies:', err);
    }
}

function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    if (!movies || movies.length === 0) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));

        movieCard.innerHTML = `
          <img src="${movie.poster_path ? Img_url + movie.poster_path : 'https://via.placeholder.com/200x300'}" alt="${movie.title}">
          <div class="movie-title">${movie.title}</div>
          <div class="movie-info">Release: ${movie.release_date || 'N/A'}</div>
          <div class="movie-info">Rating: ${movie.vote_average || 'N/A'}</div>
        `;

        moviesContainer.appendChild(movieCard);
    });
}

async function showMovieDetails(movieId) {
    try {
        const res = await fetch(`${url}/movie/${movieId}?api_key=${api}`);
        const movie = await res.json();

        const modalContent = `
          <h2>${movie.title}</h2>
          <img src="${movie.poster_path ? Img_url + movie.poster_path : 'https://via.placeholder.com/200x300'}" alt="${movie.title}" style="width:200px; float:left; margin-right:20px;">
          <p><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</p>
          <p><strong>Rating:</strong> ${movie.vote_average || 'N/A'}</p>
          <p><strong>Runtime:</strong> ${movie.runtime} mins</p>
          <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
          <p><strong>Overview:</strong> ${movie.overview}</p>
        `;

        document.getElementById('modalContent').innerHTML = modalContent;
        document.getElementById('movieModal').style.display = 'flex';
    } catch (err) {
        console.error('Failed to fetch movie details:', err);
    }
}

function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
}