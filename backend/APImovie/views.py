from rest_framework import viewsets, generics
from .models import Movie, MovieList
from .serializers import MovieSerializer, MovieListSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

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