from django.forms import ValidationError
from rest_framework import serializers
from accounts.models import UserAccount,UserProfile
from .models import  MovieList, Genre, Comment, Vote,Actor, Cast, Crew,  Movie, Movie_Genre, MovieCrew,Rate
from django.urls import reverse

class MovieSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('title', 'poster_path', 'release_date')




class MovieSForYouSerializer(serializers.ModelSerializer):
        
    class Meta:
            model = Movie
            fields = '__all__'

  
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('profile_picture', )

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='user_profile', read_only=True)

    class Meta:
        model = UserAccount
        fields = ('id', 'username', 'profile')


class CrewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crew
        fields = '__all__'


class MovieCrewSerializer(serializers.ModelSerializer):
    crew = CrewSerializer()

    class Meta:
        model = MovieCrew
        fields = '__all__'
class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'

# class CharacterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Character
#         fields = '__all__'

class CastSerializer(serializers.ModelSerializer):
    actor_id = ActorSerializer()  # Assuming you have an ActorSerializer
    
    class Meta:
        model = Cast
        fields = '__all__'

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class MovieGenreSerializer(serializers.ModelSerializer):
    genre = GenreSerializer()

    class Meta:
        model = Movie_Genre
        fields = '__all__'
class RateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    movie = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Rate
        fields = '__all__'
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Assuming you have a UserSerializer defined

    # Include the rate information for the user who posted the comment
    user_rate = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'user', 'text', 'created_at', 'parent_comment', 'user_rate')

    def get_user_rate(self, obj):
        # Retrieve the rate for the user and movie associated with the comment
        user = obj.user
        movie = obj.movie
        try:
            rate = Rate.objects.get(user=user, movie=movie)
            return RateSerializer(rate).data
        except Rate.DoesNotExist:
            return None

    def create(self, validated_data):
        # Extract the rate data if provided
        rate_data = validated_data.pop('rate', None)

        # Create the comment
        comment = Comment.objects.create(**validated_data)

        # Create associated rate if rate data is provided
        if rate_data:
            Rate.objects.create(comment=comment, **rate_data)

        return comment











class MovieSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    genres = serializers.SerializerMethodField()
    cast = serializers.SerializerMethodField()
    crew = serializers.SerializerMethodField()  # Add this line for crew
    similar_movies = serializers.SerializerMethodField()
 
    rate_by_current_user = serializers.SerializerMethodField()
    class Meta:
        model = Movie
        fields = '__all__'

    def create(self, validated_data):
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
    def validate(self, data):
        return super().validate(data)
    def get_comments(self,obj):
        comments = Comment.objects.filter(movie=obj)[:1] # json olarak gönderilecek yorum sayısını belirtir
        request = self.context.get('request')
        return{
            "comments" : CommentSerializer(comments,many=True).data,
            "all_comment_link":request.build_absolute_uri(reverse('movie_comment_list',kwargs={'movie_id':obj.id}))
        }
    def get_rate_by_current_user(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, "user"):
            user = request.user
            if user.is_authenticated:
                try:
                    rate = Rate.objects.get(user=user, movie=obj)
                    return {
                        'rate_point': rate.rate_point,
                        'rate_id': rate.id
                    }
                except Rate.DoesNotExist:
                    return None
            else:
                # User is not authenticated, return None instead of raising an error
                return None
        return None
    def get_genres(self, obj):
        # Retrieve all genres associated with the movie
        movie_genres = Movie_Genre.objects.filter(movie=obj)
        genre_names = [movie_genre.genre.genre_name for movie_genre in movie_genres]
        return genre_names
    def get_cast(self, obj):
        # Retrieve all cast members associated with the movie
        movie_cast = Cast.objects.filter(movie_id=obj)
        return CastSerializer(movie_cast, many=True).data
    def get_crew(self, obj):
        # Retrieve all crew members associated with the movie
        movie_crew = MovieCrew.objects.filter(movie=obj)
        return MovieCrewSerializer(movie_crew, many=True).data
    
    def get_similar_movies(self, obj):
        similar_movie_ids, _ = obj.get_similar_movies()  # Assuming this returns a list of IDs
        
        # Query for movies with IDs in similar_movie_ids
        similar_movies = Movie.objects.filter(id__in=similar_movie_ids)
        
        formatted_similar_movies = []
        for movie in similar_movies:
            formatted_movie = {
                'movie_id': movie.id,
                'movie_title': movie.title,
                'movie_poster_url': movie.poster_path  
            }
            formatted_similar_movies.append(formatted_movie)

        return formatted_similar_movies


class MovieListAddSerializer(serializers.ModelSerializer):
    movie_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = MovieList
        fields = ('id', 'title', 'movie_id')
        read_only_fields = ('id', 'title')

    def validate(self, data):
        movie_id = data.get('movie_id')
        if not Movie.objects.filter(id=movie_id).exists():
            raise serializers.ValidationError("Movie does not exist.")
        return data

    def create(self, validated_data):
        movie_id = validated_data.pop('movie_id')
        movie = Movie.objects.get(id=movie_id)
        instance = super().create(validated_data)
        instance.movies.add(movie)
        return instance

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('user', 'movie_list', 'is_upvote')

    def create(self, validated_data):
        vote, created = Vote.objects.update_or_create(
            user=validated_data.get('user', None),
            movie_list=validated_data.get('movie_list', None),
            defaults={'is_upvote': validated_data.get('is_upvote', False)}
        )
        return vote

class MovieListSerializer(serializers.ModelSerializer):
    upvotes = serializers.IntegerField(source='votes.filter(is_upvote=True).count', read_only=True)
    downvotes = serializers.IntegerField(source='votes.filter(is_upvote=False).count', read_only=True) # Burayı kontrol et
    movies = MovieSerializer(many=True, read_only=True)
    votes = VoteSerializer(many=True, read_only=True)  # Include votes in the response
    total_time_of_movies = serializers.IntegerField(read_only=True)
    #movies = serializers.ListField(child=serializers.IntegerField(), write_only=True)


    class Meta:
        model = MovieList
        fields = ('id', 'title', 'user', 'is_public', 'movies', 'upvotes', 'downvotes', 'votes', 'total_time_of_movies') # votes eklendi

    
    def get_number_of_movies(self, obj):
        return obj.movies.count()

    def get_upvotes(self, obj):
        return obj.get_upvotes()

    def get_downvotes(self, obj):
        return obj.get_downvotes()

    def create(self, validated_data):
        user = self.context['request'].user
        movie_ids = validated_data.pop('movies', [])
        validated_data.pop('user', None)
        movie_list = MovieList.objects.create(user=user, **validated_data)
        for movie_id in movie_ids:
            try:
                movie = Movie.objects.get(id=movie_id)
                movie_list.movies.add(movie)
                movie_list.total_time_of_movies += movie.runtime
            except Movie.DoesNotExist:
                pass
        return movie_list

from rest_framework import serializers


class MovieListFilterSerializer(serializers.Serializer):
    list_id = serializers.IntegerField()
    start_date = serializers.IntegerField(allow_null=True)
    end_date = serializers.IntegerField(allow_null=True)
    genres = serializers.ListField(child=serializers.CharField(), allow_empty=True)
