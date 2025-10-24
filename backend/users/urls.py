from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('verify-email/', views.VerifyEmailView.as_view(), name='verify-email'),
    path('token/refresh/', views.refresh_token_view, name='token-refresh'),
    
    path('health/', views.my_view, name='Health Check'),
]