from django.contrib import admin
from .models import Movie, Genre, Keyword, MovieKeyword,Credit
from import_export import resources
from import_export.admin import ImportExportModelAdmin
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

class KeywordResource(resources.ModelResource):
    class Meta:
        model = Keyword

class KeywordAdmin(ImportExportModelAdmin):
    resource_class = KeywordResource

class CreditResource(resources.ModelResource):
    class Meta:
        model = Credit

class CreditAdmin(ImportExportModelAdmin):
    resource_class = CreditResource



admin.site.register(Movie, MovieAdmin)
admin.site.register(Genre, GenreAdmin)
admin.site.register(Keyword, KeywordAdmin)
admin.site.register(Credit, CreditAdmin)