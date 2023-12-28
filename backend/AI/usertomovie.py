
# %%
import pandas as pd
import numpy as np
from surprise import Reader, Dataset, SVD
from surprise.model_selection import train_test_split

def load_movielens_data(ratings_path, movies_path):
    # Load ratings and movie details
    ratings = pd.read_csv(ratings_path)
    movies = pd.read_csv(movies_path)
    return ratings, movies

def collaborative_filtering(ratings):
    # Convert the ratings DataFrame to a Surprise dataset
    reader = Reader(rating_scale=(0.5, 5))
    data = Dataset.load_from_df(ratings[['userId', 'tmdbId', 'rating']], reader)

    # Build the full trainset
    full_trainset = data.build_full_trainset()

    # Use SVD algorithm for collaborative filtering on the full trainset
    svd = SVD(n_factors=150, n_epochs=20, random_state=42)
    svd.fit(full_trainset)

    return svd

def random_popular_movies(all_movies, top_n=10):
    # Get top N most rated movies and randomly select 10 of them
    top_movies = all_movies.sort_values(by='vote_average', ascending=False).head(top_n*10)

    # Randomly select 10 movies
    top_movies = top_movies.sample(10)  
    return top_movies[['title', 'tmdbId']]

def recommend_for_new_user_content_based(user_ratings, all_movies, cosine_sim, top_n=10):
    
    # Create a dataset from the new user's ratings
    user_ratings_df = pd.DataFrame(user_ratings, columns=['userId', 'tmdbId', 'rating'])
    user_id = user_ratings_df['userId'].iloc[0]

    # filter 3.5 or higher user_rating
    rated_movies = user_ratings_df[user_ratings_df['rating'] >= 3.5]['tmdbId'].tolist()

    # If there are no ratings above 3.5, return popular movies
    if len(rated_movies) == 0:
        return random_popular_movies(all_movies, top_n=10)

    # Find similar movies using content-based filtering (cosine similarity)
    similar_movies = set()
    for movie_id in rated_movies:
        # Get the index of the movie in the movies DataFrame
        idx = all_movies[all_movies['tmdbId'] == movie_id].index[0]
        
        # Get the top N similar movies based on cosine similarity
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
        similar_movies.update([i[0] for i in sim_scores])

    # Filter and return recommended movies
    recommended_movies = all_movies.iloc[list(similar_movies)]

    # get topn movies
    recommended_movies = recommended_movies.sort_values(by='vote_average', ascending=False).head(top_n)

    return recommended_movies[['original_title', 'tmdbId']]

def recommend_for_user(user_ratings, all_movies, ratings, cosine_sim, svd_model, top_n=10):

    # If there are no ratings, return popular movies
    if len(user_ratings) == 0:
        return random_popular_movies(all_movies, top_n=10)
    
    user_id = user_ratings[0][0]  # Extract user_id from the user_ratings

    # Check if the user_id is in the ratings dataset
    if user_id in ratings['userId'].unique():

        # Collaborative filtering predictions using SVD
        user_movies = ratings[ratings['userId'] == user_id]['tmdbId'].tolist()
        unrated_movies = all_movies[~all_movies['tmdbId'].isin(user_movies)]
        svd_predictions = [svd_model.predict(user_id, movie_id).est for movie_id in unrated_movies['tmdbId']]
        svd_recommendations = pd.DataFrame({'tmdbId': unrated_movies['tmdbId'], 'predicted_rating': svd_predictions})

        # get the top 20 movies
        svd_recommendations = svd_recommendations.sort_values(by='predicted_rating', ascending=False).head(10)

        # Content-based recommendations
        user_ratings_df = pd.DataFrame(user_ratings, columns=['userId', 'tmdbId', 'rating'])
        content_based_recommendations = recommend_for_new_user_content_based(user_ratings_df.values, all_movies, cosine_sim, top_n=6)

        # Concatenate and drop duplicates
        hybrid_recommendations = pd.concat([svd_recommendations, content_based_recommendations])
        hybrid_recommendations = hybrid_recommendations.drop_duplicates(subset='tmdbId', keep='first')

        # Get the movie details for the hybrid recommendations
        top_recommendations =  all_movies[all_movies['tmdbId'].isin(hybrid_recommendations['tmdbId'])]

        # Sort by predicted ratings (or any other relevant metric)
        #top_recommendations = top_recommendations.sort_values(by='predicted_rating', ascending=False)
        top_recommendations = top_recommendations.sort_values(by='vote_average', ascending=False)

        # Return top_n recommendations
        top_recommendations = top_recommendations.head(top_n)

        # merge the predicted ratings
        returning_recommendations = top_recommendations.merge(hybrid_recommendations, on='tmdbId', how='inner')
        
        return returning_recommendations[['original_title', 'tmdbId', 'predicted_rating']]

    else:
        # User is not in the ratings dataset, use content-based recommendation
        content_based_recommendations = recommend_for_new_user_content_based(user_ratings, all_movies, cosine_sim, top_n=10)

        return content_based_recommendations[['original_title', 'tmdbId']]
        
def user_to_movie(user_ratings, movies, ratings, cosine_sim, svd_model):

    movies = recommend_for_user(user_ratings, movies, ratings, cosine_sim, svd_model)
    return movies[['tmdbId']]

# %%
# Example usage with user input ratings
user_ratings = [(99999999, 27205, 4), (99999999, 157336, 4)]

ratings, movies = load_movielens_data('data/ratings.csv', 'data/movieCineMatch.csv')

# 1: train the model, 0: load the model from pickle files
train_collab = 0       

if train_collab == 1:
    svd_model = collaborative_filtering(ratings)        
    svd_model = pd.to_pickle(svd_model, 'pickle_files/svd_model.pkl')

svd_model = pd.read_pickle('pickle_files/svd_model.pkl')   
cosine_sim = pd.read_pickle('pickle_files/cosine_sim.pkl')
# %%
recommended_movies = user_to_movie(user_ratings, movies, ratings, cosine_sim, svd_model)
#maybe reset index needed


# %%
