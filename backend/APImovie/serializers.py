from rest_framework import serializers
from .models import Movie, MovieList

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
    
class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieList
        fields = '__all__'
    
