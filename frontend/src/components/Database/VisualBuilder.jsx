import ModelCard from './ModelCard';
import { useState, useCallback, useEffect } from 'react';
import FloatingToolbar from './FloatingToolbar';
import RelationshipLine from './RelationshipLine';
import RelationshipTypeModal from './RelationshipTypeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const VisualBuilder = ({ models, onAddModel, onGenerateCode, onFieldClick, onAddField, onDeleteModel, onDeleteRelationship, onModelUpdate  }) => {
  // Initialize model positions based on models prop
  const [modelPositions, setModelPositions] = useState({});
  const [relationships, setRelationships] = useState([]);
  const [isRelationshipMode, setIsRelationshipMode] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoom, setZoom] = useState(1);

  // Initialize model positions when models change
  useEffect(() => {
    const newPositions = {};
    models.forEach((model, index) => {
      // Keep existing position if model already has one, otherwise assign new position
      if (modelPositions[model.id]) {
        newPositions[model.id] = modelPositions[model.id];
      } else {
        newPositions[model.id] = { 
          x: 250 + (index * 300), 
          y: 150 + (index % 2 === 0 ? 0 : 200) 
        };
      }
    });
    setModelPositions(newPositions);
  }, [models]); // Only run when models array changes


  // Keyboard shortcuts
  // In your VisualBuilder.jsx, update the keyboard handler:
useEffect(() => {
  const handleKeyDown = (e) => {
    // Don't handle shortcuts in relationship mode
    if (isRelationshipMode) {
      return;
    }

    // Check if we're in any kind of form input
    const isEditing = 
      e.target.tagName === 'INPUT' || 
      e.target.tagName === 'TEXTAREA' || 
      e.target.isContentEditable;
    
    if (isEditing) {
      // Don't handle global shortcuts when editing
      return;
    }

    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItem) {
      e.preventDefault(); // Prevent browser back navigation
      handleDeleteClick(selectedItem);
    }
    
    if (e.key === 'Escape') {
      setSelectedItem(null);
      setIsRelationshipMode(false);
      setSelectedFields([]);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedItem, isRelationshipMode]); // Add isRelationshipMode to dependencies

  const updateModelPosition = useCallback((modelId, newPosition) => {
    setModelPositions(prev => ({
      ...prev,
      [modelId]: newPosition
    }));
  }, []);

  const handleModelUpdate = useCallback(async (modelId, updateData) => {
    console.log('🔄 VisualBuilder handleModelUpdate called:', { modelId, updateData });
    if (onModelUpdate) {
      await onModelUpdate(modelId, updateData);
    } else {
      console.error('❌ onModelUpdate is not provided to VisualBuilder!');
    }
  }, [onModelUpdate]);

  const handleFieldClickForRelationship = useCallback((field, modelId) => {
    if (!isRelationshipMode) return;

    const fieldWithModel = {
      ...field,
      modelId,
      modelName: models.find(m => m.id === modelId)?.name || `Model ${modelId}`,
      modelPosition: modelPositions[modelId],
      fieldIndex: models.find(m => m.id === modelId)?.fields?.findIndex(f => f.name === field.name) || 0
    };
    
    setSelectedFields(prev => {
      // Prevent selecting the same field twice
      if (prev.some(f => f.modelId === modelId && f.name === field.name)) {
        return prev;
      }
      
      const newSelection = [...prev, fieldWithModel];
      
      // If we have two fields selected, create a relationship
      if (newSelection.length === 2) {
        const [from, to] = newSelection;
        
        // Store relative positions for dynamic updates
        const newRelationship = {
          id: Date.now(),
          from: { 
            modelId: from.modelId,
            fieldName: from.name,
            fieldType: from.field_type,
            modelName: from.modelName,
            fieldIndex: from.fieldIndex,
            relativeX: 256, // Right side of model
            relativeY: 80 + (from.fieldIndex * 40) // Based on field position
          },
          to: { 
            modelId: to.modelId,
            fieldName: to.name,
            fieldType: to.field_type,
            modelName: to.modelName,
            fieldIndex: to.fieldIndex,
            relativeX: 0, // Left side of model
            relativeY: 80 + (to.fieldIndex * 40) // Based on field position
          },
          type: '1:M' // We'll set this from the modal
        };

        setRelationships(prev => [...prev, newRelationship]);
        setIsRelationshipMode(false);
        setSelectedFields([]);
        return [];
      }
      
      return newSelection;
    });
  }, [isRelationshipMode, modelPositions, models]);

  const handleModelSelect = useCallback((modelId) => {
    setSelectedItem({ type: 'model', id: modelId });
    setSelectedFields([]);
  }, []);

  const handleRelationshipSelect = useCallback((relationshipId) => {
    setSelectedItem({ type: 'relationship', id: relationshipId });
  }, []);

  // In VisualBuilder.jsx, update the handleCanvasClick:
const handleCanvasClick = useCallback((e) => {
  // In relationship mode, clicking canvas should cancel relationship mode
  if (isRelationshipMode) {
    setIsRelationshipMode(false);
    setSelectedFields([]);
    return;
  }
  
  // Only deselect if clicking on empty canvas (not a model or relationship)
  if (e.target.tagName === 'svg' || e.target.className?.includes?.('canvas-area')) {
    setSelectedItem(null);
  }
}, [isRelationshipMode]);

  const handleDeleteClick = useCallback((item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) {
      if (selectedItem.type === 'model' && onDeleteModel) {
        onDeleteModel(selectedItem.id);
        // Also remove relationships connected to this model
        setRelationships(prev => prev.filter(rel => 
          rel.from.modelId !== selectedItem.id && rel.to.modelId !== selectedItem.id
        ));
      } else if (selectedItem.type === 'relationship') {
        setRelationships(prev => prev.filter(rel => rel.id !== selectedItem.id));
        if (onDeleteRelationship) {
          onDeleteRelationship(selectedItem.id);
        }
      }
    }
    setShowDeleteModal(false);
    setSelectedItem(null);
  }, [selectedItem, onDeleteModel, onDeleteRelationship]);

  const handleRelationshipMode = useCallback(() => {
    if (isRelationshipMode) {
      setIsRelationshipMode(false);
      setSelectedFields([]);
    } else {
      setShowRelationshipModal(true);
    }
  }, [isRelationshipMode]);

  const handleSelectRelationshipType = useCallback((type) => {
    setShowRelationshipModal(false);
    setIsRelationshipMode(true);
    setSelectedFields([]);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const cancelRelationshipMode = useCallback(() => {
    setIsRelationshipMode(false);
    setSelectedFields([]);
  }, []);

  // Calculate current relationship points based on model positions
  const getRelationshipPoints = useCallback((relationship) => {
    const fromModelPos = modelPositions[relationship.from.modelId];
    const toModelPos = modelPositions[relationship.to.modelId];
    
    if (!fromModelPos || !toModelPos) return { from: null, to: null };

    return {
      from: {
        x: fromModelPos.x + relationship.from.relativeX,
        y: fromModelPos.y + relationship.from.relativeY
      },
      to: {
        x: toModelPos.x + relationship.to.relativeX,
        y: toModelPos.y + relationship.to.relativeY
      }
    };
  }, [modelPositions]);

  const getSelectedModel = selectedItem?.type === 'model' 
    ? models.find(m => m.id === selectedItem.id)
    : null;

  const getSelectedRelationship = selectedItem?.type === 'relationship'
    ? relationships.find(r => r.id === selectedItem.id)
    : null;

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Header with Selection Info */}
      <div className="px-8 pb-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white font-display">Database Designer</h1>
            <p className="text-primary-text mt-1">
              {selectedItem ? (
                <span>
                  <span className="text-primary font-semibold">
                    {selectedItem.type === 'model' ? `Selected: ${getSelectedModel?.name}` : `Selected: Relationship`}
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Delete</kbd> to remove
                  </span>
                </span>
              ) : isRelationshipMode ? (
                <span>
                  <span className="text-primary font-semibold">Relationship Mode Active</span> - Click two fields to create a relationship
                  {selectedFields.length > 0 && (
                    <span className="ml-2 text-yellow-400">
                      ({selectedFields.length}/2 selected)
                    </span>
                  )}
                </span>
              ) : (
                'Drag and drop to design your database schema'
              )}
            </p>
            
            {selectedItem?.type === 'relationship' && getSelectedRelationship && (
              <div className="mt-2 text-sm text-primary-text">
                <p>
                  {getSelectedRelationship.from.modelName}.{getSelectedRelationship.from.fieldName} → 
                  {getSelectedRelationship.to.modelName}.{getSelectedRelationship.to.fieldName}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {selectedItem && (
              <button 
                onClick={() => handleDeleteClick(selectedItem)}
                className="bg-red-500 text-white font-display font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete
              </button>
            )}
            
            {isRelationshipMode && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={cancelRelationshipMode}
                  className="bg-red-500 text-white font-display font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            
            <button 
              onClick={onAddModel}
              className="bg-primary text-white font-display font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add Model
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        className="flex-1 relative bg-gradient-to-br from-background-dark to-accent-dark min-h-0 overflow-hidden canvas-area"
        onClick={handleCanvasClick}
      >
        {/* SVG for relationship lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {relationships.map(relationship => {
            const points = getRelationshipPoints(relationship);
            if (!points.from || !points.to) return null;
            
            const isSelected = selectedItem?.type === 'relationship' && selectedItem.id === relationship.id;
            
            return (
              <g 
                key={relationship.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRelationshipSelect(relationship.id);
                }}
              >
                <RelationshipLine
                  from={points.from}
                  to={points.to}
                  type={relationship.type}
                  fromField={relationship.from.fieldName}
                  toField={relationship.to.fieldName}
                />
                {isSelected && (
                  <rect
                    x={Math.min(points.from.x, points.to.x) - 10}
                    y={Math.min(points.from.y, points.to.y) - 10}
                    width={Math.abs(points.to.x - points.from.x) + 20}
                    height={Math.abs(points.to.y - points.from.y) + 20}
                    fill="none"
                    stroke="#bc06f9"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    rx="8"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Model Cards */}
        {models.map((model) => {
          const position = modelPositions[model.id];
          // Only render if position is available
          if (!position) return null;
          
          return (
            <ModelCard
              key={model.id}
              model={model}
              position={position}
              onFieldClick={onFieldClick}
              onAddField={onAddField}
              onFieldClickForRelationship={handleFieldClickForRelationship}
              onModelSelect={handleModelSelect}
              onModelUpdate={handleModelUpdate} // ← ADD THIS LINE
              isRelationshipMode={isRelationshipMode}
              isSelected={selectedItem?.type === 'model' && selectedItem.id === model.id}
              zoom={zoom}
              onPositionChange={updateModelPosition}
            />
          );
        })}

        {/* Floating Toolbar */}
        <FloatingToolbar 
          onAddModel={onAddModel}
          onGenerateCode={onGenerateCode}
          onRelationshipMode={handleRelationshipMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isRelationshipMode={isRelationshipMode}
        />
      </div>

      {/* Relationship Type Modal */}
      <RelationshipTypeModal
        isOpen={showRelationshipModal}
        onClose={() => setShowRelationshipModal(false)}
        onSelectType={handleSelectRelationshipType}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemType={selectedItem?.type === 'model' ? 'Model' : 'Relationship'}
        itemName={selectedItem?.type === 'model' 
          ? getSelectedModel?.name 
          : getSelectedRelationship 
            ? `${getSelectedRelationship.from.modelName}.${getSelectedRelationship.from.fieldName} → ${getSelectedRelationship.to.modelName}.${getSelectedRelationship.to.fieldName}`
            : 'Relationship'
        }
      />
    </div>
  );
};

export default VisualBuilder;