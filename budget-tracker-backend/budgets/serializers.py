from rest_framework import serializers
from .models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ("id", "user", "category", "amount", "month", "year")
        read_only_fields = ("user",)

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user

        # uniqueness check
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
