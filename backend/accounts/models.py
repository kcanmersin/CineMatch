from collections.abc import Iterable
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

def person_to_person_rate(user_id_1, user_id_2):
    return 90.0

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        
        if extra_fields.get('is_active') is not True:
            raise ValueError('Superuser must have is_active=True.')
        
        return self.create_user(email, password, **extra_fields)

class UserAccount(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    sign_up_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    user_profile = models.ForeignKey('UserProfile', on_delete=models.CASCADE, related_name='user_account', null=True)

    blocked_users = models.ManyToManyField('self', blank=True, symmetrical=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        created = not self.pk
        super(UserAccount, self).save(*args, **kwargs)

        # Create a UserProfile if it's a new user and set it to the user_profile field
        if created:
            UserProfile.objects.create(user=self)

            from APImovie.models import MovieList
            MovieList.objects.create(title="watchlist", user=self)
            MovieList.objects.create(title="watched_movies", user=self)

    def get_username(self):
        return self.username
    
    def __str__(self):
        return self.email

class Follower(models.Model): 
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='user')
    is_followed_by = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='is_followed_by')

    def get_user_info(self):
        user_dict = vars(self.user)
        return {"id": user_dict["id"], "username": user_dict["username"]}

    def get_is_followed_by_info(self):
        user_dict = vars(self.is_followed_by)
        return {"id": user_dict["id"], "username": user_dict["username"]}
        
    def get_following(self, user):
        return Follower.objects.filter(is_followed_by=user)

    def get_followers(self, user):
        return Follower.objects.filter(user=user).exclude(is_followed_by=user)

    def get_following_count(self, user):
        return Follower.objects.filter(is_followed_by=user).count()

    def get_followers_count(self, user):
        return Follower.objects.filter(user=user).count()
    
    def __str__(self):
        return str(self.user) + " follows " + str(self.is_followed_by)
        #return str(self) #+ " follows " )#+ str(self.is_followed_by))


class UserProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, default='profile_pictures/default.png')

    def save(self, *args, **kwargs):
        created = not self.pk
        super(UserProfile, self).save(*args, **kwargs)

        if created:
            UserAccount.objects.filter(pk=self.user.pk).update(user_profile=self) 

    def get_user_info(self):
        user_dict = vars(self.user)
        return {"id": user_dict["id"], "username": user_dict["username"]}

    def get_following(self, user):
        return Follower.objects.filter(is_followed_by=user)

    def get_followers(self, user):
        return Follower.objects.filter(user=user).exclude(is_followed_by=user)

    def get_following_count(self, user):
        return Follower.objects.filter(is_followed_by=user).count()

    def get_followers_count(self, user):
        return Follower.objects.filter(user=user).count()
    
    def calculate_match_rate(self, other_user_profile):
        return person_to_person_rate(self.user.id, other_user_profile.user.id)

    def __str__(self):
        return str(self.user) + "'s profile"
