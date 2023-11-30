from rest_framework import serializers
from .models import Movie, MovieList, Vote

class MovieSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movie
        fields = '__all__'

    def create(self, validated_data):
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
    def validate(self, data):
        return super().validate(data)
    
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

    class Meta:
        model = MovieList
        fields = ('id', 'title', 'user', 'is_public', 'movies', 'upvotes', 'downvotes', 'votes') # votes eklendi

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

