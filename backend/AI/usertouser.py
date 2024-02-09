import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
#from surprise import Dataset, Reader, SVD
import psycopg2 
import os

def create_user_item_matrix(ratings):
    # Drop duplicate ratings if any
    ratings = ratings.drop_duplicates(subset=['userId', 'tmdbId'], keep='first')
    
    user_item_matrix = ratings.pivot(index='userId', columns='tmdbId', values='rating') 
    user_item_matrix = user_item_matrix.fillna(0)  # Fill NaN with 0
    return user_item_matrix

def calculate_cosine_similarity(user_item_matrix):
    cosine_sim = cosine_similarity(user_item_matrix)
    return pd.DataFrame(cosine_sim, index=user_item_matrix.index, columns=user_item_matrix.index)


def read_ratings_from_database():
    
    db_host = os.environ.get('DB_HOST')
    db_name = os.environ.get('DB_NAME')
    db_user = os.environ.get('DB_USER')
    db_password = os.environ.get('DB_PASSWORD')

    # Connect to the PostgreSQL database server
    with psycopg2.connect(host=db_host, database=db_name, user=db_user, password=db_password) as conn:
        with conn.cursor() as cur:
            # Fetch entire ratings dataset
            sql_query = """SELECT "user_id", "movie_id", "rate_point" FROM "APImovie_rate";"""
            cur.execute(sql_query)
            ratings = cur.fetchall()

    # Convert to DataFrame
    ratings_df = pd.DataFrame(ratings, columns=['userId', 'tmdbId', 'rating'])

    return ratings_df

def find_similar_users(user_id, top_n=10):

    ratings = read_ratings_from_database()
    user_item_matrix = create_user_item_matrix(ratings)
    cosine_sim_matrix = calculate_cosine_similarity(user_item_matrix)

    if user_id not in cosine_sim_matrix.index:
        return pd.DataFrame(columns=['similar_userId', 'similarity_score'])

    # Extract the similarity scores for the given user
    sim_scores = cosine_sim_matrix.loc[user_id]

    # Convert to DataFrame for easier manipulation
    sim_scores = sim_scores.to_frame(name='similarity_score')

    # Reset index to turn the user IDs into a regular column
    sim_scores.reset_index(inplace=True)

    # Rename columns for clarity
    sim_scores.rename(columns={'userId': 'similar_userId'}, inplace=True)

    # make similiarty score between 0 - 100  and round to 2 decimal places
    sim_scores['similarity_score'] = sim_scores['similarity_score'].apply(lambda x: round(x*100,2))

    # Filter out the user themselves and any zero similarity scores
    sim_scores = sim_scores[(sim_scores['similar_userId'] != user_id) & (sim_scores['similarity_score'] > 0)]

    # Sort by similarity score in descending order and select top N
    top_users = sim_scores.sort_values(by='similarity_score', ascending=False).head(top_n)

    return top_users

def user_to_user_fun(id):
    user_id = id  # Example user ID
    similar_users_scores = find_similar_users(user_id)
    return similar_users_scores
#%%
#ratings = read_ratings_from_database()
#user_item_matrix = create_user_item_matrix(ratings)
#cosine_sim_matrix = calculate_cosine_similarity(user_item_matrix)

#print(ratings)
#print('---------------------')
#print(user_item_matrix)
#print('---------------------')
#print(cosine_sim_matrix)

#%%


#user_id_list = ratings['userId'].unique()
#for user_id in user_id_list:
#    similar_users = find_similar_users(user_id)
#    # print the user id and the similar users
#    print( 'user_id: ', user_id)
#    
#    print(similar_users)
#    print('---------------------')





''''''''' below  code is takes long to run
# %%
import pandas as pd
import numpy as np
from surprise import Dataset, Reader, SVD

# Function to load data
def load_movielens_data(ratings_path, movies_path):
    ratings = pd.read_csv(ratings_path)
    movies = pd.read_csv(movies_path)
    return ratings, movies

# Function to train SVD model
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

# Function to find similar users
def find_similar_users(user_id, model, ratings, top_n=10):
    inner_user_id = model.trainset.to_inner_uid(user_id)
    inner_user_ids = [model.trainset.to_inner_uid(uid) for uid in ratings['userId'].unique()]

    # Compute similarities on-the-fly
    user_similarities = np.zeros(model.trainset.n_users)
    user_vec = model.pu[inner_user_id]

    for uiid in inner_user_ids:
        if uiid != inner_user_id:
            vec = model.pu[uiid]
            sim = np.dot(user_vec, vec) / (np.linalg.norm(user_vec) * np.linalg.norm(vec))
            user_similarities[uiid] = sim

    # Find top N similar users
    similar_users = np.argsort(user_similarities)[::-1][1:top_n+1]  # Exclude self
    similar_users_raw_ids = [model.trainset.to_raw_uid(iuid) for iuid in similar_users]

    # add similarity percentage score column
    similar_users_raw_ids = pd.DataFrame(similar_users_raw_ids, columns=['userId'])
    similar_users_raw_ids['similarity_score'] = user_similarities[similar_users]
    
    return similar_users_raw_ids

#%%

# Load data and train model as before
ratings, movies = load_movielens_data('data/ratings.csv', 'data/movieCineMatch.csv')    
#%%
user_id = 1

# if user id is not in trainset, we need to train the model
if user_id not in ratings['userId'].unique():
    svd_model = collaborative_filtering(ratings)        
    svd_model = pd.to_pickle(svd_model, 'pickle_files/svd_model.pkl')

# Load the model from pickle files
svd_model = pd.read_pickle('pickle_files/svd_model.pkl')
#%%
# Find similar users for a given user ID
user_id = 1
similar_users = find_similar_users(user_id, svd_model, ratings)
print(similar_users)
'''''''''
