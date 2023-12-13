from django.contrib.auth.decorators import login_required

from django.shortcuts import redirect, get_object_or_404
from django.http import JsonResponse

from .models import UserAccount as User, Follower
from .serializers import FollowerSerializer
from rest_framework import generics, mixins, permissions
from django.views.decorators.csrf import csrf_exempt

# @csrf_exempt
# #@login_required
# def follow(request, pk):
#     user_to_follow = get_object_or_404(User, pk=pk)

#     # Check if the user is trying to follow itself
#     if user_to_follow == request.user:
#         return JsonResponse({'error': 'Cannot follow yourself'}, status=400)

#     # Check if the user is already being followed
#     already_followed = Follower.objects.filter(user=user_to_follow, is_followed_by=request.user).first()
#     if already_followed:
#         already_followed.delete()
#         follower_count = Follower.objects.filter(user=user_to_follow).count()
#         return JsonResponse({'status': 'Not following', 'count': follower_count})

#     # Create a new follower
#     new_follower = Follower(user=user_to_follow, is_followed_by=request.user)
#     new_follower.save()
#     follower_count = Follower.objects.filter(user=user_to_follow).count()
#     return JsonResponse({'status': 'Following', 'count': follower_count})

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request):
    follower_id = request.data.get('follower_id')
    following_id = request.data.get('following_id')

    if follower_id == following_id:
        return Response({'error': 'Cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)

    if not follower_id or not following_id:
        return Response({'error': 'follower_id and following_id are required'}, status=status.HTTP_400_BAD_REQUEST)

    follower = get_object_or_404(User, id=follower_id)
    following = get_object_or_404(User, id=following_id)

    print (follower)
    print (following)

    if Follower.objects.filter(user=follower, is_followed_by=following).exists():
        # If the relationship already exists, delete it
        Follower.objects.filter(user=follower, is_followed_by=following).delete()
        return Response({'status': 'Not following'}, status=status.HTTP_200_OK)
    else:
        # If the relationship does not exist, create it
        Follower.objects.create(user=follower, is_followed_by=following)
        return Response({'status': 'Following'}, status=status.HTTP_201_CREATED)



class Following(generics.ListCreateAPIView):
    serializer_class = FollowerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = get_object_or_404(User, pk = self.kwargs["pk"])
        return Follower.objects.filter(is_followed_by = user)

class Followers(generics.ListCreateAPIView):
    queryset = Follower.objects.all()
    serializer_class = FollowerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = get_object_or_404(User, pk = self.kwargs["pk"])
        return Follower.objects.filter(user = user)        
        #return Follower.objects.filter(user = user).exclude(is_followed_by = user)


from .serializers import UserProfileSerializer
from .models import UserProfile

class UserProfileView(generics.RetrieveAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'user__username'

from django.http import FileResponse
from django.conf import settings

def serve_profile_picture(request, filename):
    user_profile = get_object_or_404(UserProfile, user__username=filename.split('/')[0])
    return FileResponse(open('profile_pictures/' + str(user_profile.profile_picture), 'rb'))
#    return FileResponse(open(settings.MEDIA_ROOT + '/' + str(user_profile.profile_picture), 'rb'))


import datetime
from rest_framework.views import APIView
from APImovie.models import  MovieList, Rate
from rest_framework.response import Response
from django.db.models import Avg

class UserProfileStatsView(APIView):
    def get(self, request, user__username, *args, **kwargs):
        user_profile = get_object_or_404(UserProfile, user__username=user__username)

        profile_photo_url = request.build_absolute_uri(user_profile.profile_picture.url) if user_profile.profile_picture else None

        movie_list = MovieList.objects.filter(user=user_profile.user, title="watched_movies").first()
        if movie_list:
            watched_movie_count = movie_list.movies.count()
        else:
            watched_movie_count = 0

        # Follower number and following number
        follower_count = user_profile.get_followers_count(user_profile.user)
        following_count = user_profile.get_following_count(user_profile.user)

        # Signed up since and last login
        signed_up_since = user_profile.user.sign_up_date
        last_login = user_profile.user.last_login

        # Total hours of movies watched and average time per movie
        total_hours_watched = sum([movie.runtime for movie in movie_list.movies.all()]) / 60.0
        average_time_per_movie = total_hours_watched / watched_movie_count if watched_movie_count > 0 else 0

        # Favourite genre, average rating to films, all movie ratings
        #favourite_genre = ""  # Implement logic to find the favourite genre
        all_movie_ratings = Rate.objects.filter(user=user_profile.user).values('movie__title', 'rate_point', 'movie__release_date')
        average_rating = Rate.objects.filter(user=user_profile.user).aggregate(Avg('rate_point'))['rate_point__avg'] if all_movie_ratings.count() > 0 else 0
        # Genre breakdown graph and movies per year graph
        # Implement logic for genre breakdown graph
        #genre_breakdown = 
        #movies_per_year =  # Implement logic for movies per year graph

        # Prepare the response data
        response_data = {
            "username": user_profile.user.username,
            "profile_photo_url": profile_photo_url,  # Default profile picture
            "watched_movie_count": watched_movie_count,
            "follower_count": follower_count,
            "following_count": following_count,
            "signed_up_since": signed_up_since,
            "last_login": last_login,
            "total_hours_watched": total_hours_watched,
            "average_time_per_movie": average_time_per_movie,
            # "favourite_genre": favourite_genre,
            "average_rating": average_rating,
            "all_movie_ratings": all_movie_ratings,
            # "genre_breakdown": genre_breakdown,
            # "movies_per_year": movies_per_year,
        }

        return Response(response_data)