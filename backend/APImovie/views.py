from django.urls import reverse
from django.contrib.auth import get_user_model
from .forms import CommentForm
from rest_framework import viewsets, generics,status
from .models import Comment, Movie, MovieList
from django.views.generic import ListView, DetailView, CreateView
from .serializers import CommentSerializer, MovieSerializer, MovieListSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import render, get_object_or_404
from .models import Movie, Movie_Genre, Genre, Cast, Actor, Character, Crew, MovieCrew
from rest_framework.permissions import AllowAny

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
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class MovieListCreateView(generics.ListCreateAPIView):
    queryset = MovieList.objects.all()
    serializer_class = MovieListSerializer

class MovieListDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MovieList.objects.all()
    serializer_class = MovieListSerializer

class VoteView(viewsets.ViewSet):
    queryset = MovieList.objects.all()
    serializer_class = MovieListSerializer

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        movie_list = self.get_object()
        movie_list.upvotes += 1
        movie_list.save()
        return Response({'status': 'Upvoted'})

    @action(detail=True, methods=['get'])
    def get_upvotes(self, request, pk=None):
        movie_list = self.get_object()
        return Response({'upvotes': movie_list.upvotes})

    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        movie_list = self.get_object()
        movie_list.downvotes += 1
        movie_list.save()
        return Response({'status': 'Downvoted'})
    
    @action(detail=True, methods=['get'])
    def get_downvotes(self, request, pk=None):
        movie_list = self.get_object()
        return Response({'downvotes': movie_list.downvotes})
    
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
    

        
# class MovieCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer
#     permission_classes = [AllowAny] 
#     def get_object(self):
#         comment_id = self.kwargs.get('comment_id')
#         if comment.movie.id != movie_id:
#             raise serilizers.ValidationError({"Message":"This comment not related to the this movie"})
#         comment = get_object_or_404(Comment, id=comment_id)
#         return comment
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