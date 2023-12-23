from django.contrib.auth.decorators import login_required

from django.shortcuts import redirect, get_object_or_404
from django.http import JsonResponse

from .models import UserAccount as User, Follower
from .serializers import FollowerSerializer, ChangeProfilePhotoSerializer
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

    #print (follower)
    #print (following)

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

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'user__username'
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Handle GET request for retrieving the user profile
        return super(UserProfileView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # Handle PUT request for updating the user profile
        serializer = UserProfileSerializer(instance=request.user.profile.first(), data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.http import FileResponse
from django.conf import settings

def serve_profile_picture(request, filename):
    user_profile = get_object_or_404(UserProfile, user__username=filename.split('/')[0])
    #return FileResponse(open('profile_pictures/' + str(user_profile.profile_picture), 'rb'))
    return FileResponse(open(settings.MEDIA_ROOT + '/' + str(user_profile.profile_picture), 'rb'))


import datetime
from rest_framework.views import APIView
from APImovie.models import  MovieList, Rate, Movie_Genre, Movie
from rest_framework.response import Response
from django.db.models import Avg, Count

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

        all_movie_ratings = Rate.objects.filter(user=user_profile.user).values('movie__title', 'rate_point', 'movie__release_date')
        average_rating = Rate.objects.filter(user=user_profile.user).aggregate(Avg('rate_point'))['rate_point__avg'] if all_movie_ratings.count() > 0 else 0
        
                # Calculate favourite genre
        favorite_genre = Movie_Genre.objects.filter(movie__in=movie_list.movies.all()) \
            .values('genre__genre_name') \
            .annotate(genre_count=Count('genre__genre_name')) \
            .order_by('-genre_count') \
            .first()

        # Calculate movies per year
        movies_per_year = movie_list.movies.values('release_date') \
            .annotate(movie_count=Count('id')) \
            .order_by('release_date')

        # Calculate genre breakdown
        genre_breakdown = Movie_Genre.objects.filter(movie__in=movie_list.movies.all()) \
            .values('genre__genre_name') \
            .annotate(genre_count=Count('genre__genre_name'))

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
            "average_rating": average_rating,
            "favorite_genre": favorite_genre,
            "all_movie_ratings": all_movie_ratings,
            "genre_breakdown": genre_breakdown,
            "movies_per_year": movies_per_year,
        }

        return Response(response_data)
    


class ChangeProfilePhotoView(APIView):
    serializer_class = ChangeProfilePhotoSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        #print("PATCH method is called!")
        serializer = ChangeProfilePhotoSerializer(instance=request.user.profile.first(), data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def options(self, request, *args, **kwargs):
        #print("OPTIONS method is called!")
        response = super().options(request, *args, **kwargs)
        return response
class MainPageView(APIView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user_profile = get_object_or_404(UserProfile, user=request.user)
            best_matched_people_ids = user_profile.user.get_best_matched_users()

            best_matched_people = []
            for user_id in best_matched_people_ids:
                other_user_profile = get_object_or_404(UserProfile, user__id=user_id)

                # Calculate rate ratio (replace this with your actual calculation)
                rate_ratio = user_profile.calculate_match_rate(other_user_profile)

                # Append user information to the list
                best_matched_people.append({
                    'username': other_user_profile.user.username,
                    'profile_picture': request.build_absolute_uri(other_user_profile.profile_picture.url) if other_user_profile.profile_picture else None,
                    'rate_ratio': rate_ratio,
                })

            # Include best matched people information in the response data
            response_data = {
                'best_matched_people': best_matched_people,
            }

            return Response(response_data)
        else:
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class MatchedPeopleView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            user_profile = get_object_or_404(UserProfile, user=request.user)
            best_matched_people_ids = user_profile.user.get_best_matched_users()

            best_matched_people = []
            for user_id in best_matched_people_ids:
                other_user_profile = get_object_or_404(UserProfile, user__id=user_id)

                rate_ratio = user_profile.calculate_match_rate(other_user_profile)

                movie_count = other_user_profile.get_watched_movie_count()

                follower_count = other_user_profile.get_followers_count(other_user_profile.user)
                following_count = other_user_profile.get_following_count(other_user_profile.user)

                best_matched_people.append({
                    'username': other_user_profile.user.username,
                    'profile_picture': request.build_absolute_uri(other_user_profile.profile_picture.url) if other_user_profile.profile_picture else None,
                    'rate_ratio': rate_ratio,
                    'movie_count':movie_count,
                    'follower_count':follower_count,
                    'following_count':following_count,
                })

            # sort best matched people by rate ratio
            best_matched_people.sort(key=lambda x: x['rate_ratio'], reverse=True)

            response_data = {
                'best_matched_people': best_matched_people,
            }

            return Response(response_data)
        else:
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            
    