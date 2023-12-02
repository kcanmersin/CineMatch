from django.db import models
from accounts.models import UserAccount
from django.urls import reverse
from django.utils.text import slugify

class MovieList(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, default='Untitled')
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='lists', null=True, blank=True)
    is_public = models.BooleanField(default=True, null=True)
    movies = models.ManyToManyField('Movie', related_name='lists', blank=True)
    upvotes = models.PositiveIntegerField(default=0, null=True, blank=True)
    downvotes = models.PositiveIntegerField(default=0, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    total_time_of_movies = models.PositiveIntegerField(default=0, null=True, blank=True)

    class Meta:
        ordering = ['-upvotes']  # Optional: Order lists by upvotes in descending order

    def get_upvotes(self):
        return self.votes.filter(is_upvote=True).count()
    
    def get_downvotes(self):
        return self.votes.filter(is_upvote=False).count()
    
    def __str__(self):
        return self.title

class Vote(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    movie_list = models.ForeignKey(MovieList, on_delete=models.CASCADE, related_name='votes')
    is_upvote = models.BooleanField()

    class Meta:
        unique_together = ('user', 'movie_list')


class Collection(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    poster_path = models.CharField(max_length=255)
    backdrop_path = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

class Genre(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(null=True, unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.title.replace(" ", "")
            self.slug = slugify(self.title)
        return super().save(*args, **kwargs)

    def get_absolute_url(self):
	    return reverse('genres', args=[self.slug])


class ProductionCompany(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class ProductionCountry(models.Model):
    iso_3166_1 = models.CharField(max_length=2, primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Language(models.Model):
    iso_639_1 = models.CharField(max_length=2, primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Movie(models.Model):
    adult = models.BooleanField(default=False)
    belongs_to_collection = models.ForeignKey(Collection, on_delete=models.CASCADE, null=True, blank=True)
    budget = models.IntegerField(default=0, null=True)  # Nullable budget field
    genres = models.ManyToManyField(Genre)
    homepage = models.URLField(null=True, blank=True)
    id = models.IntegerField(primary_key=True)
    imdb_id = models.CharField(max_length=255, default='', null=True, blank=True)  # Nullable IMDb ID field
    original_language = models.CharField(max_length=2,null= True)
    original_title = models.CharField(max_length=255,null= True)
    overview = models.TextField(null= True)
    popularity = models.FloatField(default=0.0, null=True)  # Nullable popularity field
    poster_path = models.CharField(max_length=255,null= True)
    production_companies = models.ManyToManyField(ProductionCompany)
    production_countries = models.ManyToManyField(ProductionCountry)
    release_date = models.DateField(null=True)  # Nullable release_date field
    revenue = models.FloatField(default=0.0, null=True)  # Nullable revenue field
    runtime = models.FloatField(default=0.0, null=True)  # Nullable runtime field
    spoken_languages = models.ManyToManyField(Language)
    status = models.CharField(max_length=255, null=True, blank=True)  # Nullable status field
    tagline = models.TextField(null=True, blank=True)
    title = models.CharField(max_length=255)
    video = models.BooleanField(default=False, null=True)  # Nullable video field
    vote_average = models.FloatField(default=0.0, null=True)  # Nullable vote_average field
    vote_count = models.IntegerField(default=0, null=True)  # Nullable vote_count field

    def __str__(self):
        return self.title
class Rate(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='rates')
    movie = models.ForeignKey('Movie', on_delete=models.CASCADE, null=True, blank=True)
    rate_point = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} rates {self.movie.title} with {self.rate_point} points"

