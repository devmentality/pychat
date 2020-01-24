# Generated by Django 3.0.2 on 2020-01-23 15:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_room'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='room',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.Room'),
            preserve_default=False,
        ),
    ]