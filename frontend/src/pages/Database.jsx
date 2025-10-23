import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import EmptyState from '../components/Database/EmptyState';
import VisualBuilder from '../components/Database/VisualBuilder';
import FieldPropertiesPanel from '../components/Database/FieldPropertiesPanel';

const Database = () => {
  const { projectId } = useParams();
  const [hasModels, setHasModels] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [isNewField, setIsNewField] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(null);
  
  const [models, setModels] = useState([
    {
      id: 1,
      name: "User",
      fields: [
        { name: "id", field_type: "IntegerField", unique: true },
        { name: "username", field_type: "CharField", max_length: 150, unique: true },
        { name: "email", field_type: "EmailField", unique: true },
        { name: "created_at", field_type: "DateTimeField" }
      ]
    },
    {
      id: 2,
      name: "Product",
      fields: [
        { name: "id", field_type: "IntegerField", unique: true },
        { name: "name", field_type: "CharField", max_length: 255 },
        { name: "price", field_type: "DecimalField" },
        { name: "owner_id", field_type: "IntegerField" }
      ]
    }
  ]);

  const handleAddModel = () => {
    setHasModels(true);
    // Add new model logic
    const newModel = {
      id: Date.now(),
      name: `Model${models.length + 1}`,
      fields: []
    };
    setModels([...models, newModel]);
  };

  const handleGenerateCode = () => {
    console.log("Generate code clicked");
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

  const handleSaveField = (fieldData, modelId) => {
    if (isNewField) {
      // Add new field
      setModels(models.map(model => 
        model.id === modelId 
          ? { ...model, fields: [...model.fields, { ...fieldData, id: Date.now() }] }
          : model
      ));
    } else {
      // Update existing field
      setModels(models.map(model => ({
        ...model,
        fields: model.fields.map(field => 
          field.name === selectedField.name ? { ...field, ...fieldData } : field
        )
      })));
    }
  };

  const handleClosePropertiesPanel = () => {
    setIsPropertiesPanelOpen(false);
    setSelectedField(null);
    setIsNewField(false);
    setCurrentModelId(null);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
      <Sidebar onPublish={handlePublish} activeTab="database" />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 flex-shrink-0">
          <Breadcrumbs projectName="E-commerce API" currentPage="Database" projectId={projectId} />
        </div>
        
        <div className="flex-1 overflow-hidden">
          {!hasModels ? (
            <EmptyState onAddModel={handleAddModel} />
          ) : (
            <VisualBuilder
              models={models}
              onAddModel={handleAddModel}
              onGenerateCode={handleGenerateCode}
              onFieldClick={handleFieldClick}
              onAddField={handleAddField}
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