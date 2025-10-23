// RouteConfiguration.jsx
import React, { useState, useEffect } from 'react';

const RouteConfiguration = ({ route, onUpdateRoute, onSaveChanges, isNew }) => {
  const [localRoute, setLocalRoute] = useState(route);
  const [activeTab, setActiveTab] = useState('path');

  useEffect(() => {
    setLocalRoute(route);
  }, [route]);

  const handleFieldChange = (field, value) => {
    const updatedRoute = { ...localRoute, [field]: value };
    setLocalRoute(updatedRoute);
    onUpdateRoute(updatedRoute);
  };

  const navigationItems = [
    { id: 'path', icon: 'route', label: 'Path' },
    { id: 'parameters', icon: 'tune', label: 'Parameters' },
    { id: 'nested', icon: 'account_tree', label: 'Nested Routes' }
  ];

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-neumorphic-in bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">route</span>
        </div>
        <div>
          <h1 className="text-white text-lg font-medium leading-normal">Route Configuration</h1>
          <p className="text-text-light/70 text-sm font-normal leading-normal">
            {localRoute.path}
          </p>
          {isNew && (
            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded mt-1 inline-block">New</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navigationItems.map(item => (
          <button
            key={item.id}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'bg-white/10' 
                : 'hover:bg-white/10'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={`material-symbols-outlined text-2xl ${
              activeTab === item.id ? 'text-primary' : 'text-text-light/80'
            }`}>
              {item.icon}
            </span>
            <p className={`text-sm font-medium leading-normal ${
              activeTab === item.id ? 'text-white' : 'text-text-light/80'
            }`}>
              {item.label}
            </p>
          </button>
        ))}
      </nav>

      {/* Configuration Form */}
      <div className="space-y-4">
        <div>
          <label className="text-text-light/80 text-sm font-medium mb-2 block">Path</label>
          <input
            className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={localRoute.path}
            onChange={(e) => handleFieldChange('path', e.target.value)}
            placeholder="/api/example/"
          />
        </div>

        <div>
          <label className="text-text-light/80 text-sm font-medium mb-2 block">View/Controller</label>
          <input
            className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={localRoute.view}
            onChange={(e) => handleFieldChange('view', e.target.value)}
            placeholder="ViewName"
          />
        </div>

        <div>
          <label className="text-text-light/80 text-sm font-medium mb-2 block">Route Name</label>
          <input
            className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={localRoute.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="route_name"
          />
        </div>

        <div>
          <label className="text-text-light/80 text-sm font-medium mb-2 block">Description</label>
          <textarea
            className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
            rows="3"
            value={localRoute.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Route description..."
          />
        </div>

        <div>
          <label className="text-text-light/80 text-sm font-medium mb-2 block">Permission Level</label>
          <select
            className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={localRoute.permission}
            onChange={(e) => handleFieldChange('permission', e.target.value)}
          >
            <option value="Public" className="text-black">Public</option>
            <option value="Authenticated" className="text-black">Authenticated</option>
            <option value="Admin Only" className="text-black">Admin Only</option>
          </select>
        </div>
      </div>

      {/* Advanced Settings */}
      <AdvancedSettings 
        route={localRoute}
        onFieldChange={handleFieldChange}
      />

      {/* Save Button */}
      <button
        onClick={onSaveChanges}
        className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] shadow-neumorphic-out hover:shadow-neumorphic-in transition-shadow mt-auto"
      >
        <span className="truncate">{isNew ? 'Create Route' : 'Save Changes'}</span>
      </button>
    </div>
  );
};

const AdvancedSettings = ({ route, onFieldChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details className="flex flex-col rounded-lg bg-white/10 group" open={isOpen}>
      <summary 
        className="flex cursor-pointer items-center justify-between gap-6 p-3 list-none"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <p className="text-white text-sm font-medium leading-normal">Advanced</p>
        <span className={`material-symbols-outlined text-text-light transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`}>
          expand_more
        </span>
      </summary>
      
      {isOpen && (
        <div className="p-3 border-t border-white/10 space-y-4">
          <div>
            <label className="text-text-light/80 text-sm font-medium mb-2 block">Namespace</label>
            <input
              className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              value={route.namespace}
              onChange={(e) => onFieldChange('namespace', e.target.value)}
              placeholder="e.g., v1"
            />
          </div>
          <div>
            <label className="text-text-light/80 text-sm font-medium mb-2 block">Custom Regex</label>
            <input
              className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              value={route.regex}
              onChange={(e) => onFieldChange('regex', e.target.value)}
              placeholder="e.g., [0-9]+"
            />
          </div>
        </div>
      )}
    </details>
  );
};

export default RouteConfiguration;