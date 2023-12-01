from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from .models import Follower

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