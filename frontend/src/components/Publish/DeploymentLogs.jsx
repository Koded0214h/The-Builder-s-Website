// DeploymentLogs.jsx
import React, { useEffect, useRef } from 'react';

const DeploymentLogs = ({ logs }) => {
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const getLogColor = (log) => {
    if (log.includes('[INFO]')) return 'text-blue-400';
    if (log.includes('[WARN]')) return 'text-yellow-400';
    if (log.includes('[ERROR]')) return 'text-red-400';
    if (log.includes('[SUCCESS]')) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="flex-1 bg-gray-900 rounded-xl border border-gray-700 flex flex-col min-h-0">
      <div className="px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-md font-bold text-white">Deployment Logs</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="font-mono text-xs space-y-1">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">Deployment logs will appear here...</p>
          ) : (
            logs.map((log, index) => (
              <p key={index} className={getLogColor(log)}>
                {log}
              </p>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default DeploymentLogs;