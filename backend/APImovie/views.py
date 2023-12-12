from django.urls import reverse
from django.contrib.auth import get_user_model
from .forms import CommentForm
from rest_framework import viewsets, generics,status
from .models import Comment, Movie, MovieList, Vote
from django.views.generic import ListView, DetailView, CreateView
from .serializers import CommentSerializer, MovieSerializer, MovieListSerializer, VoteSerializer,RateSerializer, MovieListFilterSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import render, get_object_or_404
from .models import Movie, Movie_Genre, Genre, Cast, Actor, Character, Crew, MovieCrew,Rate
from rest_framework.permissions import AllowAny

from django.db.models import F
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

def movie_list(request):
    # Get all movies
    movieurl = 'http://127.0.0.1:8000/movie/movies/'

    movies = Movie.objects.all()
    render(request, 'movie_list.html')
    # Render the template with the list of movies
    return render(request, 'movie_list.html', {'movies': movies})

def movie_detail(request, movie_id):
    # Get the movie by its ID
    movie = get_object_or_404(Movie, id=movie_id)

    # Get genres associated with the movie
    genres = Genre.objects.filter(movie_genre__movie=movie)

    # Get cast and crew for the movie
    cast = Cast.objects.filter(movie_id=movie)
    actors = Actor.objects.filter(id__in=cast.values('actor_id'))
    characters = Character.objects.filter(id__in=cast.values('character_id'))

    crew = MovieCrew.objects.filter(movie=movie)
    crew_members = Crew.objects.filter(id__in=crew.values('crew_id'))

    # Combine actors and characters into a list of dictionaries
    actors_characters = [
        {'actor': actor, 'character': character}
        for actor, character in zip(actors, characters)
    ]

    # Get comments for the movie
    comments = Comment.objects.filter(movie=movie)

    # Render the template with the movie data and comments
    return render(
        request,
        'movie_detail.html',
        {
            'movie': movie,
            'genres': genres,
            'actors_characters': actors_characters,
            'crew_members': crew_members,
            'comments': comments,  # Pass comments to the template
        }
    )

class MovieViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
class MovieFilterListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    search_fields = ['$title']


class MovieListViewSet(viewsets.ModelViewSet):
    queryset = MovieList.objects.all()
    serializer_class = MovieListSerializer

from rest_framework.permissions import IsAuthenticated
class MovieListCreateView(generics.CreateAPIView):
    queryset = MovieList.objects.all()
    serializer_class = MovieListSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MovieListDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MovieList.objects.all()
    serializer_class = MovieListSerializer
class VoteView(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = VoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

from rest_framework.generics import ListAPIView
class GenreMovieListView(ListAPIView):
    serializer_class = MovieSerializer

    def get_queryset(self):
        genre_slug = self.kwargs['genre_slug']
        # Assuming you have a 'genres' field in your Movie model
        return Movie.objects.filter(genres__slug=genre_slug)
from rest_framework.views import APIView
class MovieListRetrieveAddView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        movie_lists = MovieList.objects.filter(user=request.user)
        serializer = MovieListSerializer(movie_lists, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        movie_list_id = request.data.get('movie_list_id')
        movie_id = request.data.get('movie_id')

        try:
            movie_list = MovieList.objects.get(id=movie_list_id, user=request.user)
            movie = Movie.objects.get(id=movie_id)
            movie_list.movies.add(movie)
            movie_list.total_time_of_movies += movie.runtime
            movie_list.save()
        except MovieList.DoesNotExist:
            return Response({"error": "Movie list does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        except Movie.DoesNotExist:
            return Response({"error": "Movie does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)    
class UsersMovieListView(generics.ListAPIView):
    serializer_class = MovieListSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return MovieList.objects.filter(user=user_id)
    

class MovieCommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        movie_id = self.kwargs.get('movie_id')
        return Comment.objects.filter(movie_id=movie_id)
    def perform_create(self, serializer):
        movie_id = self.kwargs.get('movie_id')
        movie = get_object_or_404(Movie, id=movie_id)
        
        # Use the authenticated user or create an anonymous user
        user = self.request.user if self.request.user.is_authenticated else get_user_model().objects.get_or_create(username='anonymous_user')[0]

        serializer.save(user=user, movie=movie)
    

        

class MovieCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        comment_id = self.kwargs.get('comment_id')
        movie_id = self.kwargs.get('movie_id')

        comment = get_object_or_404(Comment, id=comment_id, movie_id=movie_id)
        return comment
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'status': 'Comment deleted'}, status=status.HTTP_204_NO_CONTENT)

class MovieRateListCreateView(generics.ListCreateAPIView):
    queryset = Rate.objects.all()
    serializer_class = RateSerializer
    permission_classes = [AllowAny]  

    def get_queryset(self):
        movie_id = self.kwargs.get('movie_id')
        return Rate.objects.filter(movie_id=movie_id)

    def perform_create(self, serializer):
        movie_id = self.kwargs.get('movie_id')
        movie = get_object_or_404(Movie, id=movie_id)
        user = self.request.user if self.request.user.is_authenticated else get_user_model().objects.get_or_create(username='anonymous_user')[0]  
        # Save the rate
        serializer.save(user=user, movie=movie)

        movie.vote_count = F('vote_count') + 1
        movie.vote_average = (F('vote_average') * F('vote_count') + serializer.validated_data['rate_point']) / F('vote_count')
        movie.save()
    
class MovieRateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rate.objects.all()
    serializer_class = RateSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        rate_id = self.kwargs.get('rate_id')
        movie_id = self.kwargs.get('movie_id')

        rate = get_object_or_404(Rate, id=rate_id, movie_id=movie_id)
        return rate
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        movie = instance.movie
        movie.vote_count = F('vote_count') - 1
        if movie.vote_count > 0:
            movie.vote_average = (F('vote_average') * F('vote_count') - instance.rate_point) / F('vote_count')
        else:
            movie.vote_average = 0  # Or any default value if vote_count becomes 0
        movie.save()

        self.perform_destroy(instance)

        return Response({'status': 'Rate deleted'}, status=status.HTTP_204_NO_CONTENT)
    def perform_update(self, serializer):
        movie_id = self.kwargs.get('movie_id')
        user = self.request.user if self.request.user.is_authenticated else get_user_model().objects.get_or_create(username='anonymous_user')[0]
        current_rate = get_object_or_404(Rate, user=user, movie_id=movie_id)

        # Update the rate
        serializer.save(user=user, movie=current_rate.movie)

        # Update movie vote count and average
        current_movie = current_rate.movie
        current_movie.vote_average = (F('vote_average') * F('vote_count') - current_rate.rate_point + serializer.validated_data['rate_point']) / F('vote_count')
        current_movie.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, Movie_Genre

class MovieListFilterView(APIView):
    def post(self, request, list_id, *args, **kwargs):
        try:
            movie_list = Movie.objects.get(id=list_id)

            start_date = request.data.get('start_date')
            end_date = request.data.get('end_date')
            genres = request.data.get('genres')

            # Your existing logic for filtering movies based on start_date, end_date, etc.
            movies = Movie.objects.filter(release_date__gte=start_date, release_date__lte=end_date)

            #print ("movies: " , movies)
            #print ("genres: " , genres)
            # Filter movies based on genres using Movie_Genre model
            if genres:
                genre_ids = Movie_Genre.objects.filter(genre__genre_name__in=genres).values_list('movie_id', flat=True)
                #print ("genre_ids: " , genre_ids)
                movies = movies.filter(id__in=genre_ids)
                #print ("movies: " , movies)

            # Manually construct the response data
            response_data = []
            for movie in movies:
                movie_data = {
                    'id': movie.id,
                    'imdb_id': movie.imdb_id,
                    'title': movie.title,
                    'poster_path': movie.poster_path,
                    'background_path': movie.background_path,
                    'original_language': movie.original_language,
                    'original_title': movie.original_title,
                    'overview': movie.overview,
                    'release_date': movie.release_date,
                    'runtime': movie.runtime,
                    'vote_average': movie.vote_average,
                    'vote_count': movie.vote_count,
                    'popularity': movie.popularity,
                }
                response_data.append(movie_data)

            return Response(response_data, status=status.HTTP_200_OK)

        except Movie.DoesNotExist:
            return Response({'detail': 'Movie list not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
