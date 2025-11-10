from django.db import models
#Importing the custom user model
from django.conf import settings

class Budget(models.Model):
    #Linking budget to the custom user model
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="budgets")
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.PositiveSmallIntegerField()  #1-12
    year = models.PositiveSmallIntegerField()

    class Meta:
        #Unique constraint to prevent duplicate budgets for the same user, category, month, and year
        unique_together = ("user", "category", "month", "year")
        #Newest budgets first
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.user.email} - {self.category} - {self.month}/{self.year}"
