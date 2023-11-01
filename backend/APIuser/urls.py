from django.urls import path
from .views import UserList, UserDetail, UserView

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('users/<int:pk>/dnm/', UserView.as_view(), name='user-update'),
]
