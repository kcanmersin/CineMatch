# CineMatch 

![Example Image](/images/login.png "This is an example image")


CineMatch is a dynamic movie recommendation platform tailored for movie enthusiasts seeking to explore new films, engage with a community of like-minded individuals, and enjoy a personalized movie-watching experience. Our platform not only simplifies the discovery of movies but also fosters community engagement through user interactions, comments, and filmbuddy matchmaking.

## Key Features

- **User Authentication**: Secure login and registration system to manage your profile.
- **Movie Discovery**: Extensive search functionalities to explore a vast database of films.
- **Personalized Recommendations**: Custom movie suggestions tailored to your individual preferences.
- **Community Engagement**: Connect with other users, share your thoughts on movies, and follow users with similar tastes.
- **List Management**: Craft and curate custom movie lists to track your watched films and plan your watchlist.
- **Filmbuddy Matchmaking**: Discover and connect with users who share your movie preferences.
- **User Profiles**: Access detailed movie-watching statistics and customize your user profile.

### Movie Recommendations for Everyone

Our approach uses hybrid models to deliver unique movie recommendations:

- **Collaborative Filtering**: Using the SVD algorithm, we predict how much you will enjoy unseen movies based on your rating history and that of others with similar tastes.
- **Content-Based Filtering**: For users new to the platform or those without sufficient rating history, we recommend popular movies based on content similarity and vote averages.
- **Hybrid Recommendations**: By blending collaborative and content-based suggestions, we ensure a richly personalized selection of movie recommendations.
- **Random Popular Movies**: As a fallback, new users without any ratings are presented with random popular movies, guaranteeing quality suggestions for everyone.

### Filmbuddy Matchmaking (User to User Matching)

- **Cosine Similarity**: We employ cosine similarity to identify users with similar movie rating profiles, enabling us to recommend movies based on user similarities.
- **Dynamic Updates**: Our system integrates with a PostgreSQL database for real-time data retrieval, ensuring that recommendations are always current and relevant.
- **Personalized Matching**: By identifying top-N similar users, we offer personalized movie suggestions, enhancing the user experience through tailored recommendations.
 
### Main Page 

![Example Image2](/images/mainpage.png "main page")


### Movie to Movie Recommendations (Content-Based Filtering with BERT)

- **Semantic Analysis**: Utilizing a precomputed cosine similarity matrix with BERT natural language processing model, our system identifies movies with closely related genres, overview, director etc... offering recommendations that truly resonate with your preferences.

### Movie Page 

![Example Image3](/images/moviepage.png "movie page")
