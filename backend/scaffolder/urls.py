from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')

# Nested routers for project-related objects
project_router = DefaultRouter()
project_router.register(r'models', views.DatabaseModelViewSet, basename='model')
project_router.register(r'relationships', views.RelationshipViewSet, basename='relationship')

# Nested router for model fields
model_router = DefaultRouter()
model_router.register(r'fields', views.ModelFieldViewSet, basename='field')

urlpatterns = [
    # Remove the 'api/' prefix since it's already in the main urls.py
    path('', include(router.urls)),  # ← CHANGED: Empty path
    path('projects/<uuid:project_pk>/', include(project_router.urls)),
    path('projects/<uuid:project_pk>/models/<uuid:model_pk>/', include(model_router.urls)),
    path('projects/<uuid:project_pk>/views/', views.ViewViewSet.as_view({'get': 'list', 'post': 'create'}), name='view-list'),
    path('projects/<uuid:project_pk>/views/<uuid:pk>/', views.ViewViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='view-detail'),
    path('projects/<uuid:project_pk>/views/<uuid:view_pk>/fields/', views.ViewFieldViewSet.as_view({'get': 'list', 'post': 'create'}), name='viewfield-list'),
    path('projects/<uuid:project_pk>/views/<uuid:view_pk>/fields/<uuid:pk>/', views.ViewFieldViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='viewfield-detail'),
]