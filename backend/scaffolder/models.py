from django.db import models
from django.conf import settings
import uuid

class Project(models.Model):
    FRAMEWORK_CHOICES = [
        ('django', 'Django + DRF'),
        ('express', 'Express.js + Sequelize'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    framework = models.CharField(max_length=20, choices=FRAMEWORK_CHOICES, default='django')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    
    # Boilerplate options
    include_docker = models.BooleanField(default=False)
    include_cors = models.BooleanField(default=True)
    include_rate_limiting = models.BooleanField(default=False)
    include_logging = models.BooleanField(default=False)
    include_env_example = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'name']
    
    def __str__(self):
        return self.name

class DatabaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='database_models')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    display_field = models.CharField(max_length=255, blank=True)  # Field to use for __str__
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
        unique_together = ['project', 'name']
    
    def __str__(self):
        return f"{self.project.name}.{self.name}"

class ModelField(models.Model):
    FIELD_TYPES = [
        ('char', 'CharField'),
        ('text', 'TextField'),
        ('integer', 'IntegerField'),
        ('boolean', 'BooleanField'),
        ('date', 'DateField'),
        ('datetime', 'DateTimeField'),
        ('email', 'EmailField'),
        ('url', 'URLField'),
        ('image', 'ImageField'),
        ('file', 'FileField'),
        ('decimal', 'DecimalField'),
        ('float', 'FloatField'),
        ('json', 'JSONField'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    database_model = models.ForeignKey(DatabaseModel, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=255)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES, default='char')
    max_length = models.IntegerField(null=True, blank=True)
    null = models.BooleanField(default=False)
    blank = models.BooleanField(default=False)
    unique = models.BooleanField(default=False)
    default_value = models.TextField(blank=True)
    help_text = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
        unique_together = ['database_model', 'name']
    
    def __str__(self):
        return f"{self.database_model.name}.{self.name}"

class Relationship(models.Model):
    RELATIONSHIP_TYPES = [
        ('foreign_key', 'Foreign Key'),
        ('one_to_one', 'One-to-One'),
        ('many_to_many', 'Many-to-Many'),
    ]
    
    ON_DELETE_CHOICES = [
        ('cascade', 'CASCADE'),
        ('protect', 'PROTECT'),
        ('set_null', 'SET_NULL'),
        ('set_default', 'SET_DEFAULT'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_model = models.ForeignKey(DatabaseModel, on_delete=models.CASCADE, related_name='outgoing_relationships')
    to_model = models.ForeignKey(DatabaseModel, on_delete=models.CASCADE, related_name='incoming_relationships')
    relationship_type = models.CharField(max_length=20, choices=RELATIONSHIP_TYPES)
    name = models.CharField(max_length=255)
    on_delete = models.CharField(max_length=20, choices=ON_DELETE_CHOICES, default='cascade')
    related_name = models.CharField(max_length=255, blank=True)
    null = models.BooleanField(default=True)
    blank = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['from_model', 'name']
    
    def __str__(self):
        return f"{self.from_model.name}.{self.name} -> {self.to_model.name}"

class GeneratedProject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='generations')
    generated_code = models.JSONField(default=dict)
    version = models.IntegerField(default=1)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-generated_at']
        unique_together = ['project', 'version']
    
    def __str__(self):
        return f"{self.project.name} v{self.version}"
    
    
# In your models.py, add View and related models
class View(models.Model):
    VIEW_TYPES = [
        ('list', 'List View'),
        ('detail', 'Detail View'),
        ('create', 'Create View'),
        ('update', 'Update View'),
        ('destroy', 'Delete View'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='views')
    name = models.CharField(max_length=255)
    model = models.ForeignKey(DatabaseModel, on_delete=models.CASCADE, related_name='views')
    view_type = models.CharField(max_length=20, choices=VIEW_TYPES, default='list')
    description = models.TextField(blank=True)
    
    # Permissions
    permissions = models.JSONField(default=list, blank=True)  # Store as list of permission strings
    
    # Pagination
    pagination_enabled = models.BooleanField(default=True)
    page_size = models.IntegerField(default=20)
    
    # Ordering
    ordering_fields = models.JSONField(default=list, blank=True)
    
    # Search
    search_fields = models.JSONField(default=list, blank=True)
    
    # Filtering
    filter_fields = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['project', 'name']
    
    def __str__(self):
        return f"{self.project.name}.{self.name}"

class ViewField(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    view = models.ForeignKey(View, on_delete=models.CASCADE, related_name='included_fields')
    model_field = models.ForeignKey(ModelField, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        unique_together = ['view', 'model_field']
    
    def __str__(self):
        return f"{self.view.name}.{self.model_field.name}"