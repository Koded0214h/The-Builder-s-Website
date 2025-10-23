// EnvironmentVariables.jsx
import React from 'react';

const EnvironmentVariables = ({ variables, onVariableChange, onAddVariable, onRemoveVariable }) => {
  return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 glassmorphic">
      <h2 className="text-xl font-bold text-white mb-4">Environment Variables</h2>
      <div className="space-y-3">
        {variables.map((variable, index) => (
          <div key={variable.id} className="flex gap-2 items-start">
            <input
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Key"
              value={variable.key}
              onChange={(e) => onVariableChange(variable.id, 'key', e.target.value)}
            />
            <input
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Value"
              type={variable.isHidden ? 'password' : 'text'}
              value={variable.value}
              onChange={(e) => onVariableChange(variable.id, 'value', e.target.value)}
            />
            {variables.length > 1 && (
              <button
                onClick={() => onRemoveVariable(variable.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddVariable}
          className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2 justify-center py-2"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add Variable
        </button>
      </div>
    </div>
  );
};

export default EnvironmentVariables;