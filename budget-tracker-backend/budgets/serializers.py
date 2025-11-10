from rest_framework import serializers
from .models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ("id", "user", "category", "amount", "month", "year")
        #Cannot manually set user
        read_only_fields = ("user",)

    def create(self, validated_data):
        #Set the user from the request context
        user = self.context["request"].user
        #Adding the user to the validated data
        validated_data["user"] = user

        #Check for existing budget for the same user, category, month, and year
        if Budget.objects.filter(
            user=user,
            category=validated_data.get("category"),
            month=validated_data.get("month"),
            year=validated_data.get("year"),
        ).exists():
            raise serializers.ValidationError(
                {"detail": "Budget for this category and month already exists."}
            )

        return super().create(validated_data)
