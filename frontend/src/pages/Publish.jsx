// Publish.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import DeploymentPipeline from '../components/Publish/DeploymentPipeline';
import BuildConfiguration from '../components/Publish/BuildConfiguration';
import EnvironmentVariables from '../components/Publish/EnvironmentVariables';
import DeploymentTarget from '../components/Publish/DeploymentTarget';
import ExportOptions from '../components/Publish/ExportOptions';
import DeploymentLogs from '../components/Publish/DeploymentLogs';

const Publish = () => {
  const { projectId } = useParams();
  
  const [deploymentState, setDeploymentState] = useState({
    currentStep: 1, // 1: Build, 2: Test, 3: Deploy
    isBuilding: false,
    isTesting: false,
    isDeploying: false,
    isComplete: false
  });

  const [buildConfig, setBuildConfig] = useState({
    includeAuth: false,
    generateDocs: true,
    generateDockerfile: true,
    enableCI: false
  });

  const [environmentVars, setEnvironmentVars] = useState([
    { id: 1, key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost/db', isHidden: true },
    { id: 2, key: 'SECRET_KEY', value: 'your-secret-key-here', isHidden: true }
  ]);

  const [deploymentTarget, setDeploymentTarget] = useState('Heroku');
  const [logs, setLogs] = useState([]);

  // Simulate deployment process
  const startDeployment = async () => {
    setDeploymentState(prev => ({ ...prev, isBuilding: true, currentStep: 1 }));
    setLogs(['[INFO] Starting deployment process...']);

    // Build step
    await simulateStep('Building project...', 2000);
    setDeploymentState(prev => ({ ...prev, isBuilding: false, isTesting: true, currentStep: 2 }));

    // Test step
    await simulateStep('Running tests...', 1500);
    setDeploymentState(prev => ({ ...prev, isTesting: false, isDeploying: true, currentStep: 3 }));

    // Deploy step
    await simulateStep('Deploying to ' + deploymentTarget + '...', 3000);
    setDeploymentState(prev => ({ ...prev, isDeploying: false, isComplete: true }));
    
    addLog('[SUCCESS] Deployment completed successfully!');
  };

  const simulateStep = async (message, duration) => {
    addLog('[INFO] ' + message);
    await new Promise(resolve => setTimeout(resolve, duration));
  };

  const addLog = (message) => {
    setLogs(prev => [...prev, message]);
  };

  const handleBuildConfigChange = (key, value) => {
    setBuildConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleEnvironmentVarChange = (id, field, value) => {
    setEnvironmentVars(prev => 
      prev.map(varItem => 
        varItem.id === id ? { ...varItem, [field]: value } : varItem
      )
    );
  };

  const addEnvironmentVar = () => {
    setEnvironmentVars(prev => [
      ...prev,
      { id: Date.now(), key: '', value: '', isHidden: false }
    ]);
  };

  const removeEnvironmentVar = (id) => {
    setEnvironmentVars(prev => prev.filter(varItem => varItem.id !== id));
  };

  const handleExport = (type) => {
    console.log(`Exporting ${type}...`);
    // Simulate export functionality
    alert(`${type} export started!`);
  };

  const handlePublish = () => {
    console.log("Publishing project...");
    startDeployment();
  };

  const handleGenerateCode = () => {
    console.log("Generating code...");
    alert('Code generation completed!');
  };

  return (
    <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
      <Sidebar 
        onPublish={handlePublish} 
        onGenerateCode={handleGenerateCode}
        activeTab="publish" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-8">
          <Breadcrumbs projectName="E-commerce API" currentPage="Publish & Deploy" projectId={projectId} />
        </div>
        
        <div className="flex-1 overflow-hidden p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-gray-400 text-base font-medium">Build</span>
                <span className="text-gray-400 text-base font-medium">/</span>
                <span className="text-gray-400 text-base font-medium">Test</span>
                <span className="text-gray-400 text-base font-medium">/</span>
                <span className="text-white text-base font-medium">Deploy</span>
              </div>
              <h1 className="text-white text-4xl font-black tracking-tight">Publish & Deploy</h1>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
              {/* Left and Center Column */}
              <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
                {/* Visual Pipeline */}
                <DeploymentPipeline 
                  deploymentState={deploymentState}
                />

                {/* Build & Environment Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BuildConfiguration 
                    config={buildConfig}
                    onConfigChange={handleBuildConfigChange}
                  />
                  
                  <EnvironmentVariables 
                    variables={environmentVars}
                    onVariableChange={handleEnvironmentVarChange}
                    onAddVariable={addEnvironmentVar}
                    onRemoveVariable={removeEnvironmentVar}
                  />
                </div>

                {/* Deployment Logs */}
                <DeploymentLogs logs={logs} />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 flex flex-col gap-6 min-h-0">
                <DeploymentTarget 
                  target={deploymentTarget}
                  onTargetChange={setDeploymentTarget}
                  onDeploy={startDeployment}
                  deploymentState={deploymentState}
                />
                
                <ExportOptions onExport={handleExport} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publish;