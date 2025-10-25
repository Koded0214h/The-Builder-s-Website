from rest_framework import permissions
from .models import Project, DatabaseModel, ModelField, Relationship

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the owner of the project.
        return obj.owner == request.user

class IsProjectOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a project to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the project
        
        # If obj is a Project
        if isinstance(obj, Project):
            return obj.owner == request.user
        
        # If obj is a DatabaseModel
        elif isinstance(obj, DatabaseModel):
            return obj.project.owner == request.user
        
        # If obj is a ModelField
        elif isinstance(obj, ModelField):
            return obj.database_model.project.owner == request.user
        
        # If obj is a Relationship
        elif isinstance(obj, Relationship):
            return obj.from_model.project.owner == request.user
        
        # If obj is a View
        elif hasattr(obj, 'project'):
            return obj.project.owner == request.user
        
        # If obj is a ViewField
        elif hasattr(obj, 'view'):
            return obj.view.project.owner == request.user
        
        # If obj is a URLRoute
        elif hasattr(obj, 'project'):
            return obj.project.owner == request.user
        
        # Default deny
        return False