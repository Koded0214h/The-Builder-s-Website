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
    path('api/', include(router.urls)),
    path('api/projects/<uuid:project_pk>/', include(project_router.urls)),
    path('api/projects/<uuid:project_pk>/models/<uuid:model_pk>/', include(model_router.urls)),
]