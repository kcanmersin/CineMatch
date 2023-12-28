# movietomovie.py

import pandas as pd
#import torch
import joblib
from AI.NCFmodel import NCF  # Import the NCF class from the AI module
from pathlib import Path
import pandas as pd
import numpy as np
import pickle
import logging


def load_cosine_similarity_matrix(file_path):
    """Load the cosine similarity matrix from a file."""
    try:
        with open(file_path, 'rb') as file:
            return pickle.load(file)
    except Exception as e:
        logging.error(f"Error loading cosine similarity matrix: {e}")
        return None

def get_recommendations_by_movieId(movieId, movies, cosine_sim):
    """Get movie recommendations based on movieId using the cosine similarity matrix."""
    try:
        idx = movies.index[movies['id'] == movieId].tolist()[0]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:11]
        movie_indices = [i[0] for i in sim_scores]
        return movies.loc[movie_indices, ['title', 'id']]
    except IndexError:
        logging.warning(f"movieId {movieId} not found in the dataset.")
        return pd.DataFrame()

def movie_to_movie(movieId):
    # Set up the base directory
    BASE_DIR = Path(__file__).resolve().parent.parent

    # Load the movies data and cosine similarity matrix
    movies_cine_match = pd.read_csv(str(BASE_DIR / 'AI' / 'movies_out.csv'))
    cosine_sim = load_cosine_similarity_matrix(str(BASE_DIR / 'AI' / 'cosine_sim.pkl'))

    # If the cosine similarity matrix is not loaded, return empty results
    if cosine_sim is None:
        return [], []

    # Get recommendations
    recommended_movies = get_recommendations_by_movieId(movieId, movies_cine_match, cosine_sim)

    # Extract IDs and titles
    recommended_movie_ids = recommended_movies['id'].tolist()
    recommended_movie_titles = recommended_movies['title'].tolist()

    return recommended_movie_ids, recommended_movie_titles


# def movie_to_movie(movieId):
#     BASE_DIR = Path(__file__).resolve().parent.parent

#     with open(str(BASE_DIR) + "/AI/movie_recommendation_model.pkl", "rb") as pkl_file:
#         loaded_model = joblib.load(pkl_file)

#     similar_movies = loaded_model.recommend_similar_movies(movieId)
#     # return [64, 65, 66, 68, 69, 70, 71, 73, 74, 76]
#     return similar_movies

# def movie_to_movie(movieId):
#     # Predefined movie IDs and their dummy names
#     dummy_movies = {
#         5: "Space Adventure",
#         65: "Romantic Sunset",
#         66: "Mystery of the Pyramid",
#         68: "Journey Through Time",
#         69: "The Lost City",
#         70: "Funny Days",
#         71: "Drama in the Rain",
#         73: "Action Hero",
#         74: "Fantasy World",
#         76: "Detective Story"
#     }

#     # List of predefined similar movie IDs
#     similar_movie_ids = [5, 65, 66, 68, 69, 70, 71, 73, 74, 76]

#     # Retrieving movie names for the similar movie IDs
#     similar_movie_names = [dummy_movies[movie_id] for movie_id in similar_movie_ids]

#     return similar_movie_ids, similar_movie_names
