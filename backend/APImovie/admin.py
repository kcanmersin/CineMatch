from django.contrib import admin
from import_export import resources, fields,widgets
from import_export.admin import ImportExportModelAdmin
from .models import Comment, Movie, MovieList, Genre, Movie_Genre ,Actor, Cast, Crew, MovieCrew,Rate



class MovieResource(resources.ModelResource):
    class Meta:
        model = Movie

class MovieAdmin(ImportExportModelAdmin):
    resource_class = MovieResource



class GenreResource(resources.ModelResource):
    class Meta:
        model = Genre
      

class GenreAdmin(ImportExportModelAdmin):
    resource_class = GenreResource

class RateResource(resources.ModelResource):
    class Meta:
        model = Rate
      

class RateAdmin(ImportExportModelAdmin):
    resource_class = RateResource

class ActorResource(resources.ModelResource):
    class Meta:
        model = Actor
# class CharacterResource(resources.ModelResource):
#     class Meta:
#         model = Character
    

# class CharacterAdmin(ImportExportModelAdmin):
#     resource_class = CharacterResource

class CastResource(resources.ModelResource):
    class Meta:
        model = Cast
class CrewResource(resources.ModelResource):
    class Meta:
        model = Crew

class CrewAdmin(ImportExportModelAdmin):
    resource_class = CrewResource

class CastAdmin(ImportExportModelAdmin):
    resource_class = CastResource
class ActorAdmin(ImportExportModelAdmin):
    resource_class = ActorResource
class Movie_GenreResource(resources.ModelResource):
    class Meta:
        model = Movie_Genre
        skip_unchanged = True
        report_skipped = False
        import_id_fields = ('movie_id', 'genre_id')

    movie_id = fields.Field(column_name='movie_id', attribute='movie_id')
    genre_id = fields.Field(column_name='genre_id', attribute='genre_id')

class Movie_GenreAdmin(ImportExportModelAdmin):
    resource_class = Movie_GenreResource

class MovieListAdmin(admin.ModelAdmin):  # Assuming MovieList does not need import/export
    pass
class MovieCrewResource(resources.ModelResource):
    class Meta:
        model = MovieCrew
        skip_unchanged = True
        report_skipped = False
        import_id_fields = ('movie_id', 'crew_id')

    movie_id = fields.Field(column_name='movie_id', attribute='movie_id')
    crew_id = fields.Field(column_name='crew_id', attribute='crew_id')

class MovieCrewAdmin(ImportExportModelAdmin):
    resource_class = MovieCrewResource





    
admin.site.register(Movie, MovieAdmin)
admin.site.register(MovieList, MovieListAdmin)  # Register MovieListAdmin instead of ImportExportModelAdmin
admin.site.register(Genre, GenreAdmin)
admin.site.register(Movie_Genre, Movie_GenreAdmin)
admin.site.register(Actor, ActorAdmin)
# admin.site.register(Character, CharacterAdmin)
admin.site.register(Cast, CastAdmin)
admin.site.register(Crew, CrewAdmin)
admin.site.register(MovieCrew, MovieCrewAdmin)
admin.site.register(Rate, RateAdmin)
admin.site.register(Comment)
