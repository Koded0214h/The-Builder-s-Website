// DeploymentTarget.jsx
import React from 'react';

const DeploymentTarget = ({ target, onTargetChange, onDeploy, deploymentState }) => {
  const platforms = [
    'Heroku',
    'Vercel',
    'AWS Elastic Beanstalk',
    'DigitalOcean App Platform',
    'Railway',
    'Render'
  ];

  const getButtonText = () => {
    if (deploymentState.isBuilding) return 'Building...';
    if (deploymentState.isTesting) return 'Testing...';
    if (deploymentState.isDeploying) return 'Deploying...';
    if (deploymentState.isComplete) return 'Deployed Successfully';
    return 'Start Deployment';
  };

  return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 glassmorphic">
      <h2 className="text-xl font-bold text-white mb-4">Deployment Target</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2" htmlFor="platform">
            Platform
          </label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            id="platform"
            value={target}
            onChange={(e) => onTargetChange(e.target.value)}
          >
            {platforms.map(platform => (
              <option key={platform} value={platform} className="text-black">
                {platform}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onDeploy}
          disabled={deploymentState.isBuilding || deploymentState.isTesting || deploymentState.isDeploying}
          className={`w-full flex items-center justify-center rounded-lg h-12 px-6 text-base font-bold transition-all ${
            deploymentState.isComplete 
              ? 'bg-green-600 text-white cursor-default'
              : deploymentState.isBuilding || deploymentState.isTesting || deploymentState.isDeploying
              ? 'bg-primary/50 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined mr-2 text-lg">
            {deploymentState.isComplete ? 'check_circle' : 'rocket_launch'}
          </span>
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default DeploymentTarget;