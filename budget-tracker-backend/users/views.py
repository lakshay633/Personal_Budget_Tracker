from rest_framework import generics, permissions
#Importing the RegisterSerializer
from .serializers import RegisterSerializer

#View for registering a new user
class RegisterView(generics.CreateAPIView):
    #Using the RegisterSerializer
    serializer_class = RegisterSerializer
    #Allowing any user to register
    permission_classes = [permissions.AllowAny]
