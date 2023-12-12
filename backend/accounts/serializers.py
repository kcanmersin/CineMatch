from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from .models import Follower, UserProfile

class FollowerSerializer(serializers.ModelSerializer):
    user = serializers.DictField(child=serializers.CharField(), source='get_user_info', read_only=True)
    is_followed_by = serializers.DictField(child=serializers.CharField(), source='get_is_followed_by_info', read_only=True)

    class Meta:
        model = Follower
        fields = ('user', 'is_followed_by')
        read_only_fields = ('user', 'is_followed_by')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('user') and data.get('is_followed_by'):
            return data
        return None


class UserProfileSerializer(serializers.ModelSerializer):

    match_rate = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()


    class Meta:
        model = UserProfile
        fields = '__all__'

    def get_match_rate(self, obj):
        current_user_profile = self.context['request'].user.profile.first()  # Get the first profile
        if current_user_profile:
            return current_user_profile.calculate_match_rate(obj)
    
    def get_follower_count(self, obj):
        current_user_profile = self.context['request'].user.profile.first()  # Get the first profile
        if current_user_profile:
            return current_user_profile.get_followers_count(obj.user)
        return 0
    
    def get_following_count(self, obj):
        current_user_profile = self.context['request'].user.profile.first()
        if current_user_profile:
            return current_user_profile.get_following_count(obj.user)
        return 0
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return self.context['request'].build_absolute_uri(obj.profile_picture.url)
        return None
    
    
    