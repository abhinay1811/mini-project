import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://www.omdbapi.com/?apikey=3af86341';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [activeTab, setActiveTab] = useState('search');

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    const searchMovies = async (title) => {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();
        if (data.Search) {
            setMovies(data.Search);
        }
    };

    const getMovieDetails = async (id) => {
        const response = await fetch(`${API_URL}&i=${id}`);
        const data = await response.json();
        setSelectedMovie(data);
    };

    const addToFavorites = (movie) => {
        const updatedFavorites = [...favorites, movie];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const removeFromFavorites = (id) => {
        const updatedFavorites = favorites.filter(movie => movie.imdbID !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="app">
            <h1>IMDB Clone</h1>
            <div className="navbar">
                <button 
                    className={activeTab === 'search' ? 'active' : ''} 
                    onClick={() => setActiveTab('search')}>Search</button>
                <button 
                    className={activeTab === 'favorites' ? 'active' : ''} 
                    onClick={() => setActiveTab('favorites')}>Favorites</button>
            </div>
            {activeTab === 'search' && (
                <>
                    <input 
                        type="text" 
                        placeholder="Search for movies..." 
                        value={searchTerm} 
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            searchMovies(e.target.value);
                        }}
                    />
                    <div className="movies">
                        {movies.map(movie => (
                            <div key={movie.imdbID} className="movie">
                                <img src={movie.Poster} alt={movie.Title} onClick={() => getMovieDetails(movie.imdbID)} />
                                <h3>{movie.Title}</h3>
                                <button onClick={() => addToFavorites(movie)}>Add to Favorites</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {activeTab === 'favorites' && (
                <>
                    <h2>My Favorite Movies</h2>
                    <div className="favorites">
                        {favorites.map(movie => (
                            <div key={movie.imdbID} className="movie">
                                <img src={movie.Poster} alt={movie.Title} onClick={() => getMovieDetails(movie.imdbID)} />
                                <h3>{movie.Title}</h3>
                                <button onClick={() => removeFromFavorites(movie.imdbID)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {selectedMovie && (
                <div className="movie-details">
                    <h2>{selectedMovie.Title}</h2>
                    <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
                    <p>{selectedMovie.Plot}</p>
                    <p><strong>Year:</strong> {selectedMovie.Year}</p>
                    <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
                    <button onClick={() => setSelectedMovie(null)}>Close</button>
                </div>
            )}
        </div>
    );
}

export default App;
