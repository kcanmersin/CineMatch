import pandas as pd
import numpy as np
from ast import literal_eval
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def safe_eval(s):
    """ Safely evaluate stringified lists/dictionaries. """
    try:
        return literal_eval(s)
    except (ValueError, SyntaxError):
        return s

def load_csv_data(file_path):
    """ Load data from a CSV file. """
    try:
        return pd.read_csv(file_path)
    except Exception as e:
        print(f"Error loading file {file_path}: {e}")
        return pd.DataFrame()

def filter_movies(all_movies, cine_match_movies):
    """ Filter and preprocess movie data. """
    filtered_movies = all_movies[all_movies['tmdbId'].isin(cine_match_movies['tmdbId'])]
    return filtered_movies.drop_duplicates(subset=['tmdbId']).reset_index(drop=True)

def get_director(crew):
    """ Extract director's name from crew data. """
    for crew_member in crew:
        if crew_member['job'] == 'Director':
            return crew_member['name']
    return np.nan

def get_top_three_names(data, key='name'):
    """ Extract top three names from a list of dictionaries. """
    if isinstance(data, list):
        names = [item[key] for item in data if key in item][:3]
        return names
    return []

def get_top_five_actors(cast_data):
    """ Extract top five actor names from cast data. """
    sorted_cast = sorted(cast_data, key=lambda x: x.get('order', 0))
    return [actor['name'] for actor in sorted_cast[:5]]

def create_combined_features(filtered_movies):
    """ Create a combined feature string for each movie. """
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
            ' '.join(row['director'])
        ]),
        axis=1
    )

def calculate_cosine_similarity(feature_soup):
    """ Calculate cosine similarity matrix from the feature soup. """
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(feature_soup)
    return cosine_similarity(tfidf_matrix, tfidf_matrix)

def main():
    # Load and preprocess data
    movie_match_data = load_csv_data('data2/movieCineMatch.csv')
    raw_movie_data = load_csv_data('data2/movieRaw.csv')

    processed_movies = filter_movies(raw_movie_data, movie_match_data)
    combined_features = create_combined_features(processed_movies)

    # Calculate cosine similarity
    cosine_similarity_matrix = calculate_cosine_similarity(combined_features)

    # Save cosine similarity matrix
    pd.DataFrame(cosine_similarity_matrix).to_pickle('cosine_similarity_matrix.pkl')

if __name__ == "__main__":
    main()
