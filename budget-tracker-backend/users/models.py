from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # username field still exists, but we want email unique
    name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]  # keep username for compatibility

    def __str__(self):
        return self.email
