from django.contrib import admin
from .models import UserAccount, Follower, UserProfile
# Register your models here.

admin.site.register(UserAccount)
admin.site.register(Follower)
#admin.site.register(UserProfile)

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'profile_picture', )

admin.site.register(UserProfile, UserProfileAdmin)