// ApiConfiguration.jsx
import React from 'react';

const ApiConfiguration = ({ settings, onSettingChange }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold font-heading text-white mb-6 border-b border-white/10 pb-4">
        API Configuration
      </h2>
      <div className="space-y-6">
        {/* API Base Path */}
        <label className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">API Base Path</p>
          <input
            className="w-full md:w-1/2 rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 placeholder:text-gray-500 p-4 text-base font-normal text-black shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={settings.apiBasePath}
            onChange={(e) => onSettingChange('apiBasePath', e.target.value)}
          />
        </label>

        {/* Pagination Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium leading-normal text-white">Pagination</p>
            <p className="text-sm text-gray-400">Enable default pagination for list endpoints.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pagination}
              onChange={(e) => onSettingChange('pagination', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-[#2C2C2C] shadow-neumorphic-inset peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* CORS Allowed Origins */}
        <div className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">CORS Allowed Origins</p>
          <p className="text-sm text-gray-400 mb-2">Enter comma-separated domains.</p>
          <input
            className="w-full rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 placeholder:text-gray-500 p-4 text-base font-normal text-black shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="e.g., https://example.com, http://localhost:3000"
            value={settings.corsAllowedOrigins}
            onChange={(e) => onSettingChange('corsAllowedOrigins', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default ApiConfiguration;