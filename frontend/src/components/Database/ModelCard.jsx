import { useState, useCallback } from 'react';

const ModelCard = ({ 
  model, 
  position = { x: 100, y: 100 }, 
  onFieldClick, 
  onAddField,
  onFieldClickForRelationship,
  isRelationshipMode = false,
  zoom = 1,
  onPositionChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);

  const fieldTypeMap = {
    'CharField': 'String',
    'TextField': 'Text',
    'IntegerField': 'Integer',
    'BooleanField': 'Boolean',
    'DateTimeField': 'DateTime',
    'EmailField': 'Email',
    'URLField': 'URL',
    'DecimalField': 'Decimal',
    'FloatField': 'Float',
    'JSONField': 'JSON',
  };

  const fieldTypeColors = {
    'Integer': 'bg-indigo-500/20 text-indigo-300',
    'String': 'bg-sky-500/20 text-sky-300',
    'Text': 'bg-blue-500/20 text-blue-300',
    'Boolean': 'bg-purple-500/20 text-purple-300',
    'DateTime': 'bg-teal-500/20 text-teal-300',
    'Email': 'bg-orange-500/20 text-orange-300',
    'URL': 'bg-amber-500/20 text-amber-300',
    'Decimal': 'bg-green-500/20 text-green-300',
    'Float': 'bg-emerald-500/20 text-emerald-300',
    'JSON': 'bg-pink-500/20 text-pink-300',
  };

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y
    });
  }, [currentPosition]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    const newPosition = { x: newX, y: newY };
    setCurrentPosition(newPosition);
    
    // Notify parent about position change in real-time
    if (onPositionChange) {
      onPositionChange(model.id, newPosition);
    }
  }, [isDragging, dragOffset, model.id, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFieldClick = useCallback((field) => {
    if (isRelationshipMode && onFieldClickForRelationship) {
      onFieldClickForRelationship(field, model.id);
    } else if (onFieldClick) {
      onFieldClick(field);
    }
  }, [isRelationshipMode, onFieldClickForRelationship, onFieldClick, model.id]);

  return (
    <div 
      className={`absolute w-64 rounded-xl bg-accent-dark shadow-neumorphic p-4 font-body transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${isRelationshipMode ? 'ring-2 ring-primary/50' : 'ring-2 ring-transparent'}`}
      style={{ 
        top: currentPosition.y, 
        left: currentPosition.x,
        transform: `scale(${zoom}) ${isDragging ? 'scale(1.02)' : 'scale(1)'}`,
        zIndex: isDragging ? 1000 : 1,
        transformOrigin: 'top left'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="flex justify-between items-center pb-3 border-b border-gray-700/50 mb-3 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h3 className="font-display font-semibold text-lg text-white">{model.name}</h3>
        <span className="material-symbols-outlined text-gray-500">drag_indicator</span>
      </div>
      
      <div className="space-y-2">
        {model.fields.map((field, index) => (
          <div 
            key={index}
            className={`flex justify-between items-center text-sm cursor-pointer p-2 rounded transition-all duration-200 group ${
              isRelationshipMode 
                ? 'hover:bg-primary/20 hover:ring-1 hover:ring-primary/50' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => handleFieldClick(field)}
          >
            <div className="flex items-center gap-2">
              <span className={`group-hover:text-white ${
                isRelationshipMode ? 'text-primary font-medium' : 'text-primary-text'
              }`}>
                {field.name}
              </span>
              {field.unique && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1 rounded">U</span>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${fieldTypeColors[fieldTypeMap[field.field_type]] || 'bg-gray-500/20 text-gray-300'}`}>
              {fieldTypeMap[field.field_type] || field.field_type}
              {field.field_type === 'CharField' && field.max_length && `(${field.max_length})`}
            </span>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => onAddField(model.id)}
        className="mt-4 w-full text-center py-2 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/80 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Add Field
      </button>
    </div>
  );
};

export default ModelCard;