# Generated by Django 4.2.4 on 2023-11-24 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('APImovie', '0003_movielist'),
    ]

    operations = [
        migrations.AddField(
            model_name='genre',
            name='slug',
            field=models.SlugField(null=True, unique=True),
        ),
    ]
