from rest_framework import serializers
#Taking advantage of Django's built-in user model
from django.contrib.auth import get_user_model
#Password validation by Django
from django.contrib.auth.password_validation import validate_password

#Custom User model
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    #Password validation
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

#Serializer for registering a new user
    class Meta:
        model = User
        fields = ("id", "name", "email", "password", "password2")
        #Password should not be readable
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        #Remove password2 from the validated data
        validated_data.pop("password2")
        #Extract password to set it properly
        password = validated_data.pop("password")
        #Set username equal to email for SimpleJWT compatibility
        user = User(username=validated_data.get("email"), **validated_data)
        user.set_password(password)
        #Save the user
        user.save()
        return user


#Serializer for User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "email")
