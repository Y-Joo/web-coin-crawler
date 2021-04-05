# Generated by Django 2.0.13 on 2021-03-16 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BoardData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('detail', models.CharField(max_length=10000)),
                ('coin_name', models.CharField(max_length=30)),
                ('added_date', models.DateField()),
                ('gn_date', models.DateField()),
            ],
        ),
    ]
