from rest_framework import viewsets, generics
from .models import Movie, MovieList, Vote
from .serializers import MovieSerializer, MovieListSerializer, VoteSerializer
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