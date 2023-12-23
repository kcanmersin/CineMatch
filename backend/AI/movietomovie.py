# movietomovie.py

import pandas as pd
#import torch
import joblib
from AI.NCFmodel import NCF  # Import the NCF class from the AI module
from pathlib import Path

# def movie_to_movie(movieId):
#     BASE_DIR = Path(__file__).resolve().parent.parent

#     with open(str(BASE_DIR) + "/AI/movie_recommendation_model.pkl", "rb") as pkl_file:
#         loaded_model = joblib.load(pkl_file)

#     similar_movies = loaded_model.recommend_similar_movies(movieId)
#     # return [64, 65, 66, 68, 69, 70, 71, 73, 74, 76]
#     return similar_movies

def movie_to_movie(movieId):
    # Predefined movie IDs and their dummy names
    dummy_movies = {
        5: "Space Adventure",
        65: "Romantic Sunset",
        66: "Mystery of the Pyramid",
        68: "Journey Through Time",
        69: "The Lost City",
        70: "Funny Days",
        71: "Drama in the Rain",
        73: "Action Hero",
        74: "Fantasy World",
        76: "Detective Story"
    }

    # List of predefined similar movie IDs
    similar_movie_ids = [5, 65, 66, 68, 69, 70, 71, 73, 74, 76]

    # Retrieving movie names for the similar movie IDs
    similar_movie_names = [dummy_movies[movie_id] for movie_id in similar_movie_ids]

    return similar_movie_ids, similar_movie_names
