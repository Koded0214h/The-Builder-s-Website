// Settings.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import ProjectDetails from '../components/Settings/ProjectDetails';
import FrameworkStack from '../components/Settings/FrameworkStack';
import ApiConfiguration from '../components/Settings/ApiConfiguration';

const Settings = () => {
  const { projectId } = useParams();
  
  const [settings, setSettings] = useState({
    projectName: 'E-commerce API',
    version: '1.0.0',
    description: 'An API for a modern e-commerce platform with product, user, and order management.',
    backendFramework: 'Express.js',
    database: 'MongoDB',
    authentication: 'JWT',
    apiBasePath: '/api/v1',
    pagination: true,
    corsAllowedOrigins: ''
  });

  const [originalSettings, setOriginalSettings] = useState({ ...settings });

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    // Simulate saving settings
    console.log("Saving settings...", settings);
    setOriginalSettings({ ...settings });
    alert('Settings saved successfully!');
  };

  const handleResetToDefaults = () => {
    const defaults = {
      projectName: 'New Project',
      version: '1.0.0',
      description: '',
      backendFramework: 'Django',
      database: 'PostgreSQL',
      authentication: 'JWT',
      apiBasePath: '/api/v1',
      pagination: true,
      corsAllowedOrigins: ''
    };
    
    setSettings(defaults);
    setOriginalSettings(defaults);
    alert('Settings reset to defaults!');
  };

  const handlePublish = () => {
    console.log("Publishing project with settings...", settings);
    alert('Project published successfully!');
  };

  const handleGenerateCode = () => {
    const code = generateProjectCode(settings);
    downloadCode(code, 'project_config.py');
  };

  const generateProjectCode = (settings) => {
    return `# Project Configuration
PROJECT_NAME = "${settings.projectName}"
VERSION = "${settings.version}"
DESCRIPTION = "${settings.description}"

# Framework & Stack
BACKEND_FRAMEWORK = "${settings.backendFramework}"
DATABASE = "${settings.database}"
AUTHENTICATION = "${settings.authentication}"

# API Configuration
API_BASE_PATH = "${settings.apiBasePath}"
PAGINATION = ${settings.pagination}
CORS_ALLOWED_ORIGINS = "${settings.corsAllowedOrigins}"`;
  };

  const downloadCode = (content, filename) => {
    const blob = new Blob([content], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return (
    <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
      <Sidebar 
        onPublish={handlePublish} 
        onGenerateCode={handleGenerateCode}
        activeTab="settings" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-8">
          <Breadcrumbs projectName={settings.projectName} currentPage="Settings" projectId={projectId} />
        </div>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black font-heading tracking-tight text-white">Project Settings</h1>
              <p className="text-gray-400 text-lg font-display mt-1">
                Configure your project's core settings
              </p>
              {hasChanges && (
                <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
                  <span className="material-symbols-outlined text-base">info</span>
                  You have unsaved changes
                </div>
              )}
            </div>

            {/* Settings Panel */}
            <div className="glassmorphism rounded-xl p-8 shadow-lg">
              <div className="space-y-12">
                <ProjectDetails 
                  settings={settings}
                  onSettingChange={handleSettingChange}
                />
                
                <FrameworkStack 
                  settings={settings}
                  onSettingChange={handleSettingChange}
                />
                
                <ApiConfiguration 
                  settings={settings}
                  onSettingChange={handleSettingChange}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
                  <button
                    onClick={handleResetToDefaults}
                    className="flex items-center justify-center rounded-lg h-12 px-6 bg-white/10 text-white text-sm font-bold shadow-neumorphic-outset hover:bg-white/20 transition-colors"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                    className={`flex items-center justify-center rounded-lg h-12 px-6 text-sm font-bold shadow-neumorphic-outset transition-colors ${
                      hasChanges 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;