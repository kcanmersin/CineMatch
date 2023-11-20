from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Movie, MovieList, Collection, Genre, ProductionCompany, ProductionCountry, Language

class MovieResource(resources.ModelResource):
    class Meta:
        model = Movie

class MovieAdmin(ImportExportModelAdmin):
    resource_class = MovieResource

admin.site.register(Movie, MovieAdmin)
admin.site.register(MovieList)
admin.site.register(Collection)
admin.site.register(Genre)
admin.site.register(ProductionCompany)
admin.site.register(ProductionCountry)
admin.site.register(Language)
