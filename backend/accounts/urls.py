from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('follow/', views.follow, name='follow'),
    path('following/<int:pk>/', views.Following.as_view(), name='following'),
    path('followers/<int:pk>/', views.Followers.as_view(), name='followers'),
    path('profile/<str:user__username>/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/<str:user__username>/stats/', views.UserProfileStatsView.as_view(), name='user-profile-stats'),
    path('profile_pictures/<path:filename>/', views.serve_profile_picture, name='profile-picture'),
    path('change-profile-photo/', views.ChangeProfilePhotoView.as_view(), name='change-profile-photo'),
    path('main-page/', views.MainPageView.as_view(), name='main-page'),

] #+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)