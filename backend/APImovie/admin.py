from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Movie

class MovieResource(resources.ModelResource):
    class Meta:
        model = Movie

class MovieAdmin(ImportExportModelAdmin):
    resource_class = MovieResource

admin.site.register(Movie, MovieAdmin)