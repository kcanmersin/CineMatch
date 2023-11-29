from django.contrib import admin
from .models import UserAccount, Follower
# Register your models here.

admin.site.register(UserAccount)
admin.site.register(Follower)
