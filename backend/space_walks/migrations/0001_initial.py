# Generated by Django 5.1.1 on 2024-09-15 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SpaceWalks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('column1', models.CharField(max_length=100)),
                ('column2', models.IntegerField()),
                ('column3', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
