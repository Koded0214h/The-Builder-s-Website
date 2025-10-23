import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI, modelsAPI } from '../services/api';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import EmptyState from '../components/Database/EmptyState';
import VisualBuilder from '../components/Database/VisualBuilder';
import FieldPropertiesPanel from '../components/Database/FieldPropertiesPanel';

const Database = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [isNewField, setIsNewField] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(null);
  
  // Fetch project and models data
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      // Fetch project details
      const projectData = await projectsAPI.getProject(projectId);
      setProject(projectData);
      
      // Fetch models for this project
      const modelsData = await modelsAPI.getModels(projectId);
      setModels(modelsData.results || modelsData);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  // In your Database.jsx, update the handleAddModel function:
const handleAddModel = async () => {
  try {
    // Find the next available model number
    const usedNames = models.map(model => model.name);
    let modelNumber = 1;
    let newName = `Model${modelNumber}`;
    
    // Find the next available model name
    while (usedNames.includes(newName)) {
      modelNumber++;
      newName = `Model${modelNumber}`;
    }

    const newModelData = {
      name: newName,
      description: "",
      display_field: "id",
      order: models.length
    };

    console.log('🔧 Creating model with data:', newModelData);

    const createdModel = await modelsAPI.createModel(projectId, newModelData);
    console.log('✅ Model created successfully:', createdModel);
    
    setModels(prev => [...prev, createdModel]);
  } catch (err) {
    console.error('Error creating model:', err);
    setError('Failed to create model');
  }
};

  const handleDeleteModel = async (modelId) => {
    try {
      await modelsAPI.deleteModel(projectId, modelId);
      setModels(prev => prev.filter(model => model.id !== modelId));
    } catch (err) {
      console.error('Error deleting model:', err);
      setError('Failed to delete model');
    }
  };

  const handleGenerateCode = () => {
    console.log("Generate code clicked");
    // You can implement code generation logic here
  };

  const handlePublish = () => {
    console.log("Publish clicked");
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
    setIsNewField(false);
    setIsPropertiesPanelOpen(true);
  };

  const handleAddField = (modelId) => {
    setSelectedField(null);
    setIsNewField(true);
    setCurrentModelId(modelId);
    setIsPropertiesPanelOpen(true);
  };

  const handleModelUpdate = async (modelId, updateData) => {
    try {
      console.log('🔄 handleModelUpdate CALLED!', { modelId, updateData });
      console.log('📋 Current projectId:', projectId);
      
      const updatedModel = await modelsAPI.updateModel(projectId, modelId, updateData);
      console.log('✅ Model updated successfully:', updatedModel);
      
      // Update local state
      setModels(prev => {
        const newModels = prev.map(model => 
          model.id === modelId ? { ...model, ...updatedModel } : model
        );
        console.log('📋 Local state updated:', newModels);
        return newModels;
      });
      
    } catch (err) {
      console.error('❌ Error in handleModelUpdate:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(`Failed to update model: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
      throw err;
    }
  };

  const handleSaveField = async (fieldData, modelId) => {
    try {
      console.log('💾 handleSaveField called:', { fieldData, modelId, isNewField });
      console.log('📊 Field data details:', {
        name: fieldData.name,
        field_type: fieldData.field_type,
        max_length: fieldData.max_length,
        max_length_type: typeof fieldData.max_length,
        has_max_length: fieldData.max_length !== null && fieldData.max_length !== undefined
      });
      
      if (isNewField) {
        // Add new field
        console.log('📤 Creating field with data:', fieldData);
        
        const createdField = await modelsAPI.createField(projectId, modelId, fieldData);
        console.log('✅ Field created successfully:', createdField);
        
        // Update local state
        setModels(prev => prev.map(model => 
          model.id === modelId 
            ? { 
                ...model, 
                fields: [...(model.fields || []), createdField] 
              }
            : model
        ));
      } else {
        // Update existing field
        // Note: You'll need to implement updateField in your API
        // For now, we'll just update the local state
        setModels(prev => prev.map(model => ({
          ...model,
          fields: (model.fields || []).map(field => 
            field.id === selectedField.id ? { ...field, ...fieldData } : field
          )
        })));
      }
    } catch (err) {
      console.error('❌ Error saving field:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(`Failed to save field: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    } finally {
      setIsPropertiesPanelOpen(false);
      setSelectedField(null);
      setIsNewField(false);
      setCurrentModelId(null);
    }
  };

  const handleClosePropertiesPanel = () => {
    setIsPropertiesPanelOpen(false);
    setSelectedField(null);
    setIsNewField(false);
    setCurrentModelId(null);
  };

  // Transform backend models to frontend format
  const transformModelsForVisualBuilder = () => {
    return models.map(model => ({
      id: model.id,
      name: model.name,
      description: model.description,
      fields: model.fields || [],
      created_at: model.created_at,
      updated_at: model.updated_at
    }));
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
        <Sidebar onPublish={handlePublish} activeTab="database" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
        <Sidebar onPublish={handlePublish} activeTab="database" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button 
              onClick={fetchProjectData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const hasModels = models.length > 0;
  const visualBuilderModels = transformModelsForVisualBuilder();

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
      <Sidebar onPublish={handlePublish} activeTab="database" />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 flex-shrink-0">
          <Breadcrumbs 
            projectName={project?.name || "Project"} 
            currentPage="Database" 
            projectId={projectId} 
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          {!hasModels ? (
            <EmptyState onAddModel={handleAddModel} />
          ) : (
            <VisualBuilder
              models={visualBuilderModels}
              onAddModel={handleAddModel}
              onGenerateCode={handleGenerateCode}
              onFieldClick={handleFieldClick}
              onAddField={handleAddField}
              onDeleteModel={handleDeleteModel}
              onModelUpdate={handleModelUpdate}  // Add this line
            />
          )}
        </div>
      </main>

      <FieldPropertiesPanel
        isOpen={isPropertiesPanelOpen}
        onClose={handleClosePropertiesPanel}
        selectedField={selectedField}
        onSaveField={handleSaveField}
        isNewField={isNewField}
        modelId={currentModelId}
      />
    </div>
  );
};

export default Database;