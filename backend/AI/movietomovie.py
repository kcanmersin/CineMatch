# movietomovie.py

import pandas as pd
import torch
import joblib
from AI.NCFmodel import NCF  # Import the NCF class from the AI module
from pathlib import Path

def movie_to_movie(movieId):
    # BASE_DIR = Path(__file__).resolve().parent.parent

    # with open(str(BASE_DIR) + "\AI\movie_recommendation_model.pkl", "rb") as pkl_file:
    #     loaded_model = joblib.load(pkl_file)

    # similar_movies = loaded_model.recommend_similar_movies(movieId)
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    # return similar_movies
