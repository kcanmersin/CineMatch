from django.urls import path
from .views import activate_user, reset_password_confirm

urlpatterns = [
    path('activate/<str:uid>/<str:token>/', activate_user, name='activate_user'),
    path('password/reset/confirm/<str:uid>/<str:token>/', reset_password_confirm, name='reset_password_confirm'),
]