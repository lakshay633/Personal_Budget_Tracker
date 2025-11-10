from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    #Use email as the unique identifier instead of username
    name = models.CharField(max_length=150, blank=True)
    #Make email unique used for login authentication
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"] #Username is still required for Compatibility

    def __str__(self):
        return self.email
