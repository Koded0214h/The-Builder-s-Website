from rest_framework import serializers
from .models import Project, DatabaseModel, ModelField, Relationship, GeneratedProject, View, ViewField

class ModelFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelField
        fields = ['id', 'name', 'field_type', 'max_length', 'null', 'blank', 
                 'unique', 'default_value', 'help_text', 'order']
        read_only_fields = ('id',)

class RelationshipSerializer(serializers.ModelSerializer):
    from_model_name = serializers.CharField(source='from_model.name', read_only=True)
    to_model_name = serializers.CharField(source='to_model.name', read_only=True)
    
    class Meta:
        model = Relationship
        fields = '__all__'
        read_only_fields = ('id',)

class DatabaseModelSerializer(serializers.ModelSerializer):
    fields = ModelFieldSerializer(many=True, read_only=True)
    outgoing_relationships = RelationshipSerializer(many=True, read_only=True)
    incoming_relationships = serializers.SerializerMethodField()
    
    class Meta:
        model = DatabaseModel
        fields = [
            'id', 'name', 'description', 'display_field', 'order',
            'fields', 'outgoing_relationships', 'incoming_relationships'
        ]
        read_only_fields = ('id',)
    
    def get_incoming_relationships(self, obj):
        relationships = Relationship.objects.filter(to_model=obj)
        return RelationshipSerializer(relationships, many=True).data

class ProjectListSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    model_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'framework', 'owner_username', 
                 'created_at', 'model_count')
        read_only_fields = ('id', 'created_at')
    
    def get_model_count(self, obj):
        return obj.database_models.count()

class ProjectDetailSerializer(ProjectListSerializer):
    database_models = DatabaseModelSerializer(many=True, read_only=True)
    
    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + (
            'include_docker', 'include_cors', 'include_rate_limiting', 
            'include_logging', 'include_env_example', 'database_models'
        )

class GeneratedProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedProject
        fields = '__all__'
        read_only_fields = ('id', 'generated_at')
        
        
# In your serializers.py, add View serializers
class ViewFieldSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source='model_field.name', read_only=True)
    field_type = serializers.CharField(source='model_field.field_type', read_only=True)
    
    class Meta:
        model = ViewField
        fields = ['id', 'model_field', 'field_name', 'field_type', 'order']
        read_only_fields = ('id',)

class ViewSerializer(serializers.ModelSerializer):
    included_fields = ViewFieldSerializer(many=True, read_only=True)
    model_name = serializers.CharField(source='model.name', read_only=True)
    
    class Meta:
        model = View
        fields = [
            'id', 'name', 'model', 'model_name', 'view_type', 'description',
            'permissions', 'pagination_enabled', 'page_size', 
            'ordering_fields', 'search_fields', 'filter_fields',
            'included_fields', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')