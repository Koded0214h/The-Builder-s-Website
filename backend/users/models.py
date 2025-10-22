from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=500, blank=True)
    company = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    # Email verification
    email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    subscription_tier = models.CharField(
        max_length=20,
        choices=[
            ('free', 'Free'),
            ('pro', 'Professional'),
            ('enterprise', 'Enterprise'),
        ],
        default='free'
    )
    projects_limit = models.IntegerField(default=5)
    models_per_project_limit = models.IntegerField(default=10)
    api_calls_today = models.IntegerField(default=0)
    last_api_call = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'users_userprofile'

    def __str__(self):
        return f"{self.user.username} Profile"