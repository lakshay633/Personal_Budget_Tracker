from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User  # ✅ use your custom user model
from .models import Budget


class BudgetAPITestCase(APITestCase):
    def setUp(self):
        # ✅ include username since it's still required by AbstractUser manager
        self.user = User.objects.create_user(
            username="tester",
            email="test@example.com",
            password="pass1234"
        )
        self.client.force_authenticate(user=self.user)

        self.budget = Budget.objects.create(
            user=self.user,
            category="Food",
            amount=5000,
            month=11,
            year=2025
        )

        self.list_url = reverse("budgets")
        self.create_url = reverse("budget-create")
        self.detail_url = reverse("budget-detail", args=[self.budget.id])


    def test_list_budgets(self):
        """Ensure user can list only their budgets"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["category"], "Food")

    def test_create_budget(self):
        """Ensure user can create a new budget"""
        data = {
            "category": "Entertainment",
            "amount": 2000,
            "month": 10,
            "year": 2025
        }
        response = self.client.post(self.create_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Budget.objects.count(), 2)
        self.assertEqual(Budget.objects.last().category, "Entertainment")

    def test_update_budget(self):
        """Ensure user can update their own budget"""
        data = {"category": "Food", "amount": 6000, "month": 11, "year": 2025}
        response = self.client.put(self.detail_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.budget.refresh_from_db()
        self.assertEqual(float(self.budget.amount), 6000.0)

    def test_delete_budget(self):
        """Ensure user can delete their own budget"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Budget.objects.count(), 0)

    def test_unique_constraint(self):
        """Ensure duplicate (category, month, year) budgets are rejected"""
        data = {
            "category": "Food",
            "amount": 4000,
            "month": 11,
            "year": 2025
        }
        response = self.client.post(self.create_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authentication_required(self):
        """Ensure unauthenticated users cannot access endpoints"""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
