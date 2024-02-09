import pandas as pd
import numpy as np
from ast import literal_eval
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
import torch
import pickle

# Your provided functions for preprocessing
def safe_eval(s):
    try:
        return literal_eval(s)
    except (ValueError, SyntaxError):
        return s

def load_csv_data(file_path):
    try:
        return pd.read_csv(file_path)
    except Exception as e:
        print(f"Error loading file {file_path}: {e}")
        return pd.DataFrame()

def get_director(crew):
    for crew_member in crew:
        if crew_member['job'] == 'Director':
            return crew_member['name']
    return np.nan

def get_top_three_names(data, key='name'):
    if isinstance(data, list):
        names = [item[key] for item in data if key in item][:3]
        return names
    return []

def get_top_five_actors(cast_data):
    sorted_cast = sorted(cast_data, key=lambda x: x.get('order', 0))
    return [actor['name'] for actor in sorted_cast[:5]]

def create_combined_features(filtered_movies):
    for feature in ['genres', 'keywords', 'cast', 'crew']:
        filtered_movies[feature] = filtered_movies[feature].apply(safe_eval)

    filtered_movies['director'] = filtered_movies['crew'].apply(get_director)
    filtered_movies['cast'] = filtered_movies['cast'].apply(get_top_five_actors)
    filtered_movies['genres'] = filtered_movies['genres'].apply(lambda x: get_top_three_names(x))
    filtered_movies['keywords'] = filtered_movies['keywords'].apply(lambda x: get_top_three_names(x))
    filtered_movies['overview'] = filtered_movies['overview'].fillna('')
    filtered_movies['director'] = filtered_movies['director'].apply(lambda x: [x] if x else [])

    return filtered_movies.apply(
        lambda row: ' '.join([
            row['overview'],
            ' '.join(row['genres']),
            ' '.join(row['cast']),
            ' '.join(row['keywords']),
            # you may want to give more imporatance to director  
            #' '.join(row['director']),
            #' '.join(row['director']),
            ' '.join(row['director'])
        ]),
        axis=1
    )

# BERT Embeddings function
def bert_embed_text(text, tokenizer, model):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512, padding='max_length')
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).numpy()[0]

def main():
    # Load and preprocess data
    movie_df = load_csv_data('CineMatch1000.csv')
    combined_features = create_combined_features(movie_df)

    # Initialize BERT tokenizer and model
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained('bert-base-uncased')

    # Generate BERT embeddings for combined features
    bert_embeddings = np.array([bert_embed_text(text, tokenizer, model) for text in combined_features])

    # Calculate cosine similarity
    cosine_similarity_matrix = cosine_similarity(bert_embeddings)

    return cosine_similarity_matrix

# Execute the main function
cosine_similarity_matrix = main()

# Save cosine similarity matrix
with open('cosine_similarity_matrix.pkl', 'wb') as file:
    pickle.dump(cosine_similarity_matrix, file)