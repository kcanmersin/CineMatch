# NCFmodel.py

import torch
import torch.nn as nn
import pandas as pd
from pathlib import Path

class NCF(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=8):
        super(NCF, self).__init__()
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)
        self.fc_layers = nn.Sequential(
            nn.Linear(embedding_dim * 2, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, user_ids, item_ids):
        user_embedded = self.user_embedding(user_ids)
        item_embedded = self.item_embedding(item_ids)
        vector = torch.cat([user_embedded, item_embedded], dim=-1)
        return self.fc_layers(vector).view(-1)

    def recommend_similar_movies(self, movieId, top_k=10):
        input_movie_embedding = self.item_embedding(torch.tensor([movieId]))

        all_movie_embeddings = self.item_embedding.weight
        similarities = nn.functional.cosine_similarity(input_movie_embedding, all_movie_embeddings, dim=1)

        similar_movie_indices = torch.argsort(similarities, descending=True)[1:top_k + 1]
        similar_movieIds = [idx.item() for idx in similar_movie_indices]

        BASE_DIR = Path(__file__).resolve().parent.parent

        movieId_to_name = pd.read_csv(str(BASE_DIR) + '\AI\movies_out.csv')
        
        similar_movies_names = []
        for movieId in similar_movieIds:
            movie_info = movieId_to_name[movieId_to_name['id'] == movieId]['title'].values
            if len(movie_info) > 0:
                movie_name = movie_info[0]
                similar_movies_names.append(movie_name)
            else:
                print(f"Movie with ID {movieId} not found in the DataFrame.")

        #return similar_movieIds, similar_movies_names
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
