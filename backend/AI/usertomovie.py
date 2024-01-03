import pandas as pd
#from surprise import Reader, Dataset, SVD
from pathlib import Path
import numpy as np
import random
BASE_DIR = Path(__file__).resolve().parent.parent
#def load_movielens_data(ratings_path, movies_path):
#    # Load ratings and movie details
#    ratings = pd.read_csv(ratings_path)
#    movies = pd.read_csv(movies_path)
#    return ratings, movies
#
#def collaborative_filtering(ratings):
#    # Convert the ratings DataFrame to a Surprise dataset
#    reader = Reader(rating_scale=(0.5, 5))
#    data = Dataset.load_from_df(ratings[['userId', 'id', 'rating']], reader)
#
#    # Build the full trainset
#    full_trainset = data.build_full_trainset()
#
#    # Use SVD algorithm for collaborative filtering on the full trainset
#    svd = SVD(n_factors=150, n_epochs=20, random_state=42)
#    svd.fit(full_trainset)
#
#    return svd

def random_popular_movies(all_movies, top_n=10):
    # Get top N most rated movies and randomly select 10 of them
    top_movies = all_movies.sort_values(by='vote_average', ascending=False).head(top_n*10)
    top_movies = top_movies.sample(10)  
    return top_movies[['title', 'id']]

def recommend_for_new_user_content_based(user_ratings, all_movies, cosine_sim, top_n=10):
    user_ratings_df = pd.DataFrame(user_ratings, columns=['userId', 'id', 'rating'])
    user_id = user_ratings_df['userId'].iloc[0]

    rated_movies = user_ratings_df[user_ratings_df['rating'] >= 3.5]['id'].tolist()

    if len(rated_movies) == 0:
        return random_popular_movies(all_movies, top_n=10)

    similar_movies = set()
    for movie_id in rated_movies:
        idx = all_movies[all_movies['id'] == movie_id].index[0]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
        similar_movies.update([i[0] for i in sim_scores])

    recommended_movies = all_movies.iloc[list(similar_movies)]
    recommended_movies = recommended_movies.sort_values(by='vote_average', ascending=False).head(top_n)

    return recommended_movies[['original_title', 'id']]

def recommend_for_user(user_ratings, all_movies, cosine_sim, ratings=None,  svd_model=None, top_n=10):
#    if not user_ratings:
#        # If user_ratings is empty, return random popular movies
#        return random_popular_movies(all_movies, top_n=top_n)['id'].tolist()
#    
#    user_id = user_ratings[0][0]
#
#    if user_id in ratings['userId'].unique():
#        user_movies = ratings[ratings['userId'] == user_id]['id'].tolist()
#        unrated_movies = all_movies[~all_movies['id'].isin(user_movies)]
#        svd_predictions = [svd_model.predict(user_id, movie_id).est for movie_id in unrated_movies['id']]
#        svd_recommendations = pd.DataFrame({'id': unrated_movies['id'], 'predicted_rating': svd_predictions})
#        svd_recommendations = svd_recommendations.sort_values(by='predicted_rating', ascending=False).head(10)
#
#        user_ratings_df = pd.DataFrame(user_ratings, columns=['userId', 'id', 'rating'])
#        content_based_recommendations = recommend_for_new_user_content_based(user_ratings_df.values, all_movies, cosine_sim, top_n=6)
#
#        hybrid_recommendations = pd.concat([svd_recommendations, content_based_recommendations])
#        hybrid_recommendations = hybrid_recommendations.drop_duplicates(subset='id', keep='first')
#
#        top_recommendations = all_movies[all_movies['id'].isin(hybrid_recommendations['id'])]
#        top_recommendations = top_recommendations.sort_values(by='vote_average', ascending=False)
#        top_recommendations = top_recommendations.head(top_n)
#
#        returning_recommendations = top_recommendations.merge(hybrid_recommendations, on='id', how='inner')
#        returning_recommendations = returning_recommendations.reset_index(drop=True)
#        
#        return returning_recommendations['id'].tolist()
#    else:
#        content_based_recommendations = recommend_for_new_user_content_based(user_ratings, all_movies, cosine_sim, top_n=10)
#        return content_based_recommendations['id'].tolist()
    
    if not user_ratings:
        # If user_ratings is empty, return random popular movies
        return random_popular_movies(all_movies, top_n=top_n)['id'].tolist()
    
    content_based_recommendations = recommend_for_new_user_content_based(user_ratings, all_movies, cosine_sim, top_n=10)
    return content_based_recommendations['id'].tolist()  


def user_to_movie(user_ratings):
    print(user_ratings)
  
    #ratings, movies = load_movielens_data(str(BASE_DIR / 'AI' / 'ratings.csv'), str(BASE_DIR / 'AI' / 'movies_out.csv'))

    
#    train_collab = 0
#    if train_collab == 1:
#        svd_model = collaborative_filtering(ratings)
#        pd.to_pickle(svd_model, str(BASE_DIR / 'AI' / 'svd_model.pkl'))
#    else:
#        svd_model = pd.read_pickle(str(BASE_DIR / 'AI' / 'svd_model.pkl'))
#        cosine_sim = pd.read_pickle(str(BASE_DIR / 'AI' / 'cosine_sim.pkl'))
#        movie_ids = recommend_for_user(user_ratings, movies, ratings, cosine_sim, svd_model)
#    movie_ids = recommend_for_user(user_ratings, movies, ratings, cosine_sim, svd_model)
#    return movie_ids
    


    movies = pd.read_csv(str(BASE_DIR / 'AI' / 'movies_out.csv'))

    try:
        cosine_sim = pd.read_pickle(str(BASE_DIR / 'AI' / 'pickle_files' / 'cosine_sim.pkl'))
    except:
        print("cosine_sim.pkl not found")

    movie_ids = recommend_for_user(user_ratings, movies, cosine_sim)

    return movie_ids

