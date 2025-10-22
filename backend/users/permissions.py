from rest_framework import permissions

class IsUserOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has a `user` attribute.
    """
    
    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `user`
        return obj.user == request.user