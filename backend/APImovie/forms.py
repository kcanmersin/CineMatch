from django import forms
from .models import Movie, Comment

class MovieForm(forms.ModelForm):
    class Meta:
        model = Movie
        fields = '__all__'  # You can customize this based on your needs

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text', 'parent_comment']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # You can customize the form widgets or add additional fields if needed
        self.fields['parent_comment'].widget = forms.HiddenInput()
