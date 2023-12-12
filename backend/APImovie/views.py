from rest_framework import viewsets, generics
from .models import Movie, MovieList, Vote
from .serializers import MovieSerializer, MovieListSerializer, VoteSerializer, MovieListAddSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

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


from rest_framework import status
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