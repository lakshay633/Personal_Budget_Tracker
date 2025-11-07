from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()


class UserTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("token_obtain_pair")

        self.user_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "StrongPass123",
            "password2": "StrongPass123",
        }

    def test_user_registration(self):
        """Test user can register successfully"""
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="test@example.com").exists())

    def test_user_login(self):
        """Test login returns JWT tokens"""
        # First register a user
        self.client.post(self.register_url, self.user_data, format="json")

        # Attempt login
        login_data = {
            "email": "test@example.com",
            "password": "StrongPass123",
        }
        response = self.client.post(self.login_url, login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
