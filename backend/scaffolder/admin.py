from django.contrib import admin
from .models import Project, DatabaseModel, ModelField, Relationship, GeneratedProject

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'framework', 'owner', 'created_at')
    list_filter = ('framework', 'created_at')
    search_fields = ('name', 'owner__username')

@admin.register(DatabaseModel)
class DatabaseModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'order')
    list_filter = ('project',)
    search_fields = ('name', 'project__name')

@admin.register(ModelField)
class ModelFieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'database_model', 'field_type')
    list_filter = ('field_type',)
    search_fields = ('name', 'database_model__name')

@admin.register(Relationship)
class RelationshipAdmin(admin.ModelAdmin):
    list_display = ('name', 'from_model', 'to_model', 'relationship_type')
    list_filter = ('relationship_type',)
    search_fields = ('name', 'from_model__name', 'to_model__name')

@admin.register(GeneratedProject)
class GeneratedProjectAdmin(admin.ModelAdmin):
    list_display = ('project', 'version', 'generated_at')
    list_filter = ('generated_at',)
    search_fields = ('project__name',)