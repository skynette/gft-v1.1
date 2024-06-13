# Generated by Django 4.2.9 on 2024-06-13 12:40

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_user_provider'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='mobile',
            field=phonenumber_field.modelfields.PhoneNumberField(default='+234980000000', max_length=20, region=None, verbose_name='Phone number'),
        ),
    ]
