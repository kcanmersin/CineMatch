# %%
import numpy as np
import pandas as pd
import ast
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed


# Read and process Movies
def read_movies(movies_path, dtype=None):
    movies = pd.read_csv(movies_path, dtype={"popularity": "object"}, low_memory=False)
    movies = movies[pd.to_numeric(movies["id"], errors="coerce").notna()]
    movies["id"] = movies["id"].astype(int)
    movies.rename(columns={"id": "tmdbId"}, inplace=True)
    for (
        index,
        row,
    ) in movies.iterrows():  # Drop rows where 'adult' is not "True" or "False"
        if row["adult"] != "True" and row["adult"] != "False":
            movies.drop(index, inplace=True)
    movie_cols = [
        "tmdbId",
        "imdb_id",
        "genres",
        "original_language",
        "original_title",
        "title",
        "overview",
        "release_date",
        "runtime",
        "vote_average",
        "vote_count",
        "popularity",
    ]
    movies = movies[movie_cols]

    return movies


# %%
# Define the IMDb weighted rating function
def imdb_weighted_rating(df, var=0.96):
    # Filter out rows with missing values in 'averageRating' or 'numVotes'
    df = df.dropna(subset=["vote_average", "vote_count"])

    v = df["vote_count"]
    R = df["vote_average"]
    C = df["vote_average"].mean()
    m = df["vote_count"].quantile(var)

    # Calculate IMDb weighted rating for each row
    score = (v / (v + m)) * R + (m / (v + m)) * C

    return score


def clean_release_date(movies):
    # Convert 'release_date' to datetime
    movies["release_date"] = pd.to_datetime(movies["release_date"], errors="coerce")

    # Extract the year from the datetime column
    movies["release_date"] = movies["release_date"].dt.year

    # Fill missing values with 0 or any other appropriate strategy
    movies["release_date"] = movies["release_date"].fillna(0)

    # Convert the 'release_year' column to integers
    movies["release_date"] = movies["release_date"].astype("int")

    return movies


def clean_movie_title(movie_title):
    if movie_title.split(" ")[-1].startswith("("):
        # remove year from the title, e.g. Toy Story (1995) --> Toy Story
        movie_title = (" ".join(movie_title.split(" ")[:-1])).strip()

    if movie_title.title().split(",")[-1].strip() in ["The", "A"]:
        # article + movie title, e.g. Saint, The --> The Saint
        movie_title = (
            movie_title.title().split(",")[-1].strip()
            + " "
            + " ".join(movie_title.title().split(",")[:-1])
        ).strip()

    # otherwise, it was converting The Devil's Advocate to The Devil'S Advocate
    movie_title = movie_title.lower()
    return movie_title


def read_data(file_path, dtype=None):
    return pd.read_csv(file_path, dtype=dtype, low_memory=False)


# Function to parse genres from a string
def parse_genres(genres_str):
    genres_list = ast.literal_eval(genres_str)

    genre_ids = {genre_info.get("id") for genre_info in genres_list}

    return genre_ids


# Function to process genres data from a movies DataFrame and return the resulting DataFrame
def process_genres(movies):
    movies["genres"] = movies["genres"].apply(parse_genres)

    return movies


# Function to parse keywords from a string
def parse_keywords(keyword_str):
    keyword_list = ast.literal_eval(keyword_str)

    keyword_ids = {keyword_info.get("id") for keyword_info in keyword_list}

    return keyword_ids


# Function to process keywords data from a keywords DataFrame and return the resulting DataFrame
def process_keywords(keywords):
    keywords["keywords"] = keywords["keywords"].apply(parse_keywords)

    return keywords


# Function to parse credits from a string
def parse_credits(credit_str):
    credit_list = ast.literal_eval(credit_str)

    credit_ids = {credit_info.get("id") for credit_info in credit_list}

    return credit_ids


# Function to process credits data from a credits DataFrame and return the resulting DataFrame
def process_credits(credits):
    credits["cast"] = credits["cast"].apply(parse_credits)
    credits["crew"] = credits["crew"].apply(parse_credits)

    return credits


# Read and process Keywords
def read_keywords(keywords_path):
    keywords = pd.read_csv(keywords_path)
    keywords["id"] = keywords["id"].astype(int)
    keywords.rename(columns={"id": "tmdbId"}, inplace=True)
    non_finite_values = (
        keywords["tmdbId"].notna() & ~keywords["tmdbId"].astype(str).str.isdigit()
    )
    if non_finite_values.any():
        print("Rows with non-finite values in 'id' column:")
        print(keywords[non_finite_values])
        keywords["tmdbId"] = keywords["tmdbId"].fillna(-1).astype(int)
    else:
        keywords["tmdbId"] = keywords["tmdbId"].astype(int)

    keywords.rename(columns={"id": "tmdbId"}, inplace=True)
    columns = ["tmdbId", "keywords"]
    keywords = keywords[columns]

    return keywords


def read_credits(credits_path):
    credits = pd.read_csv(credits_path)
    credits["id"] = credits["id"].astype(int)
    credits.rename(columns={"id": "tmdbId"}, inplace=True)
    # Convert 'tmdbId' column to integer type and handle non-finite values
    non_finite_values = (
        credits["tmdbId"].notna() & ~credits["tmdbId"].astype(str).str.isdigit()
    )
    if non_finite_values.any():
        print("Rows with non-finite values in 'id' column:")
        print(credits[non_finite_values])
        credits["tmdbId"] = credits["tmdbId"].fillna(-1).astype(int)
    else:
        credits["tmdbId"] = credits["tmdbId"].astype(int)

    credits.rename(columns={"id": "tmdbId"}, inplace=True)
    columns = ["tmdbId", "cast", "crew"]
    credits = credits[columns]

    return credits


# Function to fetch only poster_path and backdrop_path from TMDb API
def get_movie_images(tmdb_id, api_key):
    url = (
        f"https://api.themoviedb.org/3/movie/{tmdb_id}?language=en-US&api_key={api_key}"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        movie_data = response.json()

        poster_path = movie_data.get("poster_path")
        backdrop_path = movie_data.get("backdrop_path")

        return {
            "tmdbId": tmdb_id,
            "poster_path": poster_path,
            "backdrop_path": backdrop_path,
        }
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error occurred for movie {tmdb_id}: {e}")
    except requests.exceptions.RequestException as e:
        print(f"Request exception occurred for movie {tmdb_id}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred for movie {tmdb_id}: {e}")
    return None


# Function to fetch movie images in parallel
def fetch_movie_images_parallel(tmdb_id):
    movie_images = get_movie_images(tmdb_id, tmdb_api_key)
    print(f"{tmdb_id} ")

    # Check if movie_images is not None before appending
    if movie_images:
        return movie_images
    else:
        return {"tmdbId": tmdb_id, "poster_path": None, "backdrop_path": None}


def main():
    keywords_path = "rawdata/keywords.csv"
    movies_path = "rawdata/movies_metadata.csv"
    credits_path = "rawdata/credits.csv"

    movies = read_movies(movies_path)
    movies[movies["original_title"] == "Inception"]

    # Apply IMDb weighted rating calculation
    movies["vote_average"] = imdb_weighted_rating(movies)

    movies = movies[(movies["vote_count"] >= 100) & (movies["vote_average"] > 5)]

    movies = clean_release_date(movies)

    movies["title"] = movies["title"].apply(lambda row: clean_movie_title(row))
    movies = movies[~movies.title.str.startswith("(")]

    df = movies

    keywords = read_keywords(keywords_path)
    credits = read_credits(credits_path)

    df = (
        df.sort_values("vote_count", ascending=False)
        .drop_duplicates("tmdbId")
        .sort_index()
    )
    # merge for raw data
    raw = pd.merge(df, keywords, on="tmdbId", how="inner")
    raw = pd.merge(raw, credits, on="tmdbId", how="inner")

    raw.to_csv("outdata/movieRaw.csv", index=False)

    df = process_genres(df)
    credits = process_credits(credits)
    keywords = process_keywords(keywords)

    # merge for processed data
    df = pd.merge(df, keywords, on="tmdbId", how="inner")
    df = pd.merge(df, credits, on="tmdbId", how="inner")

    links_df = df[["tmdbId"]].copy()

    # Set your TMDb API key
    tmdb_api_key = "YOUR_API_KEY"

    # Create a list to store movie details
    movies_poster_path = []

    # Use ThreadPoolExecutor to parallelize the API requests
    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(fetch_movie_images_parallel, tmdb_id)
            for tmdb_id in links_df["tmdbId"]
        ]

        # Process the completed futures
        for future in as_completed(futures):
            result = future.result()
            if result:
                movies_poster_path.append(result)

    # Convert the list of movie details to a DataFrame
    movies_poster_path_df = pd.DataFrame(movies_poster_path)

    # Save the result to 'movies_poster_path.csv'
    movies_poster_path_df.to_csv("movies_poster_path.csv", index=False)

    # merge df and movies_poster_path_df
    final_df = pd.merge(df, movies_poster_path_df, on="tmdbId", how="inner")

    # handle duplicate rows keep biggest vote count
    out = (
        final_df.sort_values("vote_count", ascending=False)
        .drop_duplicates("tmdbId")
        .sort_index()
    )

    out.to_csv("outdata/movieCineMatch.csv", index=False)
