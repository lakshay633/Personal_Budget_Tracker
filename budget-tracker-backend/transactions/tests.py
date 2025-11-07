from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from transactions.models import Transaction

User = get_user_model()


class TransactionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="john@example.com",
            name="John",
            email="john@example.com",
            password="Pass12345",
        )

        # Login to get JWT token
        login_url = reverse("token_obtain_pair")
        response = self.client.post(
            login_url,
            {"email": "john@example.com", "password": "Pass12345"},
            format="json",
        )
        self.access_token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        self.transaction_url = reverse("transactions")
        self.transaction_data = {
            "type": "expense",
            "category": "Food",
            "amount": 150,
            "date": "2025-11-03",
        }

    def test_create_transaction(self):
        response = self.client.post(self.transaction_url, self.transaction_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 1)

    def test_get_transactions(self):
        self.client.post(self.transaction_url, self.transaction_data, format="json")
        response = self.client.get(self.transaction_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_unauthorized_access(self):
        self.client.credentials()
        response = self.client.get(self.transaction_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
