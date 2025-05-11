from django.contrib import admin
from .models import CustomUser,PasswordEntry

admin.site.register(CustomUser)
admin.site.register(PasswordEntry)

