# movietomovie.py

import pandas as pd
import torch
import joblib
from AI.NCFmodel import NCF  # Import the NCF class from the AI module

def movie_to_movie(movieId):
    with open(r"C:\courses\CSE343SE\CineMatch\backend\AI\movie_recommendation_model.pkl", "rb") as pkl_file:
        loaded_model = joblib.load(pkl_file)

    similar_movies = loaded_model.recommend_similar_movies(movieId)
    return similar_movies
