// LiveUrlPreview.jsx
import React from 'react';

const LiveUrlPreview = ({ route }) => {
  const generateDjangoUrlPattern = (route) => {
    let djangoPath = route.path.replace(/{(\w+)}/g, '<int:$1>');
    
    if (route.regex) {
      djangoPath = route.path.replace(/{(\w+)}/g, `<${route.regex}:$1>`);
    }
    
    return `path('${djangoPath}', views.${route.view || route.name}, name='${route.name.toLowerCase()}')`;
  };

  const generateExpressRoute = (route) => {
    const expressPath = route.path.replace(/{(\w+)}/g, ':$1');
    return `app.${getHttpMethod(route)}('${expressPath}', ${route.view || route.name});`;
  };

  const getHttpMethod = (route) => {
    if (route.path.includes('{id}') && !route.path.endsWith('/')) {
      return 'get';
    }
    return route.path.endsWith('/') ? 'get' : 'post';
  };

  return (
    <div className="border-t border-white/10 p-6 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-base font-medium">Live URL Preview</h2>
        <span className="text-xs text-text-light/70 bg-surface-dark px-2 py-1 rounded">
          Django
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Django URL Pattern */}
        <div className="bg-surface-dark rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded">
              Django
            </span>
          </div>
          <pre className="font-mono text-sm text-text-light/90 overflow-x-auto whitespace-pre">
            <code>{generateDjangoUrlPattern(route)}</code>
          </pre>
        </div>

        {/* Express Route */}
        <div className="bg-surface-dark rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-green-400 bg-green-400/20 px-2 py-1 rounded">
              Express
            </span>
          </div>
          <pre className="font-mono text-sm text-text-light/90 overflow-x-auto whitespace-pre">
            <code>{generateExpressRoute(route)}</code>
          </pre>
        </div>

        {/* Full URL Example */}
        <div className="bg-surface-dark rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-blue-400 bg-blue-400/20 px-2 py-1 rounded">
              Example
            </span>
          </div>
          <pre className="font-mono text-sm text-text-light/90 overflow-x-auto whitespace-pre">
            <code>http://localhost:8000{route.path.replace(/{(\w+)}/g, '1')}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LiveUrlPreview;