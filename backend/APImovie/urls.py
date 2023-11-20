# from rest_framework.routers import DefaultRouter
# from .views import MovieViewSet, VoteView, MovieListCreateView, MovieListDetailView
# from django.urls import path, include

# router = DefaultRouter()
# router.register(r'movies', MovieViewSet)

# urlpatterns = [
#     path('movie/', include(router.urls)),
#     path('lists/', MovieListCreateView.as_view(), name='movie-list-create'),
#     path('lists/<int:pk>/', MovieListDetailView.as_view(), name='movie-list-detail'),
#     path('lists/<int:pk>/upvote/', VoteView.as_view({'post': 'upvote'}), name='upvote'),
#     path('lists/<int:pk>/downvote/', VoteView.as_view({'post': 'downvote'}), name='downvote'),
    
# ]

from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, VoteView, MovieListCreateView, MovieListDetailView
from django.urls import path, include

movie_router = DefaultRouter()
movie_router.register(r'movies', MovieViewSet)

vote_router = DefaultRouter()
vote_router.register(r'votes', VoteView, basename='vote')

urlpatterns = [
    path('movie/', include(movie_router.urls)),
    path('lists/', MovieListCreateView.as_view(), name='movie-list-create'),
    path('lists/<int:pk>/', MovieListDetailView.as_view(), name='movie-list-detail'),
    path('votes/', include(vote_router.urls)),
]
