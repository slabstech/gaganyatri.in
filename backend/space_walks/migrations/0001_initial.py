# Generated by Django 5.1.1 on 2024-09-18 19:26

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
                ('astronaut', models.CharField(max_length=100)),
                ('date', models.DateField()),
                ('duration', models.DurationField()),
                ('description', models.TextField()),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
    ]