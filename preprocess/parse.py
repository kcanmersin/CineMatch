import numpy as np
import pandas as pd
import ast

"""
This script is designed to process movie data from CSV files.
It includes functions to parse genres, keywords, characters, and crew information 
from a string representation and a main function to orchestrate the overall process.
"""


# Function to parse genres data
def parse_genres(genres_str):
    """
    Parses the genres data from a string representation.

    Parameters:
    genres_str (str): A string representation of genres data.

    Returns:
    list: A list of dictionaries with genre id and name.
    """
    try:
        genres_list = ast.literal_eval(genres_str)
    except Exception as e:
        print(f"Error evaluating {genres_str}: {e}")
        return []

    genre_data = []
    for genre_info in genres_list:
        genre_id = genre_info.get("id")
        genre_name = genre_info.get("name")
        genre_data.append({"id": genre_id, "name": genre_name})

    return genre_data


# Function to parse keywords data
def parse_keywords(keywords_str):
    """
    Parses the keywords data from a string representation.

    Parameters:
    keywords_str (str): A string representation of keywords data.

    Returns:
    list: A list of dictionaries with keyword id and name.
    """
    try:
        keyword_list = ast.literal_eval(keywords_str)
    except Exception as e:
        print(f"Error evaluating {keywords_str}: {e}")
        return []

    keyword_data = []
    for keyword_info in keyword_list:
        keyword_id = keyword_info.get("id")
        keyword_name = keyword_info.get("name")
        keyword_data.append({"id": keyword_id, "name": keyword_name})

    return keyword_data


# Function to parse characters data
def parse_characters(characters_str):
    """
    Parses the characters data from a string representation.

    Parameters:
    characters_str (str): A string representation of characters data.

    Returns:
    list: A list of dictionaries with character details.
    """
    try:
        characters_list = ast.literal_eval(characters_str)
    except (SyntaxError, ValueError) as e:
        print(f"Error evaluating {characters_str}: {e}")
        return []

    character_data = []
    for character_info in characters_list:
        character_data.append(
            {
                "id": character_info.get("id"),
                "cast_id": character_info.get("cast_id"),
                "character": character_info.get("character"),
                "credit_id": character_info.get("credit_id"),
                "order": character_info.get("order"),
                "profile_path": character_info.get("profile_path", "default_path"),
            }
        )

    return character_data


# Function to parse crew data
def parse_crew(crew_str):
    """
    Parses the crew data from a string representation.

    Parameters:
    crew_str (str): A string representation of crew data.

    Returns:
    list: A list of dictionaries with crew member details.
    """
    try:
        crew_list = ast.literal_eval(crew_str)
    except (SyntaxError, ValueError) as e:
        print(f"Error evaluating {crew_str}: {e}")
        return []

    crew_data = []
    for crew_info in crew_list:
        crew_data.append(
            {
                "id": crew_info.get("id"),
                "credit_id": crew_info.get("credit_id"),
                "department": crew_info.get("department"),
                "job": crew_info.get("job"),
                "name": crew_info.get("name"),
                "profile_path": crew_info.get("profile_path", "default_path"),
            }
        )

    return crew_data


# Main function to process movie data
def main():
    """
    Main function to process movie data from CSV files.
    """
    # Set file paths for input data
    movies_path = "input.csv"

    # Read and process Movies
    movies = pd.read_csv(movies_path, low_memory=False)

    # Extract and process genres data
    genres = movies["genres"].apply(parse_genres).explode().reset_index(drop=True)
    genres.to_csv("abc/genres_out.csv", index=False)

    # Extract and process keywords data
    keywords = movies["keywords"].apply(parse_keywords).explode().reset_index(drop=True)
    keywords.to_csv("abc/keyword.csv", index=False)

    # Extract and process characters data

    characters = movies["cast"].apply(parse_characters).explode().reset_index(drop=True)
    characters.to_csv("abc/cast.csv", index=False)

    # Extract and process crew data
    crew = movies["crew"].apply(parse_crew).explode().reset_index(drop=True)
    crew.to_csv("abc/crew.csv", index=False)


if __name__ == "__main__":
    main()
