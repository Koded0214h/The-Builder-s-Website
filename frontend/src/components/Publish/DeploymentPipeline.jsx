// DeploymentPipeline.jsx
import React from 'react';

const DeploymentPipeline = ({ deploymentState }) => {
  const steps = [
    { number: 1, label: 'Build Project', key: 'isBuilding' },
    { number: 2, label: 'Run Tests', key: 'isTesting' },
    { number: 3, label: 'Deploy', key: 'isDeploying' }
  ];

  return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 glassmorphic">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-3 ${
                deploymentState.currentStep > step.number ? 'opacity-100' : 
                deploymentState.currentStep === step.number ? 'opacity-100' : 'opacity-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  deploymentState.currentStep > step.number ? 'bg-green-500' :
                  deploymentState[step.key] ? 'bg-primary animate-pulse' :
                  deploymentState.currentStep === step.number ? 'bg-primary' : 'bg-gray-600'
                }`}>
                  {deploymentState.currentStep > step.number ? '✓' : step.number}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{step.label}</p>
                  <p className={`text-xs ${
                    deploymentState[step.key] ? 'text-primary' :
                    deploymentState.currentStep > step.number ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {deploymentState[step.key] ? 'In progress...' :
                     deploymentState.currentStep > step.number ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="h-0.5 flex-1 bg-gray-700 mx-4">
                <div 
                  className="h-0.5 bg-primary transition-all duration-500"
                  style={{ width: deploymentState.currentStep > step.number ? '100%' : '0%' }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DeploymentPipeline;