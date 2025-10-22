from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
import zipfile
import io

from .models import Project, DatabaseModel, ModelField, Relationship
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer, 
    DatabaseModelSerializer, ModelFieldSerializer, 
    RelationshipSerializer, GeneratedProjectSerializer
)
from .permissions import IsOwnerOrReadOnly, IsProjectOwner
from .code_generators import DjangoCodeGenerator, ExpressCodeGenerator

class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).prefetch_related('database_models')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        project = self.get_object()
        
        # Determine the generator based on framework
        if project.framework == 'django':
            generator = DjangoCodeGenerator(project)
        else:
            generator = ExpressCodeGenerator(project)
        
        try:
            # Generate the project structure
            project_structure = generator.generate_project()
            
            # Create ZIP file
            zip_buffer = generator.create_zip_file(project_structure)
            
            # Prepare response
            response = HttpResponse(
                zip_buffer.getvalue(),
                content_type='application/zip'
            )
            response['Content-Disposition'] = f'attachment; filename="{project.name}_project.zip"'
            
            return response
            
        except Exception as e:
            return Response(
                {'error': f'Generation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def preview(self, request, pk=None):
        """Preview the generated code without downloading"""
        project = self.get_object()
        
        if project.framework == 'django':
            generator = DjangoCodeGenerator(project)
        else:
            generator = ExpressCodeGenerator(project)
        
        try:
            preview_data = generator.generate_preview()
            return Response(preview_data)
        except Exception as e:
            return Response(
                {'error': f'Preview generation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DatabaseModelViewSet(viewsets.ModelViewSet):
    serializer_class = DatabaseModelSerializer
    permission_classes = [IsAuthenticated, IsProjectOwner]
    
    def get_queryset(self):
        return DatabaseModel.objects.filter(project_id=self.kwargs['project_pk'])
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, pk=self.kwargs['project_pk'], owner=self.request.user)
        serializer.save(project=project)

class ModelFieldViewSet(viewsets.ModelViewSet):
    serializer_class = ModelFieldSerializer
    permission_classes = [IsAuthenticated, IsProjectOwner]
    
    def get_queryset(self):
        return ModelField.objects.filter(database_model__project_id=self.kwargs['project_pk'])
    
    def perform_create(self, serializer):
        database_model = get_object_or_404(
            DatabaseModel, 
            pk=self.kwargs['model_pk'],
            project_id=self.kwargs['project_pk']
        )
        serializer.save(database_model=database_model)

class RelationshipViewSet(viewsets.ModelViewSet):
    serializer_class = RelationshipSerializer
    permission_classes = [IsAuthenticated, IsProjectOwner]
    
    def get_queryset(self):
        return Relationship.objects.filter(from_model__project_id=self.kwargs['project_pk'])
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, pk=self.kwargs['project_pk'], owner=self.request.user)
        from_model = get_object_or_404(DatabaseModel, pk=self.request.data.get('from_model'), project=project)
        to_model = get_object_or_404(DatabaseModel, pk=self.request.data.get('to_model'), project=project)
        serializer.save(from_model=from_model, to_model=to_model)