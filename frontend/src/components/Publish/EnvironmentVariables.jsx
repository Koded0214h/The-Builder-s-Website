import React from 'react';

const EnvironmentVariables = ({ variables, onVariableChange, onAddVariable, onRemoveVariable }) => {
  return (
    <div className="glassmorphism rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Environment Variables</h2>
        <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
          {variables.length} variables
        </span>
      </div>
      <div className="space-y-3">
        {variables.map((variable) => (
          <div key={variable.id} className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <input
                className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Key"
                value={variable.key}
                onChange={(e) => onVariableChange(variable.id, 'key', e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <input
                className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Value"
                type={variable.isHidden ? 'password' : 'text'}
                value={variable.value}
                onChange={(e) => onVariableChange(variable.id, 'value', e.target.value)}
              />
            </div>
            {variables.length > 1 && (
              <button
                onClick={() => onRemoveVariable(variable.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddVariable}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Environment Variable
        </button>
      </div>
    </div>
  );
};

export default EnvironmentVariables;