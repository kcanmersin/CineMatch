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
from .views import MovieFilterListCreateView, MovieListFilterView, MovieRateListCreateView,MovieRateDetailView, MovieViewSet, VoteView, MovieListCreateView, MovieListDetailView, MovieListViewSet, MovieListRetrieveAddView, GenreMovieListView, UsersMovieListView, MovieCommentListCreateView, MovieCommentDetailView
from django.urls import path, include

movie_router = DefaultRouter()
movie_router.register(r'movies', MovieViewSet)

vote_router = DefaultRouter()
vote_router.register(r'votes', VoteView, basename='vote')

urlpatterns = [
    path('movie/', include(movie_router.urls)),
    path('lists/', MovieListViewSet.as_view({'get': 'list'}), name='movie-list-list'),
    path('lists/<int:pk>/', MovieListDetailView.as_view(), name='movie-list-detail'),
    path('lists/create/', MovieListCreateView.as_view(), name='movie-list-create'),
    path('<int:user_id>/lists/', UsersMovieListView.as_view(), name='users-movie-list'),
    path('comment_list/<int:movie_id>/', MovieCommentListCreateView.as_view(), name='movie_comment_list'),
    path('comment_detail/movie/<int:movie_id>/comment/<int:comment_id>/', MovieCommentDetailView.as_view(), name='movie_comment_detail'),
    path('votes/', VoteView.as_view({'post': 'create'}), name='vote-create'),
    path('movie-lists/', MovieListRetrieveAddView.as_view(), name='movie-list-retrieve-add'),
    path('genres/<slug:genre_slug>/', GenreMovieListView.as_view(), name='genre-movie-list'),

    path('rate_list/<int:movie_id>/rates/', MovieRateListCreateView.as_view(), name='movie_rate_list_create'),
    path('rate_list/<int:movie_id>/rates/<int:rate_id>/', MovieRateDetailView.as_view(), name='movie_rate_list_detail'),
    path('movie/movie_filter/', MovieFilterListCreateView.as_view(), name="movie-filter-list"),
    path('movie-lists/<int:list_id>/filter/', MovieListFilterView.as_view(), name='movie-list-filter'),


]
