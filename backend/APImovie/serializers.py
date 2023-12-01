from rest_framework import serializers
from .models import Movie, MovieList, Vote, Genre


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):

    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = '__all__'

    def create(self, validated_data):
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
    def validate(self, data):
        return super().validate(data)

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
    number_of_movies = serializers.SerializerMethodField()


    class Meta:
        model = MovieList
        fields = ('id', 'title', 'user', 'is_public', 'movies', 'upvotes', 'downvotes', 'votes', 'total_time_of_movies', 'number_of_movies') # votes eklendi

    
    def get_number_of_movies(self, obj):
        return obj.movies.count()

    def get_upvotes(self, obj):
        return obj.get_upvotes()

    def get_downvotes(self, obj):
        return obj.get_downvotes()

    def create(self, validated_data):
        user = self.context['request'].user
        movies_data = validated_data.pop('movies', [])  # remove movies from validated_data
        validated_data.pop('user', None)  # remove user from validated_data
        movie_list = MovieList.objects.create(user=user, **validated_data)
        for movie_data in movies_data:
            movie = Movie.objects.create(**movie_data)
            movie_list.movies.add(movie)
        return movie_list
