from django.urls import path
from .views import activate_user

urlpatterns = [
    path('activate/<str:uid>/<str:token>/', activate_user, name='activate_user'),
]