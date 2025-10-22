from rest_framework import permissions

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
    Permission to only allow owners of the project to access related objects.
    """
    
    def has_permission(self, request, view):
        # Check if the related project belongs to the user
        if 'project_pk' in view.kwargs:
            from .models import Project
            try:
                project = Project.objects.get(pk=view.kwargs['project_pk'])
                return project.owner == request.user
            except Project.DoesNotExist:
                return False
        return True
    
    def has_object_permission(self, request, view, obj):
        return obj.project.owner == request.user